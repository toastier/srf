'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Applicant = mongoose.model('Applicant'),
  _ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function (err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'Applicant already exists';
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
};

/**
 * Create a applicant
 */
exports.create = function (req, res) {
  var applicant = new Applicant(req.body);
  applicant.user = req.user;

  applicant.save(function (err) {
    if (err) {
      return res.send(400, {
        // this doesn't work, dumping errorHandler into its own controller
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(applicant);
    }
  });
};

/**
 * Show the current applicant
 */
exports.read = function (req, res) {
  res.jsonp(req.applicant);
};

/**
 * Update a applicant
 */
exports.update = function (req, res) {
  var applicant = req.applicant;

  applicant = _.extend(applicant, req.body);

  applicant.save(function (err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(applicant);
    }
  });
};

/**
 * Delete an applicant
 */
exports.delete = function (req, res) {
  var applicant = req.applicant;

  applicant.remove(function (err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(applicant);
    }
  });
};


/**
 * List of Applicants
 */
exports.list = function (req, res) {
  Applicant.find()
      .select('name dateCreated')
      .sort('-postDate')
      .exec(function (err, applicants) {
        if (err) {
          return res.send(400, {
            message: getErrorMessage(err)
          });
        } else {
          res.jsonp(applicants);
        }
      });
};

/**
 * Applicant middleware
 */
exports.applicantByID = function (req, res, next, id) {
  Applicant.findById(id).populate('user', 'displayName').exec(function (err, applicant) {
    if (err) {
      return next(err);
    }
    if (!applicant) {
      return next(new Error('Failed to load applicant ' + id));
    }
    req.applicant = applicant;
    next();
  });
};

/**
 * Applicant authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
  if (req.applicant.user.id !== req.user.id) {
    return res.send(403, {
      message: 'User is not authorized'
    });
  }
  next();
};
