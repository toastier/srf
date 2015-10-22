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
    .exec(function (err, application) {

      if (err) {
        return next(err);
      }

      if (!application) {
        return next(new Error('Failed to load application ' + id));
      }

      getFiles(application);

    });

  function getFiles (application) {
    async.parallel([
      function(callback) {
        getFileMetadata(application.cv, callback, application, 'cv');
      },
      function(callback) {
        getFileMetadata(application.coverLetter, callback, application, 'coverLetter');
      }
    ], function (err, results) {
      if (err) {
        console.log(err);
        next(err);
      } else {
        application._doc.cvFileMeta = results[0];
        application._doc.coverLetterFileMeta = results[1];
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
          //console.log(file);
          //if(fileType === 'cv') {
          //  application.cvFileMeta = file;
          //} else if(fileType === 'coverLetter') {
          //  application.coverLetterFileMeta = file;
          //}
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
 * Saves a new comment on application.reviewPhase.reviews.reviewWorksheet, or updates an existing comment
 * @todo Ensure comment can only be updated by the commenter
 * @param req
 * @param res
 */
exports.saveComment = function(req, res) {
  var review = req.body.review;
  var comment = req.body.comment;
  var mode = 'update';
  var existingReview = req.application.reviewPhase.reviews.id(review._id);

  comment.commenter = req.user._id;

  if(!comment._id) {
    mode = 'add';
  }

  if(mode === 'add'){
    var commentAdded = false;

    if(existingReview) {
      comment = new Comment(comment);
      existingReview.reviewWorksheet.comments.push(comment);
      comment = existingReview.reviewWorksheet.comments[existingReview.reviewWorksheet.comments.length - 1];
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
    var existingComment = existingReview.reviewWorksheet.comments.id(comment._id);

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
      }
      return res.jsonp(application);
    });
};

/**
 * Application Authorization Middleware
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.hasAuthorization = function (req, res, next) {
  if (req.application.user.id !== req.user.id) {
    return res.send(403, {
      message: 'User is not authorized'
    });
  }
  next();
};

/**
 * Get Applications where Authenticated User is the Reviewer
 * @param req
 * @param res
 */
exports.iAmReviewer = function (req, res) {
  Application.find({'reviewPhase.reviews.reviewer': req.user._id})
    .sort('-postDate')
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
  Application.find({'phoneInterviewPhase.phoneInterviews.interviewer': req.user._id})
    .sort('-postDate')
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

/**
 * Update an Application
 * @param req
 * @param res
 */
exports.update = function (req, res) {
  var application = req.application;

  application = _.extend(application, req.body);

  application.save(function (err) {
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
    if((req.user._id === phoneInterview.interviewer.toString()) && !interviewerFound) {
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
