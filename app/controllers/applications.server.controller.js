'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var _ = require('lodash');
var Application = mongoose.model('Application');
var Applicant = mongoose.model('Applicant');

/**
 * Application middleware
 */
exports.applicationByID = function (req, res, next, id) {
  Application.findById(id)
    .populate('applicant')
    .populate('opening')
    .exec(function (err, application) {
      if (err) {
        return next(err);
      }

      if (!application) {
        return next(new Error('Failed to load application ' + id));
      }

      req.application = application;
      next();
    });
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
    if((req.user._id === review.reviewer.toString()) && !reviewerFound) {
      reviewerFound = true;
    }
  });
  return reviewerFound;
}
