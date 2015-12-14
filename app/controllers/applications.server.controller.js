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
var Opening = mongoose.model('Opening');
var User = mongoose.model('User');
var async = require('async');
var mime = require('mime-types');
var Q = require('q');
var config = require('../../config/env/all');
var developerSettings = require('../../config/env/developer-settings');
var nodemailer = require('nodemailer');


mongoose.set('debug', true);


/**
 * Return JSON of Closed Applications
 * @param {Object} req
 * @param {ServerResponse} res
 */
exports.allClosed = function (req, res) {
  var query = Application.find();
  query = addActiveConditionsToQuery(query, false);
  executeListingQuery(query, res);
};

/**
 * Return JSON of Applications Not Submitted
 * @param {Object} req
 * @param {ServerResponse} res
 */
exports.allNotSubmitted = function (req, res) {
  var query = Application.find();
  query.where('submitted').equals(false);
  executeListingQuery(query, res);
};

/**
 * Return JSON of Open Applications
 * @param {Object} req
 * @param {ServerResponse} res
 */
exports.allOpen = function (req, res) {
  var query = Application.find();
  query = addActiveConditionsToQuery(query, true);

  executeListingQuery(query, res);
};

exports.allReviewPhase = function (req, res) {
  var query = Application.find();
  query = addActiveConditionsToQuery(query, true);
  query
    .where('proceedToReview').equals(true)
    .where('reviewPhase.proceedToPhoneInterview').equals(null);

  executeListingQuery(query, res);
};

exports.allPhoneInterviewPhase = function (req, res) {
  var query = Application.find();
  query = addActiveConditionsToQuery(query, true);
  query
    .where('proceedToReview').equals(true)
    .where('reviewPhase.proceedToPhoneInterview').equals(true)
    .where('phoneInterviewPhase.proceedToOnSite').equals(null);

  executeListingQuery(query, res);
};

exports.allOnSiteVisitPhase = function (req, res) {
  var query = Application.find();
  query = addActiveConditionsToQuery(query, true);
  query
    .where('proceedToReview').equals(true)
    .where('reviewPhase.proceedToPhoneInterview').equals(true)
    .where('phoneInterviewPhase.proceedToOnSite').equals(true)
    .where('onSiteVisitPhase.complete').equals(false);

  executeListingQuery(query, res);
};

exports.allSuccessful = function (req, res) {
  var query = Application.find();
  query = addSuccessfulApplicationConditionsToQuery(query);

  executeListingQuery(query, res);
};


// countByDate not currently needed as date filtering will be done on client side but will use method
// with default start dates and end dates provided initially by client (1900 - 2029)
exports.countByDate = function (req, res) {
  var query = Application.find();
  var dateStart = (new Date(req.params.dateStart)).toISOString();
  var dateEnd = new Date(req.params.dateEnd).toISOString();
  var position = (req.params.position === 'all') ? 'all' : mongoose.Types.ObjectId(req.params.position);
  query
      .populate('opening')
      .where('dateSubmitted').gte(dateStart)
      .where('dateSubmitted').lt(dateEnd)
      .exec(function (err, docs) {
        if (position !== 'all') {
          docs = docs.filter(function(doc){
            return (doc.opening.position.toString() === position.toString())
          });
          var hired = docs.filter(function(doc){
            return (doc.offer.accepted === true)
          });
          console.log (hired);
        }
        var data = { 'count' : docs.length, 'hired' : hired };
        if (err) {
          sendResponse(err, null, res);
        } else {
          sendResponse(null, data, res);
        }
      });
}


/**
 * Appends boilerplate mongoose methods and executes a query for a 'listing' style result set
 * @param {Object} query
 * @param {ServerResponse} res
 */
function executeListingQuery(query, res) {
  query
    .sort('-postDate')
    .populate('applicant')
    .populate('opening')
    .populate('reviewPhase.reviews.reviewer')
    .exec(function (err, applications) {
      if (err) {
        sendResponse(err, null, res);
      } else {
        sendResponse(null, summarizeApplications(applications), res);
      }
    });
};



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
      if (application.cv || application.coverLetter) {
        getFiles(application)
          .then(function (result) {
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
  if (req.newFileId) {

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
 * @param {Object} req
 * @param {Object} res
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
 * @param {Object} req
 * @param {Object} res
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
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.create = function (req, res, next) {
  var application = new Application(req.body);
  var err;

  if (!application.user) {
    err = new Error('No user was provided');
    err.status = 400;
    return next(err);
  }

  if (!application.applicant) {
    err = new Error('Applicant was not provided');
    err.status = 400;
    return next(err);
  }

  if (!application.opening) {
    err = new Error('Opening was not provided');
    err.status = 400;
    return next(err);
  }

  application.save(function (err, result) {
    if (err) {
      err.status = 500;
      return next(err);
    }
    res.jsonp(result);
  });
};

/**
 * User create Application
 * @param {Object} req
 * @param {Object} res
 * @returns {*}
 */
exports.createByUser = function (req, res) {
  var application = new Application(req.body);

  if (!application.user) {
    return res.send(400, {
      message: 'no user given'
    });
  }

  findApplicantByUserId(application.user);

  /**
   * find an existing Applicant for the given User._id, if one is found call saveApplication(), passing the Applicant,
   * if not found, call createApplicant()
   * @param {String} userId
   */
  function findApplicantByUserId(userId) {
    Applicant.findOne({user: userId})
      .exec(function (err, foundApplicant) {
        if (err) {
          return err;
        }

        if (foundApplicant && foundApplicant._id) {
          saveApplication(foundApplicant);
        } else {
          createApplicant(req);
        }
      });
  }

  /**
   * create a new Applicant based on data in the Application, call save Application passing the Applicant
   */
  function createApplicant(req) {
    var name = {
      firstName: application.firstName,
      honorific: application.honorific,
      middleName: application.middleName,
      lastName: application.lastName
    };
    var applicant = new Applicant({
      user: application.user,
      name: name,
      emailAddresses: [
        {
          emailAddress: req.user.email,
          primary: true,
          note: 'Same as applicant userid'
        }
      ]
    });

    applicant.save(function (err) {
      if (err) {
        return res.send(400, {
          message: getErrorMessage(err)
        });
      } else {
        saveApplication(applicant);
      }
    });
  }

  //noinspection ProblematicWhitespace
  /**
   * save the Application and return the response
   * @param {Object} applicant
   */
  function saveApplication(applicant) {
    application.applicant = applicant._id;
    doSave(null, application);

    function doSave(err, resultApplication) {

      if (err) {
        res.send(500, err);
      } else {
        resultApplication.save(function (err, result) {
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
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.delete = function (req, res, next) {
  var application = req.application;

  deleteAndRemoveFiles(application)
    .then(function () {
      application.remove(function (err) {
        if (err) {
          err.status = 400;
          return next(err);
        } else {
          res.jsonp(application);
        }
      });
    });
};

/**
 * Deletes an application.[phase][subjectArray][worksheet].comments[] object
 * @description
 * Multipurpose method used to delete comments from reviewWorksheet(s) and phoneInterviewWorksheet(s)
 * @param {Object} req
 * @param {Object} res
 */
exports.deleteComment = function (req, res) {
  var comment = req.body.comment
    , matchingComment
    , commentAttachedTo;

  if (req.body && req.body.phoneInterview) {
    commentAttachedTo = 'phoneInterview';
  } else if (req.body && req.body.review) {
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
        comments.splice(comments.indexOf(matchingComment), 1);
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

  if (deleted) {
    req.application.save(function (err, application) {
      if (err) {
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
 * Find and send JSON array of applications for an Opening
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.forOpening = function (req, res, next) {
  var isActive = (req.params.isActive === 'true');
  var query = Application.find({opening: req.params.opening});
  query = addActiveConditionsToQuery(query, isActive);

  query
    .exec(function (err, applications) {
      if (err) {
        return next(err);
      }
      res.jsonp(applications);
    });
};

/**
 * Find and send JSON array of applications for an Applicant
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.forApplicant = function (req, res, next) {
  var isActive = (req.params.isActive === 'true');
  var query = Application.find({applicant: req.params.applicant});
  query = addActiveConditionsToQuery(query, isActive);

  query
    .populate('opening')
    .exec(function (err, applications) {
      if (err) {
        return next(err);
      }
      res.jsonp(applications);
    });
};

exports.successfulForOpening = function (req, res, next) {
  var openingId = req.params.opening;
  Application
    .findOne()
    .where('opening').equals(openingId)
    .where('offer.accepted').equals(true)
    .where('offer.retracted').ne(true)
    .exec(function (err, application) {
      var applications = [];
      if (err) {
        err.status = 400;
        return next(err);
      }
      if (!_.isNull(application)) {
        applications.push(application);
      }
      res.jsonp(applications);
    });
};

/**
 * Find and return an existing Application for the authenticated User and given Opening if one exists. Otherwise return
 * empty
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.forOpeningForUser = function (req, res, next) {
  Application.findOne({user: req.user._id, opening: req.opening._id})
    .exec(function (err, application) {
      if (err) {
        return next(err);
      } else {
        if (application && (application.cv || application.coverLetter)) {
          getFiles(application)
            .then(function (result) {
              sendResponse(null, result, res);
            })
            .catch(function (err) {
              return next(err);
            });
        } else {
          sendResponse(null, application, res);
        }
      }
    });
};

/**
 * Application Authorization Middleware
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {*}
 */
exports.hasAuthorization = function (req, res, next) {
  if ((_.intersection(req.user.roles, ['admin', 'manager']).length) || (req.application.user.toString() === req.user._id)) {
    next();
  } else {
    var err = new Error('User is not authorized', 403);
    return next(err);
  }
};

/**
 * Manage an existing application
 * assumes that the :applicationId param was in the route, thereby invoking #applicationId and setting req.application
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.manage = function (req, res, next) {

  var application = req.application
    , updatedApplication = req.body
    , shouldSetupReviewWorksheet = (updatedApplication.proceedToReview)
    , shouldSetupPhoneInterviewWorksheet = (updatedApplication.reviewPhase.proceedToPhoneInterview)
    , error
    , openingFillStatus;

  application = _.extend(application, updatedApplication);
  req.body.offer = req.body.offer || {};
  openingFillStatus = (req.body.offer.extended && req.body.offer.accepted && !req.body.offer.retracted);

  setOpeningFilledState(openingFillStatus, req.application._id, req.application.opening)
    .then(function () {
      updateApplication();
    })
    .catch(function (err) {
      sendResponse(err);
    });

  /**
   * Updates the associated Opening with the information about whether the opening has been filled
   * @param {Boolean} setFilledTo
   * @param {Object} applicationId
   * @param {Object} openingId
   * @returns {deferred.promise|{then}}
   */
  function setOpeningFilledState (setFilledTo, applicationId, openingId) {
    var deferred = Q.defer();
    var proceed = false;
    Opening.findById(openingId)
      .exec(function (err, opening) {
        if (err) {
          deferred.reject(err);
        }
        if (setFilledTo && !opening.successfulApplication) {
          opening.filled = true;
          opening.successfulApplication = applicationId;
          proceed = true;
        } else if (!setFilledTo && !!opening.successfulApplication && (opening.successfulApplication.toString() === applicationId.toString())) {
          opening.filled = false;
          opening.successfulApplication = null;
          proceed = true;
        } else if (setFilledTo && opening.successfulApplication.toString() !== applicationId.toString()) {
          error = new Error('Another Offer for this same Opening has already been accepted. You need to Retract the other Offer.');
          error.status = 400;
          deferred.reject(error);
        }

        if (proceed) {
          opening.save(function (err, result) {
            if (err) {
              deferred.reject(error);
            }
            if (result) {
              deferred.resolve(true);
            } else {
              error = new Error('A problem Occured when saving the Opening');
              error.status = 400;
              deferred.reject(error);
            }
          });
        } else {
          deferred.resolve(true);
        }
      });
    return deferred.promise;
  }

  function updateApplication () {
    if (shouldSetupReviewWorksheet) {
      addWorksheetFields(application, 'reviewWorksheet')
        .then(function (result) {
          application = result;
          addPhoneInterviewWorksheetFields();
        })
        .catch(function (err) {
          sendResponse(err);
        });
    } else {
      addPhoneInterviewWorksheetFields();
    }
  }

  function addPhoneInterviewWorksheetFields() {
    if (shouldSetupPhoneInterviewWorksheet) {
      addWorksheetFields(application, 'phoneInterviewWorksheet')
        .then(function (result) {
          application = result;
          doSave();
        })
        .catch(function (err) {
          sendResponse(err);
        });
    } else {
      doSave();
    }
  }

  function doSave() {
    if (application.onSiteVisitPhase.complete && !application.onSiteVisitPhase.dateCompleted) {
      application.onSiteVisitPhase.dateCompleted = new Date();
    }
    if (application.offer.extended && !application.offer.dateOffered) {
      application.offer.dateOffered = new Date();
    }
    if (application.offer.accepted && !application.offer.dateAccepted) {
      application.offer.dateAccepted = new Date();
    }
    if (application.offer.retracted && !application.offer.dateRetracted) {
      application.offer.dateRetracted = new Date();
    }
    if (!application.offer.extended) {
      application.offer.dateOffered = null;
    }
    if (!application.offer.accepted) {
      application.offer.dateAccepted = null;
    }
    if (!application.offer.retracted) {
      application.offer.dateRetracted = null;
    }
    application.save(function (err) {
      if (err) {
        sendResponse(err);
      } else {
        if (application.cv || application.coverLetter) {
          getFiles(application)
            .then(function (result) {
              application = result;
              sendResponse(null, application);
            })
            .catch(function (err) {
              sendResponse(err);
            });
        } else {
          //req.application = application;
          sendResponse(null, application);
        }
      }
    });
  }

  function sendResponse(err) {
    if (err) {
      err.status = 400;
      next(err);
    } else {
      res.jsonp(addApplicationStatus(application, true));
    }
  }
};

/**
 * Get Applications where Authenticated User is the Reviewer
 * @param {Object} req
 * @param {Object} res
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
    .exec(function (err, applications) {
      if (err) {
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
 * @param {Object} req
 * @param {Object} res
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
    .exec(function (err, applications) {
      if (err) {
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
 * @param {Object} req
 * @param {Object} res
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
};

/**
 * Computes status and adds to array of applications
 * @uses this.addApplicationStatus();
 * @param {Array} applications
 */
function summarizeApplications(applications) {
  _.forEach(applications, function (application) {
    application = addApplicationStatus(application);
  });
  return applications;
}

/**
 * Computes status and adds to an individual applications
 * @param {Object|Array} applications
 * @param {Boolean=} addSummary whether to add summary data to application
 * @returns {*}
 */
function addApplicationStatus(applications, addSummary) {
  addSummary = (addSummary === false) ? false : true;
  if (_.isArray(applications)) {
    _.forEach(applications, function (application) {
      application = addStatus(application);
    });
  } else {
    applications = addStatus(applications);
  }

  function addStatus(application) {
    var status = 'Archived';
    if (application.proceedToReview) {
      status = 'Review Phase';
    }
    if (application.proceedToReview === null) {
      status = 'Needs Processing';
    }
    if (application.proceedToReview === false) {
      status = 'Denied prior to Committee Review';
    }
    if (application.reviewPhase) {
      if (application.reviewPhase.proceedToPhoneInterview) {
        status = 'Phone Interview Phase';
      } else if (application.reviewPhase.proceedToPhoneInterview === false) {
        status = 'Denied after Review Phase';
      }
    }
    if (application.phoneInterviewPhase) {

      if (application.phoneInterviewPhase.proceedToOnSite) {
        status = 'On-Campus Visit Phase';
      } else if (application.phoneInterviewPhase.proceedToOnSite === false) {
        status = 'Denied after Phone Interview Phase';
      }
    }
    if (application.onSiteVisitPhase.complete) {
      status = 'Pending Decision';
      if (application.offer.extended) {
        status = 'Offer Extended';
        if (application.offer.accepted) {
          status = 'Successful Application';
        }
        if (application.offer.accepted === false) {
          status = 'Offer Declined';
        }
        if (application.offer.retracted) {
          status = 'Offer Retracted';
        }
      }
    }

    application._doc.status = status;
    application = (addSummary) ? addSummaryToApplication(application) : application;
    return application;
  }

  return applications;
}

function addSummaryToApplication(application) {
  var applicantDisplayName = application.firstName + ' ' + application.lastName;
  application._doc.applicantDisplayName = applicantDisplayName;
  application._doc.summary = applicantDisplayName + ' for ' + application.opening.name;
  return application;
}

/**
 * Return JSON of current Application
 * @param {Object} req
 * @param {Object} res
 */
exports.read = function (req, res) {
  res.jsonp(addApplicationStatus(req.application, true));
};

/**
 * middleware removes cover letter from req.application Object
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.removeFile = function (req, res, next) {
  var fileId = req.params.fileId;
  var matched = false;
  if (req.application.coverLetter && req.application.coverLetter.toString() === fileId) {
    matched = true;
    req.application.coverLetter = null;
  } else if (req.application.cv && req.application.cv.toString() === fileId) {
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
 * @param {Object} req
 * @param {Object} res
 */
exports.saveComment = function (req, res) {
  var comment = req.body.comment;
  var mode = 'update';

  var commentAttachedTo;

  if (req.body && req.body.phoneInterview) {
    commentAttachedTo = 'phoneInterview';
  } else if (req.body && req.body.review) {
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

  if (!comment._id) {
    mode = 'add';
  }

  if (mode === 'add') {
    var commentAdded = false;

    if (existingSubject) {
      comment = new Comment(comment);
      existingSubject[worksheet].comments.push(comment);
      comment = existingSubject[worksheet].comments[existingSubject[worksheet].comments.length - 1];
      commentAdded = true;
    }

    if (commentAdded) {
      saveApplication();
    } else {
      sendResponse(400, {
        message: 'Problem Adding the Comment on the Server'
      });
    }

  } else {

    var commentUpdated = false;
    var existingComment = existingSubject[worksheet].comments.id(comment._id);

    if (existingComment) {
      if (comment.dateUpdated) {
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

  function saveApplication() {
    req.application.save(function (err, application) {
      if (err) {
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

exports.savePhoneInterview = function (req, res) {
  var phoneInterview = req.body.phoneInterview;

  if (isPhoneInterviewer(req)) {
    updatePhoneInterviewContent(returnPhoneInterview);
  } else {
    return res.send(400, {
      message: 'You are not an assigned Phone Interviewer for this Application'
    });
  }

  function updatePhoneInterviewContent(next) {
    var updated = false;

    var existingPhoneInterview = req.application.phoneInterviewPhase.phoneInterviews.id(phoneInterview._id);

    if (existingPhoneInterview && req.user._id === existingPhoneInterview.interviewer._id.toString()) {
      existingPhoneInterview.phoneInterviewWorksheet.body = phoneInterview.phoneInterviewWorksheet.body;
      if (phoneInterview.phoneInterviewWorksheet.complete) {
        existingPhoneInterview.phoneInterviewWorksheet.dateCompleted = Date.now();
      } else {
        existingPhoneInterview.phoneInterviewWorksheet.dateCompleted = null;
      }
      existingPhoneInterview.phoneInterviewWorksheet.complete = phoneInterview.phoneInterviewWorksheet.complete;
      updated = existingPhoneInterview;
    }

    if (updated) {
      req.application.save(function (err, application) {
        if (err) {
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

  function returnPhoneInterview(application) {
    var updatedPhoneInterview = application.phoneInterviewPhase.phoneInterviews.id(phoneInterview._id);
    res.jsonp(updatedPhoneInterview);
  }

};

/**
 * Saves a Review
 * authorization for the assigned reviewer only
 * @param {Object} req
 * @param {Object} res
 * @returns {*}
 */
exports.saveReview = function (req, res) {
  var review = req.body.review;

  function updateReviewContent(next) {
    var updated = false;

    var existingReview = req.application.reviewPhase.reviews.id(review._id);
    if (existingReview && req.user._id === existingReview.reviewer._id.toString()) {
      existingReview.reviewWorksheet.body = review.reviewWorksheet.body;
      if (review.reviewWorksheet.complete) {
        existingReview.reviewWorksheet.dateCompleted = Date.now();
      } else {
        existingReview.reviewWorksheet.dateCompleted = null;
      }
      existingReview.reviewWorksheet.complete = review.reviewWorksheet.complete;
      updated = existingReview;
    }

    if (updated) {
      req.application.save(function (err, application) {
        if (err) {
          res.send(400, err);
        }
        //TODO move to model
        if (reviewsCompleted(application)) {
          var options = {
            url : req.headers.host + '/#!/applications/' + application._id
          };
          emailSCMApplicationReviews(application, options);
          next(application);
        }
      });
    } else {
      res.send(400, {
        message: 'The review was not updated'
      });
    }
  }

  function returnReview(application) {
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

  function reviewsCompleted(application) {
    return true;
  }
};

/**
 * Update an Application
 * @param {Object} req
 * @param {Object} res
 */
exports.update = function (req, res) {
  var application = req.application;

  application = _.extend(application, req.body);

  if (application.submitted && !application.dateSubmitted) {
    application.dateSubmitted = Date.now();
    var applicant = Applicant.findById(application.applicant)
        .exec(function (err, applicant) {
          if (err) {
          }
          else {
            var opening = Opening.findById(application.opening)
                .exec(function (err, opening) {
                  if (err) {
                  }
                  else {
                    var opening = opening.name;
                    var options = {
                      url : req.headers.host + '/#!/applications/' + application._id
                    };
                    console.log(options.server);
                    emailApplicant(applicant, opening);
                    var managerEmails = [];
                    //getManagerEmail(managerEmails).then(function (managerEmails) {
                    //  options.emailTo = managerEmails;
                    //  emailManagerNewApplication(applicant, opening, options);
                    //});
                    getEmailAddressesByRole(managerEmails, 'manager').then(function(managerEmails) {
                      options.emailTo = managerEmails;
                      emailManagerNewApplication(applicant, opening, options);
                    });
                    // [wip] just testing out below, will put in proper place
                    //var scmEmails = [];
                    //getEmailAddressesByRole(scmEmails, 'committee member').then(function(scmEmails) {
                    //  options.emailTo = scmEmails;
                    //  emailSCMApprovedApplication(applicant, opening, options);
                    //});
                  }
                });
          }
        });
  }

  //function getManagerEmail(emailAddresses) {
  //  var deferred = Q.defer();
  //  User.find({roles: 'manager'})
  //      .sort('lastName')
  //      .select('email')
  //      .exec(function(err, res) {
  //        if (err) {
  //          //TODO what would you do except log it?
  //          deferred.reject(err);
  //        } else {
  //          emailAddresses = _(res).pluck('email').join(", ");
  //          deferred.resolve(emailAddresses);
  //        }
  //      });
  //  return deferred.promise;
  //}


  //TODO refactor to get most of this outside of controller
  function emailApplicant(applicant, opening) {
    var email = (_.find(applicant.emailAddresses, function(emailAddress) {
      return emailAddress.primary = true;
    })).emailAddress;
    var emailTo = (process.env.NODE_ENV === 'production') ? email : developerSettings.developerEmail;

    var smtpTransport = nodemailer.createTransport(config.sendGridSettings);

    var mailOptions = {
      to: emailTo,
      from: 'noreply@frs.nursing.duke.edu',
      subject: 'DUSON Faculty Application Received'
    };

    mailOptions.html =  '<!DOCTYPE html> <p>Dear ' + (applicant.name.honorific ? applicant.name.honorific + ' ' : '') + applicant.name.lastName + ',</p>' +
          '<p>Thank you for your interest in the ' + opening + ' opening. Your application has been' +
            ' received. We will review each application to determine which of the applicants will be' +
            ' invited to participate in a phone interview with members of the faculty search' +
            ' committee.</p>' + '<p>We anticipate that we will be back in touch with you within the next' +
            ' 2 weeks to inform you of the results of this process. In the meantime, please' +
            ' contact me with questions you have about the school, the position, or the process.</p>' +
            '<p>Sincerely,<br/>' + 'Crystal Arthur' + '<br/>' + 'Director, Faculty' +
        ' Affairs' + '<br/>'
            + 'Duke University School of Nursing' + '<br/>' + '307 Trent Drive' + '<br/>Durham, NC 27710' + '<br/>' + '919.684.9759</p>'

    mailOptions.text = (mailOptions.html).replace(/<\/?[^>]+>/ig, " ");

    smtpTransport.sendMail(mailOptions, function (err) {
      if (err) {
        err.status = 400;
        return next(err);
      } else {
        console.log('Email sent to ' + mailOptions.to);
      }
    });
  }

  function emailManagerNewApplication(applicant, opening, options) {
    var applicantEmail = (_.find(applicant.emailAddresses, function(emailAddress) {
      return emailAddress.primary = true;
    })).emailAddress;

    var smtpTransport = nodemailer.createTransport(config.sendGridSettings);

    var applicantName = applicant.name.firstName + ' ' + applicant.name.lastName;
    var mailOptions = {
      to: options.emailTo,
      from: 'noreply@frs.nursing.duke.edu',
      subject: 'FRS Application Submitted: ' + applicantName + ' for ' + opening,
      url: options.url,
      styles: {
        button : "border: 1px solid black; padding: 5px; text-transform: uppercase;" +
        " border-radius: 5px; background: #eee; float: left",
        link : "text-transform: uppercase; color: #eee",
        span : "color: #000"
      }
    };
    console.log('Mail Options: ', mailOptions);

    mailOptions.html =  '<!DOCTYPE html> <p>Applicant: ' + applicantName + '<br/>' + 'Email: '  + '<a href="mailto:' + applicantEmail + '">' + applicantEmail + '</a><br/>' + 'Opening: ' + opening + '</p>' + '<div style="' + mailOptions.styles.button + '"/><a' + ' style=' + mailOptions.styles.link + ' href="http://' + mailOptions.url + '">' + '<span style="' + mailOptions.styles.span + '">View Application' + '</span></a></div>';

    mailOptions.text = (mailOptions.html).replace(/<\/?[^>]+>/ig, " ");

    smtpTransport.sendMail(mailOptions, function (err) {
      if (err) {
        err.status = 400;
        console.log(err);
      } else {
        console.log('Email sent to DFA: ' + mailOptions.to);
      }
    });
  }

  application.save(function (err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {

      if (application.cv || application.coverLetter) {
        getFiles(application)
          .then(function (result) {
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
 * Return true if EEO already provided for Application
 * empty
 * @param {Object} req
 * @param {Object} res
 */
exports.eeoProvided = function (req, res) {
  Application.findOne({_id: req.application._id})
    .exec(function (err, application) {
      console.log('executing eeoProvided for ', application._id);
      console.log('eeoProvided is', application.eeoProvided);
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
 * Adds conditions to the query passed in which will limit results to either active or inactive Applications
 * @param {Object} query
 * @param {Boolean|null} isActive
 * @returns {*}
 */
function addActiveConditionsToQuery(query, isActive) {
  if (isActive) {
    query = query
      .where('proceedToReview').ne(false)
      .where('reviewPhase.proceedToPhoneInterview').ne(false)
      .where('phoneInterviewPhase.proceedToOnSite').ne(false)
      .where('offer.extended').ne(false)
      .nor([{'offer.accepted': true}, {'offer.accepted': false}]);
  } else {
    query = query
      .or([
        {'proceedToReview': false},
        {'reviewPhase.proceedToPhoneInterview': false},
        {'phoneInterviewPhase.proceedToOnSite': false},
        {'offer.extended': false},
        {'offer.retracted': true},
        {'offer.accepted': false}
      ]);
  }
  return query;
}

/**
 * Add conditions for an Application to be considered successful to the given query and returns query
 * @param {Object} query
 * @returns {Object}
 */
function addSuccessfulApplicationConditionsToQuery(query) {
  query = query
    .where('offer.extended').equals(true)
    .where('offer.accepted').equals(true)
    .where('offer.retracted').ne(true);
  return query;
}

/**
 * Add fields to a worksheet.  It will only add the fields if the existing fields array is missing or empty.
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
    .exec(function (err, result) {
      if (err) {
        deferred.reject(err);
      } else {
        createBodyFields(result);
      }
    });

  function createBodyFields(worksheetFields) {
    var bodyFields = [];
    if (worksheetFields && worksheetFields.length) {
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

      if (!application[phaseName][reviewArray]) {
        application[phaseName][reviewArray] = [];
      }

      var existingReviewCount = application[phaseName][reviewArray].length;
      var additionalReviewsNeeded = 2 - existingReviewCount;

      for (var i = 0; i < additionalReviewsNeeded; i++) {
        application[phaseName][reviewArray].push(new Review());
      }

      _.forEach(application[phaseName][reviewArray], function (review) {
        //if the body object does not exist for the review, add it.
        if (!_.isObject(review[worksheetType].body)) {
          review[worksheetType].body = {};
        }
        var fields = review[worksheetType].body.fields;
        //if the fields array does not exist or is not populated, we populate it.
        if (!fields || !_.isArray(fields) || !fields.length) {
          review[worksheetType].body.fields = bodyFields;
        }
      });

      deferred.resolve(application);

    } else {
      deferred.reject('error: phase specified does not exist');
    }
  }

  return deferred.promise;
}

/**
 * Delete CV and Cover Letter associated with an application
 * @param {Object} application
 * @returns {deferred.promise|{then}}
 */
function deleteAndRemoveFiles(application) {
  var deferred = Q.defer();

  if (application.cv) {
    var fileId = application.cv;
    doDelete(fileId, application.cv, deleteCoverLetter);
  } else {
    deleteCoverLetter();
  }

  function deleteCoverLetter() {
    if (application.coverLetter) {
      var fileId = application.coverLetter;
      doDelete(fileId, application.coverLetter, done);
    }
  }

  function done() {
    deferred.resolve(application);
  }

  function doDelete(fileId, fileReference, callback) {
    gfs.remove({_id: fileId}, function (err) {
      if (err) {
        deferred.resolve(err);
      }
      fileReference = null;
      callback();
    });
  }

  return deferred.promise;

}

/**
 * Get the error message from the Error Object
 * @param {Error} err
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
 * @param {String} fileId
 * @param {Function} callback
 */
function getFileMetadata(fileId, callback) {

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
 * @param {Object} application
 * @returns {deferred.promise|{then}}
 */
function getFiles(application) {
  var deferred = Q.defer();
  async.parallel([
    function (callback) {
      getFileMetadata(application.cv, callback);
    },
    function (callback) {
      getFileMetadata(application.coverLetter, callback);
    }
  ], function (err, results) {
    if (err) {
      console.log(err);
      deferred.reject(err);
    } else {
      if (results[0]) {
        application._doc.cvFileMeta = results[0];
      }
      if (results[1]) {
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
 * @param {Object} req
 * @returns {boolean}
 */
function isPhoneInterviewer(req) {
  var interviewerFound = false;
  _.forEach(req.application.phoneInterviewPhase.phoneInterviews, function (phoneInterview) {
    if ((req.user._id === phoneInterview.interviewer._id.toString()) && !interviewerFound) {
      interviewerFound = true;
    }
  });
  return interviewerFound;
}

/**
 * Check that the authenticated User is an Assigned Reviewer
 * @param {Object} req
 * @returns {boolean}
 */
function isReviewer(req) {
  var reviewerFound = false;
  _.forEach(req.application.reviewPhase.reviews, function (review) {
    if ((req.user._id === review.reviewer._id.toString()) && !reviewerFound) {
      reviewerFound = true;
    }
  });
  return reviewerFound;
}

/**
 * Send server response or error. used by various exported methods where promises are employed
 * @param {Error|null} err
 * @param {Object|null} data
 * @param {Object} res
 */
function sendResponse(err, data, res) {
  if (err) {
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

//TODO where is the best place to put this

function getEmailAddressesByRole(emailAddresses, role) {
  var deferred = Q.defer();
  User.find({roles: role})
      .select('email')
      .exec(function(err, res) {
        if (err) {
          //TODO what would xyou do except log it?
          deferred.reject(err);
        } else {
          emailAddresses = _(res).pluck('email').join(", ");
          deferred.resolve(emailAddresses);
        }
      });
  return deferred.promise;
};


function emailSCMApplicationReviews(application, options) {
  //TODO refactor - most of this code is replicated from exports.update
  var applicant = Applicant.findById(application.applicant)
      .exec(function (err, applicant) {
        if (err) {
        }
        else {
          var opening = Opening.findById(application.opening)
              .exec(function (err, opening) {
                if (err) {
                }
                else {
                  var opening = opening.name;
                  var scmEmails = [];
                  getEmailAddressesByRole(scmEmails, 'committee member').then(function(scmEmails) {
                    options.emailTo = scmEmails;
                    emailSCMApprovedApplication(applicant, opening, options);
                  });
                }
              });
        }
      });

  function emailSCMApprovedApplication(applicant, opening, options) {
    var email = (_.find(applicant.emailAddresses, function(emailAddress) {
      return emailAddress.primary = true;
    })).emailAddress;
    var emailTo = (process.env.NODE_ENV === 'production') ? config.email.dfa : developerSettings.developerEmail;

    var smtpTransport = nodemailer.createTransport(config.sendGridSettings);

    var applicantName = applicant.name.firstName + ' ' + applicant.name.lastName;
    var mailOptions = {
      to: emailTo,
      from: 'noreply@frs.nursing.duke.edu',
      subject: 'FRS Application Approved for Further Review: ' + applicantName + ' for ' + opening,
      url: options.url,
      styles: {
        button : "border: 1px solid black; padding: 5px; text-transform: uppercase;" +
        " border-radius: 5px; background: #eee; float: left",
        link : "text-transform: uppercase; color: #eee",
        span : "color: #000"
      }
    };
    console.log('Mail Options: ', mailOptions);

    mailOptions.html =  '<!DOCTYPE html> <p>Applicant: ' + applicantName + '<br/>' +
        'Opening: ' + opening + '</p>' + '<div style="' + mailOptions.styles.button + '"/><a' +
        ' style=' + mailOptions.styles.link +
        ' href="http://' + mailOptions.url + '">' + '<span style="' + mailOptions.styles.span + '">View Application' + '</span></a></div>';

    mailOptions.text = (mailOptions.html).replace(/<\/?[^>]+>/ig, " ");

    smtpTransport.sendMail(mailOptions, function (err) {
      if (err) {
        err.status = 400;
        console.log(err);
      } else {
        console.log('Email sent to SCM: ' + mailOptions.to);
      }
    });
  }

}

