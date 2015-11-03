'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = new Grid(mongoose.connection.db);
var _ = require('lodash');
var Application = mongoose.model('Application');
var Applicant = mongoose.model('Applicant');
var WorksheetField = mongoose.model('WorksheetField');
var async = require('async');
var mime = require('mime-types');
var Q = require('q');

/**
 * Application middleware
 */
exports.applicationByID = function (req, res, next, id) {

  Application.findById(id)
    .populate('applicant')
    .populate('opening')
    .populate('reviewPhase.reviews.reviewer')
    //@todo make the return of the commenter safe - currently returning tmi
    .populate('reviewPhase.reviews.reviewWorksheet.comments.commenter')
    .populate('phoneInterviewPhase.phoneInterviews.interviewer')
    .populate('phoneInterviewPhase.phoneInterviews.phoneInterviewWorksheet.comments.commenter')
    .exec(function (err, application) {

      if (err) {
        return next(err);
      }

      if (!application) {
        return next(new Error('Failed to load application ' + id));
      }
      //if there is a cv or coverLetter attached, we need to fetch the associated file metadata
      if(application.cv || application.coverLetter) {
        getFiles(application)
          .then(function(result) {
            req.application = result;
            next();
          });
      } else {
        req.application = application;
        next();
      }
    });
};

exports.addFile = function (req, res, next) {
  var application = req.application;
  var uploadType = req.params.type;
  if(req.newFileId) {

    if (uploadType === 'cv') {
      application.cv = req.newFileId;
    } else if (uploadType === 'coverLetter') {
      application.coverLetter = req.newFileId;
    }
    next();
  } else {
    req.send(400, {message: 'An error was encountered while trying to add the file to the application'});
  }
};

/**
 * Method to retrieve Application for the purposes of conducting a review
 * @param req
 * @param res
 * @returns {*}
 */
exports.conductReview = function (req, res) {
  if (isReviewer(req)) {
    return res.jsonp(req.application);
  } else {
    return res.send(400, {
      message: 'You are not an assigned Reviewer for this Application'
    });
  }
};

/**
 * Retrieve Application for the purpose of conducting a phone Interview
 * @param req
 * @param res
 * @returns {*}
 */
exports.conductPhoneInterview = function (req, res) {
  if (isPhoneInterviewer(req)) {
    return res.jsonp(req.application);
  } else {
    return res.send(400, {
      message: 'You are not an assigned Phone Interviewer for this Application'
    });
  }
};

/**
 * Create an Application
 * @param req
 * @param res
 */
exports.create = function(req, res) {
	var application = new Application(req.body);
  //@todo query to get worksheetFields
  WorksheetField
    .find({appliesTo: 'reviewWorksheet'})
    .sort('order')
    .exec(function(err, result) {
      if (err) {
        res.send(500, err);
      } else {
        createBodyFields(result);
      }
    });

  //@todo create bodyFields
  function createBodyFields(worksheetFields) {
    var bodyFields = [];
    if(worksheetFields && worksheetFields.length) {
      _.forEach(worksheetFields, function (worksheetField) {
        bodyFields.push(new BodyField(worksheetField));
      });
    }
    if (bodyFields.length) {
      appendBodyFieldsToApplication(bodyFields);
    } else {
      res.send(400, {message: 'Problem adding body fields to application'});
    }
  }

  //@todo append bodyFields to application
  function appendBodyFieldsToApplication(bodyFields) {
    application.reviewPhase.reviews.push( new Review());
    application.reviewPhase.reviews.push( new Review());

    _.forEach(application.reviewPhase.reviews, function (review) {
      review.reviewWorksheet.body.fields = bodyFields;
    });

    createApplication();
  }

  function createApplication() {
    application.user = req.user;

    application.save(function(err) {
      if (err) {
        return res.send(400, {
          // this doesn't work, dumping errorHandler into its own controller
          message: getErrorMessage(err)
        });
      } else {
        res.jsonp(application);
      }
    });
  }
};

/**
 * User create Application
 * @param req
 * @param res
 * @returns {*}
 */
exports.createForUser = function(req, res) {
  var application = new Application(req.body);

  if(!application.user) {
    return res.send(400, {
      message: 'no user given'
    });
  }

  findApplicantByUserId(application.user);

  /**
   * find an existing Applicant for the given User._id, if one is found call saveApplication(), passing the Applicant,
   * if not found, call createApplicant()
   * @param userId
   */
  function findApplicantByUserId(userId) {
    Applicant.findOne({user: userId})
      .exec(function (err, foundApplicant) {
        if (err) {
          return err;
        }

        if(foundApplicant && foundApplicant._id) {
          saveApplication(foundApplicant);
        } else {
          createApplicant();
        }
      });
  }

  /**
   * create a new Applicant based on data in the Application, call save Application passing the Applicant
   */
  function createApplicant() {
    var name = {
      firstName: application.firstName,
      honorific: application.honorific,
      middleName: application.middleName,
      lastName: application.lastName
    };
    var applicant = new Applicant({
      user: application.user,
      name: name
    });

    applicant.save(function(err) {
      if (err) {
        return res.send(400, {
          message: getErrorMessage(err)
        });
      } else {
        saveApplication(applicant);
      }
    });
  }

  /**
   * save the Application and return the response
   * @param applicant
   */
  function saveApplication(applicant) {
    application.applicant = applicant._id;
    doSave(null, application);

    function doSave(err, resultApplication) {

      if (err) {
        res.send(500, err);
      } else {
        resultApplication.save(function(err, result) {
          if (err) {
            return res.send(400, {
              message: getErrorMessage(err)
            });
          }
          if (result) {
            return res.jsonp(result);
          }
        });
      }
    }
  }
};

/**
 * Delete an Application
 * @param req
 * @param res
 */
exports.delete = function (req, res) {
  var application = req.application;

  application.remove(function (err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(application);
    }
  });
};

/**
 * Deletes an application.[phase][subjectArray][worksheet].comments[] object
 * @description
 * Multipurpose method used to delete comments from reviewWorksheet(s) and phoneInterviewWorksheet(s)
 * @param req
 * @param res
 */
exports.deleteComment = function(req, res) {
  var comment = req.body.comment
    , matchingComment
    , commentAttachedTo;

  if(req.body && req.body.phoneInterview) {
    commentAttachedTo = 'phoneInterview';
  } else if(req.body && req.body.review) {
    commentAttachedTo = 'review';
  } else {
    res.send(403, {
      message: 'The request to update a comment did not contain a review or phone interview'
    });
  }

  var phase = commentAttachedTo + 'Phase';
  var subjectArray = commentAttachedTo + 's';
  var worksheet = commentAttachedTo + 'Worksheet';
  /**
   * @var {Object} subject  The object to which the comment is attached
   */
  var subject = req.body[commentAttachedTo];
  var existingSubject = req.application[phase][subjectArray].id(subject._id);

  var deleted = false;

  if (existingSubject) {
    matchingComment = existingSubject[worksheet].comments.id(comment._id);
    if (matchingComment) {
      if (matchingComment.commenter && matchingComment.commenter._id.toString() === req.user._id) {
        var comments = existingSubject[worksheet].comments;
        comments.splice(comments.indexOf(matchingComment));
        deleted = true;
      } else {
        res.send(400, {
          message: 'The comment does not belong to the authenticated user. Could not perform delete.'
        });
      }
    } else {
      res.send(400, {
        message: 'No matching comment was found. Could not perform delete.'
      });
    }
  }

  if(deleted) {
    req.application.save(function(err, application){
      if(err) {
        res.send(400, {
          message: 'An error occurred while deleting the comment.'
        });
      } else {
        res.jsonp(application);
      }
    });
  } else {
    res.send(400, {
      message: 'Nothing was deleted'
    });
  }

};

/**
 * Find and return an existing Application for the authenticated User and given Opening if one exists. Otherwise return
 * empty
 * @param req
 * @param res
 */
exports.forOpeningForUser = function (req, res) {
  Application.findOne({user: req.user._id, opening: req.opening._id})
    .exec(function(err, application){
      if(err) {
        return res.send(400, {
          message: 'Error looking for existing Applications for User and Opening'
        });
      } else {
        if (application && (application.cv || application.coverLetter)) {
          getFiles(application)
            .then(function(result) {
              sendResponse(null, result, res);
            })
            .catch(function(err) {
              sendResponse(err, null, res);
            });
        } else {
          sendResponse(null, application, res);
        }
      }
    });

  //function getFiles (application) {
  //  async.parallel([
  //    function(callback) {
  //      getFileMetadata(application.cv, callback);
  //    },
  //    function(callback) {
  //      getFileMetadata(application.coverLetter, callback);
  //    }
  //  ], function (err, results) {
  //    if (err) {
  //      console.log(err);
  //    } else {
  //      if(results[0]) {
  //        application._doc.cvFileMeta = results[0];
  //      }
  //      if(results[1]){
  //        application._doc.coverLetterFileMeta = results[1];
  //      }
  //      res.jsonp(application);
  //    }
  //  });
  //}
  //
  ///**
  // * Returns metadata for the given file
  // * @param fileId
  // * @param callback
  // * @param application
  // * @param fileType
  // */
  //function getFileMetadata (fileId, callback, application, fileType) {
  //
  //    gfs.findOne({_id: fileId}, function (err, file) {
  //      if (err) {
  //        //@todo handle error
  //        console.log(err);
  //      } else {
  //        //if there is no fileId given, gfs.findOne will have returned null, if not we are going to
  //        //lookup the metadata on the file and add it as file.metadata
  //        if (file !== null) {
  //          file.mimeType = mime.lookup(file.filename);
  //        }
  //        //call back to the async#parallel in fn getFiles
  //        callback(null, file);
  //      }
  //    });
  //}
};

/**
 * Application Authorization Middleware
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.hasAuthorization = function (req, res, next) {
  if ((_.intersection(req.user.roles, ['admin', 'manager']).length)
  || (req.application.user.toString() === req.user._id)) {
    next();
  } else {
    return res.send(403, {
      message: 'User is not authorized'
    });
  }
};

/**
 * Manage an existing application
 * assumes that the :applicationId param was in the route, thereby invoking #applicationId and setting req.application
 * @param req
 * @param res
 */
exports.manage = function (req, res) {

  var application = req.application
    , updatedApplication = req.body
    , shouldSetupReviewWorksheet = !!(updatedApplication.proceedToReview && !application.proceedToReview)
    , shouldSetupPhoneInterviewWorksheet = !!(updatedApplication.reviewPhase.proceedToPhoneInterview && !application.reviewPhase.proceedToPhoneInterview);

  application = _.extend(application, updatedApplication);

  if (shouldSetupReviewWorksheet) {
    addWorksheetFields(application, 'reviewWorksheet')
      .then(function(result) {
        application = result;
        addPhoneInterviewWorksheetFields();
      })
      .catch(function (err) {
        sendResponse(err);
      });
  } else {
    addPhoneInterviewWorksheetFields();
  }

  function addPhoneInterviewWorksheetFields () {
    if(shouldSetupPhoneInterviewWorksheet) {
      addWorksheetFields(application, 'phoneInterviewWorksheet')
        .then(function(result) {
          application = result;
          doSave();
        })
        .catch(function(err) {
          sendResponse(err);
        });
    } else {
      doSave();
    }
  }

  function doSave () {
    application.save(function (err) {
      if (err) {
        sendResponse(err);
      } else {
        if(application.cv || application.coverLetter) {
          getFiles(application)
            .then(function(result) {
              application = result;
              sendResponse(null, application);
            })
            .catch(function(err) {
              sendResponse(err);
            });
        } else {
          //req.application = application;
          sendResponse(null, application);
        }
      }
    });
  }

  function sendResponse(err, data) {
    if(err) {
      res.send(400, getErrorMessage(err));
    } else {
      res.jsonp(data);
    }
  }
};

/**
 * Get Applications where Authenticated User is the Reviewer
 * @param req
 * @param res
 */
exports.iAmReviewer = function (req, res) {
  Application.find()
    .where('proceedToReview').equals(true) //Review Phase activated
    .where('reviewPhase.proceedToPhoneInterview').equals(null) //Next Phase not determined
    .elemMatch('reviewPhase.reviews', {
      reviewer: req.user._id,
      'reviewWorksheet.complete': false
    })
    //.where('reviewPhase.reviews.reviewer').equals(req.user._id)
    //.or([{'reviewPhase.proceedToPhoneInterview': false}, {'reviewPhase.proceedToPhoneInterview': null}])
    .sort('-dateSubmitted')
    .populate('opening')
    .exec(function(err, applications) {
      if(err) {
        return res.send(400, {
          message: getErrorMessage(err)
        });
      } else {
        res.jsonp(applications);
      }
    });
};

/**
 * Get Applications where Authenticated User is the Phone Interviewer, and the Phone Interview needs to be completed
 * @param req
 * @param res
 */
exports.iAmPhoneInterviewer = function (req, res) {
  Application.find()
    .where('reviewPhase.proceedToPhoneInterview').equals(true) //Phone Interview Phase enabled
    .where('phoneInterviewPhase.proceedToOnSite').equals(null) //Next Phase not determined
    .elemMatch('phoneInterviewPhase.phoneInterviews', {
      interviewer: req.user._id,
      'phoneInterviewWorksheet.complete': false
    })//user is an Assigned Phone Interviewer, and the interview is not completed
    .sort('-dateSubmitted')
    .populate('opening')
    .exec(function(err, applications) {
      if(err) {
        return res.send(400, {
          message: getErrorMessage(err)
        });
      } else {
        res.jsonp(applications);
      }
    });
};

/**
 * Return JSON of Applications
 * @param req
 * @param res
 */
exports.list = function (req, res) {
  Application.find()
    .sort('-postDate')
    .populate('applicant')
    .populate('opening')
    .populate('reviewPhase.reviews.reviewer')
    .exec(function (err, applications) {
      if (err) {
        return res.send(400, {
          message: getErrorMessage(err)
        });
      } else {
        res.jsonp(summarizeApplications(applications));
      }
    });

  /**
   * Computes status and adds to individual applications
   * @param applications
   */
  function summarizeApplications(applications) {
    _.forEach(applications, function(application) {
      var status = 'Archived';
      if(application.proceedToReview) {
        status = 'Review Phase Open';
      }
      if(application.proceedToReview === null) {
        status = 'Needs Processing';
      }
      if(application.proceedToReivew === false) {
        status = 'Denied prior to Committee Review';
      }
      if(application.reviewPhase) {
        if(application.reviewPhase.proceedToPhoneInterview){
          status = 'Phone Interview Open';
        } else if(application.reviewPhase.proceedToPhoneInterview === false) {
          status = 'Denied after Review Phase';
        }
      }
      if(application.phoneInterviewPhase ) {

        if(application.phoneInterviewPhase.proceedToOnSite) {
          status = 'On Site Phase Open';
        } else if(application.phoneInterviewPhase.proceedToOnSite === false) {
          status = 'Denied after Phone Interview Phase';
        }
      }
      if(application.onSiteVisitPhase.complete) {
        status = 'Process Complete';
      }
      var applicantDisplayName = application.firstName + ' ' + application.lastName;
      application._doc.isNew = (application.isNewApplication) ? true : false;
      application._doc.applicantDisplayName = applicantDisplayName;
      application._doc.status = status;
      application._doc.summary = applicantDisplayName + ' for ' + application.opening.name;
    });
    return applications;
  }
};

/**
 * Return JSON of current Application
 * @param req
 * @param res
 */
exports.read = function (req, res) {
  res.jsonp(req.application);
};

/**
 * middleware removes cover letter from req.application Object
 * @param req
 * @param res
 * @param next
 */
exports.removeFile = function (req, res, next) {
  var fileId = req.params.fileId;
  var matched = false;
  if(req.application.coverLetter && req.application.coverLetter.toString() === fileId) {
    matched = true;
    req.application.coverLetter = null;
  } else if(req.application.cv && req.application.cv.toString() === fileId) {
    matched = true;
    req.application.cv = null;
  }

  if (matched) {
    next();
  } else {
    res.send(400, {message: 'The given file is not part of this application'});
  }
};

/**
 * Saves a new comment
 * @description
 * on application.[phase][subjectArray][worksheet], or updates an existing comment
 * Used to add comments to reviews and phoneInterviews
 * @todo Ensure comment can only be updated by the commenter
 * @param req
 * @param res
 */
exports.saveComment = function(req, res) {
  var comment = req.body.comment;
  var mode = 'update';

  var commentAttachedTo;

  if(req.body && req.body.phoneInterview) {
    commentAttachedTo = 'phoneInterview';
  } else if(req.body && req.body.review) {
    commentAttachedTo = 'review';
  } else {
    res.send(403, {
      message: 'The request to update a comment did not contain a review or phone interview'
    });
  }

  var phase = commentAttachedTo + 'Phase';
  var subjectArray = commentAttachedTo + 's';
  var worksheet = commentAttachedTo + 'Worksheet';
  /**
   * @var {Object} subject  The object to which the comment is attached
   */
  var subject = req.body[commentAttachedTo];
  var existingSubject = req.application[phase][subjectArray].id(subject._id);

  comment.commenter = req.user._id;

  if(!comment._id) {
    mode = 'add';
  }

  if(mode === 'add'){
    var commentAdded = false;

    if(existingSubject) {
      comment = new Comment(comment);
      existingSubject[worksheet].comments.push(comment);
      comment = existingSubject[worksheet].comments[existingSubject[worksheet].comments.length - 1];
      commentAdded = true;
    }

    if(commentAdded) {
      saveApplication();
    } else {
      sendResponse(400, {
        message: 'Problem Adding the Comment on the Server'
      });
    }

  } else {

    var commentUpdated = false;
    var existingComment = existingSubject[worksheet].comments.id(comment._id);

    if(existingComment) {
      if(comment.dateUpdated) {
        delete comment.dateUpdated;
      }
      comment = new Comment(comment);
      _.extend(existingComment, comment);
      commentUpdated = true;
    }

    if (commentUpdated) {
      saveApplication();
    } else {
      sendResponse({
        message: 'Problem Updating the Comment on the Server'
      });
    }
  }

  function saveApplication () {
    req.application.save(function(err, application) {
      if(err) {
        sendResponse({
          message: 'Problem Saving the Comment on the Server'
        });
      } else {
        sendResponse(null, application);
      }
    });
  }

  function sendResponse(err) {
    if (err) {
      res.send(400, err);
    } else {

      comment.commenter = {
        _id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        displayName: req.user.displayName
      };
      res.jsonp(comment);
    }
  }
};

exports.savePhoneInterview = function(req, res) {
  var phoneInterview = req.body.phoneInterview;

  if(isPhoneInterviewer(req)) {
    updatePhoneInterviewContent(returnPhoneInterview);
  } else {
    return res.send(400, {
      message: 'You are not an assigned Phone Interviewer for this Application'
    });
  }

  function updatePhoneInterviewContent (next) {
    var updated = false;

    var existingPhoneInterview = req.application.phoneInterviewPhase.phoneInterviews.id(phoneInterview._id);

    if (existingPhoneInterview && req.user._id === existingPhoneInterview.interviewer._id.toString()) {
      existingPhoneInterview.phoneInterviewWorksheet.body = phoneInterview.phoneInterviewWorksheet.body;
      if(phoneInterview.phoneInterviewWorksheet.complete) {
        existingPhoneInterview.phoneInterviewWorksheet.dateCompleted = Date.now();
      } else {
        existingPhoneInterview.phoneInterviewWorksheet.dateCompleted = null;
      }
      existingPhoneInterview.phoneInterviewWorksheet.complete = phoneInterview.phoneInterviewWorksheet.complete;
      updated = existingPhoneInterview;
    }

    if (updated) {
      req.application.save(function(err, application) {
        if(err) {
          res.send(400, err);
        }
        next(application);
      });
    } else {
      res.send(400, {
        message: 'The phone interview was not updated'
      });
    }
  }

  function returnPhoneInterview (application) {
    var updatedPhoneInterview = application.phoneInterviewPhase.phoneInterviews.id(phoneInterview._id);
    res.jsonp(updatedPhoneInterview);
  }



};

/**
 * Saves a Review
 * authorization for the assigned reviewer only
 * @param req
 * @param res
 * @returns {*}
 */
exports.saveReview = function (req, res) {
  var review = req.body.review;

  function updateReviewContent (next) {
    var updated = false;

    var existingReview = req.application.reviewPhase.reviews.id(review._id);
    if (existingReview && req.user._id === existingReview.reviewer._id.toString()) {
      existingReview.reviewWorksheet.body = review.reviewWorksheet.body;
      if(review.reviewWorksheet.complete) {
        existingReview.reviewWorksheet.dateCompleted = Date.now();
      } else {
        existingReview.reviewWorksheet.dateCompleted = null;
      }
      existingReview.reviewWorksheet.complete = review.reviewWorksheet.complete;
      updated = existingReview;
    }

    if (updated) {
      req.application.save(function(err, application) {
        if(err) {
          res.send(400, err);
        }
        next(application);
      });
    } else {
      res.send(400, {
        message: 'The review was not updated'
      });
    }
  }

  function returnReview (application) {
    var updatedReview = application.reviewPhase.reviews.id(review._id);
    res.jsonp(updatedReview);
  }

  if (isReviewer(req)) {
    updateReviewContent(returnReview);
  } else {
    return res.send(400, {
      message: 'You are not an assigned Reviewer for this Application'
    });
  }
};

/**
 * Update an Application
 * @param req
 * @param res
 */
exports.update = function (req, res) {
  var application = req.application;

  application = _.extend(application, req.body);

  if(application.submitted && !application.dateSubmitted) {
    application.dateSubmitted = Date.now();
  }

  application.save(function (err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {


/**
 * Return true if EOE already provided for Application
 * empty
 * @param req
 * @param res
 */
exports.eoeProvided = function (req, res) {
    Application.findOne({_id: req.application._id})
        .exec(function (err, application) {
            console.log('executing eoeProvided for ', application._id);
            console.log('eoeProvided is', application.eoeProvided);
            if (err) {
                return res.send(400, {
                    message: 'Error looking for existing Application'
                });
            }
            else {
                res.jsonp(application);
            }
        });
};

/**
 * Find and return an existing Application for the authenticated User and given Opening if one exists. Otherwise return
 * empty
 * @param req
 * @param res
 */
exports.findForUserForOpening = function (req, res) {
  Application.findOne({user: req.user._id, opening: req.opening._id})
    .exec(function(err, application){
      if(err) {
        return res.send(400, {
          message: 'Error looking for existing Applications for User and Opening'
        });
      if(application.cv || application.coverLetter) {
        getFiles(application)
          .then(function(result) {
            req.application = result;
            res.jsonp(application);
          });
      } else {
        req.application = application;
        res.jsonp(application);
      }

    }
  });

};

/**
 * Add fields to a worksheet.
 * @param {mongoose.model} application
 * @param {String} worksheetType
 * @returns {deferred.promise|{then}}
 */
function addWorksheetFields(application, worksheetType) {
  var deferred = Q.defer();
  // sanitize the worksheetType input
  worksheetType = (worksheetType === 'reviewWorksheet') ? worksheetType : 'phoneInterviewWorksheet';

  WorksheetField
    .find({appliesTo: worksheetType})
    .sort('order')
    .exec(function(err, result) {
      if (err) {
        //callback(err, null);
        deferred.reject(err);
      } else {
        createBodyFields(result);
      }
    });

  function createBodyFields(worksheetFields) {
    var bodyFields = [];
    if(worksheetFields && worksheetFields.length) {
      _.forEach(worksheetFields, function (worksheetField) {
        bodyFields.push(new BodyField(worksheetField));
      });
    }
    if (bodyFields.length) {
      appendBodyFieldsToApplication(bodyFields);
    } else {
      // if there are no fields defined for the worksheet type, then we just resolve the promise with the original
      // and unaltered application
      deferred.resolve(application);
    }
  }

  function appendBodyFieldsToApplication(bodyFields) {
    var phaseName = (worksheetType === 'reviewWorksheet') ? 'reviewPhase' : 'phoneInterviewPhase';
    var reviewArray = (worksheetType === 'reviewWorksheet') ? 'reviews' : 'phoneInterviews';
    if (application[phaseName]) {


/**
 * Update an Application
 * @param req
 * @param res
 */
exports.update = function (req, res) {
  var application = req.application;

      if(!application[phaseName][reviewArray]) {
        application[phaseName][reviewArray] = [];
      }

      var existingReviewCount = application[phaseName][reviewArray].length;
      var additionalReviewsNeeded = 2 - existingReviewCount;

      for(var i = 0; i < additionalReviewsNeeded; i++ ) {
        application[phaseName][reviewArray].push( new Review());
      }

      _.forEach(application[phaseName][reviewArray], function (review) {
        review[worksheetType].body = {};
        review[worksheetType].body.fields = bodyFields;
      });

      deferred.resolve(application);
      var foo = 'bar';

    } else {
      deferred.reject('error: phase specified does not exist');
    }
  }
  return deferred.promise;
}

/**
 * Get the error message from the Error Object
 * @param err
 * @returns {string}
 */
function getErrorMessage(err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'Application already exists';
        break;
      default:
        message = 'Something went wrong';
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message) {
        message = err.errors[errName].message;
      }
    }
  }

  return message;
}

/**
 * Returns metadata for the given file
 * @param fileId
 * @param callback
 */
function getFileMetadata (fileId, callback) {

    gfs.findOne({_id: fileId}, function (err, file) {
      if (err) {
        //@todo handle error
        console.log(err);
      } else {
        //if there is no fileId given, gfs.findOne will have returned null, if not we are going to
        //lookup the metadata on the file and add it as file.metadata
        if (file !== null) {
          file.mimeType = mime.lookup(file.filename);
        }
        //call back to the async#parallel in fn getFiles
        callback(null, file);
      }
    });
}

/**
 *
 * @param application
 * @returns {deferred.promise|{then}}
 */
function getFiles (application) {
  var deferred = Q.defer();
  async.parallel([
    function(callback) {
      getFileMetadata(application.cv, callback);
    },
    function(callback) {
      getFileMetadata(application.coverLetter, callback);
    }
  ], function (err, results) {
    if (err) {
      console.log(err);
      deferred.reject(err);
    } else {
      if(results[0]) {
        application._doc.cvFileMeta = results[0];
      }
      if(results[1]){
        application._doc.coverLetterFileMeta = results[1];
      }
      //resolve with the application data
      deferred.resolve(application);
    }
  });
  return deferred.promise;
}

/**
 * Check that the authenticated User is an Assigned Phone Interviewer
 * @param req
 * @returns {boolean}
 */
function isPhoneInterviewer(req) {
  var interviewerFound = false;
  _.forEach(req.application.phoneInterviewPhase.phoneInterviews, function(phoneInterview) {
    if((req.user._id === phoneInterview.interviewer._id.toString()) && !interviewerFound) {
      interviewerFound = true;
    }
  });
  return interviewerFound;
}

/**
 * Check that the authenticated User is an Assigned Reviewer
 * @param req
 * @returns {boolean}
 */
function isReviewer(req) {
  var reviewerFound = false;
  _.forEach(req.application.reviewPhase.reviews, function(review) {
    if((req.user._id === review.reviewer._id.toString()) && !reviewerFound) {
      reviewerFound = true;
    }
  });
  return reviewerFound;
}

/**
 * Send server response or error. used by various exported methods where promises are employed
 * @param err
 * @param data
 */
function sendResponse(err, data, res) {
  if(err) {
    res.send(400, getErrorMessage(err));
  } else {
    res.jsonp(data);
  }
}

function Comment(comment) {
  if (!comment) {
    comment = {};
  }
  this.comment = comment.comment || '';
  this.commenter = comment.commenter || undefined;
  this.dateCreated = comment.dateCreated || Date.now();
  this.dateUpdated = Date.now();
}

function BodyField(field) {
  if (!_.isObject(field)) {
    field = {};
  }
  this.name = _.isString(field.name) ? field.name : null;
  this.label = _.isString(field.label) ? field.label : null;
  this.description = _.isString(field.description) ? field.description : null;
  this.fieldType = _.isString(field.fieldType) ? field.fieldType : null;
  this.selectOptions = (field.selectOptions) ? field.selectOptions : [];
  this.order = _.isNumber(field.order) ? field.order : 0;
  this.response = null;
}

function Review() {
  this.reviewer = null;
  this.reviewWorksheet = {};
  this.reviewWorksheet.complete = false;
  this.body = {};
  this.body.fields = [];
  this.dateAssigned = null;
  this.dateUpdated = null;
  this.dateCompleted = null;
  this.comments = [];
}
