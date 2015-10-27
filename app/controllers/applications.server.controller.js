'use strict';

/**
 * Module dependencies.
 */
var config = require('../../config/config');
var mongoose = require('mongoose');
var mongo = mongoose.mongo;
var grid = require('gridfs-stream');
var _ = require('lodash');
var Application = mongoose.model('Application');
var Applicant = mongoose.model('Applicant');
var async = require('async');
var mime = require('mime-types');

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
        getFiles(application);
      } else {
        req.application = application;
        next();
      }
    });

  function getFiles (application) {
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
        next(err);
      } else {
        if(results[0]) {
          application._doc.cvFileMeta = results[0];
        }
        if(results[1]){
          application._doc.coverLetterFileMeta = results[1];
        }
        req.application = application;
        next();
      }
    });
  }

  /**
   * Returns metadata for the given file
   * @param fileId
   * @param callback
   * @param application
   * @param fileType
   */
  function getFileMetadata (fileId, callback, application, fileType) {
    var connection = mongoose.createConnection(config.db);
    connection.once('open', function () {
      var gfs = grid(connection.db, mongo);
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
    });
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
 * Deletes an application.reviewPhase.reviews.reviewWorksheet.comments object
 * @param req
 * @param res
 */
exports.deleteComment = function(req, res) {
  var review = req.body.review;
  var comment = req.body.comment;
  var deleted = false;
  var index;
  var match = false;

  _.forEach(req.application.reviewPhase.reviews, function(existingReview) {
    if(!match && existingReview._id.toString() === review._id) {
      _.forEach(existingReview.reviewWorksheet.comments, function(existingComment) {
        if(!match && existingComment._id.toString() === comment._id) {
          index = existingReview.reviewWorksheet.comments.indexOf(existingComment);
          match = true;
        }
      });
      if(match && !_.isUndefined(index)) {
          existingReview.reviewWorksheet.comments.splice(index, 1);
          deleted = true;
      }
    }
  });

  if(deleted) {
    req.application.save(function(err, application){
      if(err) {
        res.send(400, 'An error occurred while deleting the comment.');
      } else {
        res.jsonp(application);
      }
    });
  } else {
    res.send(400, {message: 'Nothing was deleted'});
  }

};

/**
 * Saves a new comment on application.[phase][subjectArray][worksheet], or updates an existing comment
 * @description
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
   * save the Application and return the response
   * @param applicant
   */
  function saveApplication(applicant) {
    application.applicant = applicant._id;

    application.save(function(err, result) {
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
      } else {
        if (application && (application.cv || application.coverLetter)) {
          getFiles(application);
        } else {
          return res.jsonp(application);
        }
      }
    });

  function getFiles (application) {
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
      } else {
        if(results[0]) {
          application._doc.cvFileMeta = results[0];
        }
        if(results[1]){
          application._doc.coverLetterFileMeta = results[1];
        }
        res.jsonp(application);
      }
    });
  }

  /**
   * Returns metadata for the given file
   * @param fileId
   * @param callback
   * @param application
   * @param fileType
   */
  function getFileMetadata (fileId, callback, application, fileType) {
    var connection = mongoose.createConnection(config.db);
    connection.once('open', function () {
      var gfs = grid(connection.db, mongo);
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
    });
  }
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
 * Get Applications where Authenticated User is the Reviewer
 * @param req
 * @param res
 */
exports.iAmReviewer = function (req, res) {
  Application.find()
    .where('reviewPhase.reviews.reviewer').equals(req.user._id)
    .where('proceedToReview').equals(true)
    .or([{'reviewPhase.proceedToPhoneInterview': false}, {'reviewPhase.proceedToPhoneInterview': null}])
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
 * Get Applications wehre Authenticated User is the Phone Interviewer
 * @param req
 * @param res
 */
exports.iAmPhoneInterviewer = function (req, res) {
  Application.find()
    .where('phoneInterviewPhase.phoneInterviews.interviewer').equals(req.user._id)
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
        res.jsonp(applications);
      }
    });
};

/**
 * Return JSON of current Application
 * @param req
 * @param res
 */
exports.read = function (req, res) {
  res.jsonp(req.application);
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

      if(application.cv || application.coverLetter) {
        getFiles(application);
      } else {
        req.application = application;
        res.jsonp(application);
      }

    }
  });

  function getFiles () {
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
      } else {
        if(results[0]) {
          application._doc.cvFileMeta = results[0];
        }
        if(results[1]){
          application._doc.coverLetterFileMeta = results[1];
        }
        req.application = application;
        res.jsonp(application);
      }
    });
  }

  /**
   * Returns metadata for the given file
   * @param fileId
   * @param callback
   * @param application
   * @param fileType
   */
  function getFileMetadata (fileId, callback, application, fileType) {
    var connection = mongoose.createConnection(config.db);
    connection.once('open', function () {
      var gfs = grid(connection.db, mongo);
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
    });
  }


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

function Comment(comment) {
  if (!comment) {
    comment = {};
  }
  this.comment = comment.comment || '';
  this.commenter = comment.commenter || undefined;
  this.dateCreated = comment.dateCreated || Date.now();
  this.dateUpdated = Date.now();
}
