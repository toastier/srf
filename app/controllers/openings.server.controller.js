'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Opening = mongoose.model('Opening'),
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
        message = 'Opening already exists';
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
 * Create a opening
 */
exports.create = function (req, res) {
  var opening = new Opening(req.body);
  opening.user = req.user;

  opening.save(function (err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(opening);
    }
  });
};

/**
 * Show the current opening
 */
exports.read = function (req, res) {
  res.jsonp(req.opening);
};

/**
 * Get data for opening, if opening is active, open and not closed
 * @param {Object} req
 * @param {Object} res
 */
exports.readCurrent = function (req, res) {
  //@todo add control over 'currentness' of opening
  res.jsonp(req.opening);
};

/**
 * Update a opening
 */
exports.update = function (req, res) {
  var opening = req.opening;

  opening = _.extend(opening, req.body);

  opening.save(function (err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(opening);
    }
  });
};

/**
 * Delete an opening
 */
exports.delete = function (req, res) {
  var opening = req.opening;

  opening.remove(function (err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(opening);
    }
  });
};

/**
 * List of Openings
 */
exports.list = function (req, res) {
  Opening
    .find()
    .sort('-datePosted')
    .exec(function (err, openings) {
      if (err) {
        return res.send(400, {
          message: getErrorMessage(err)
        });
      } else {
        res.jsonp(openings);
      }
    });
};

/**
 * List of Openings for public access
 * @param {Object} req
 * @param {Object} res
 */
exports.current = function (req, res) {
  var conditions = {isActive: true};
  if (req.params && req.params.position) {
    conditions.position = req.params.position;
  }
  Opening
    .find(conditions)
    .where('dateStart').lte(Date.now())
    .where('dateClose').gte(Date.now())
    .sort('-datePosted')
    .exec(function (err, openings) {
      if (err) {
        return res.send(400, {
          message: getErrorMessage(err)
        });
      } else {
        res.jsonp(openings);
      }
    });
};

/**
 * Opening middleware
 */
exports.openingByID = function (req, res, next, id) {
  Opening
    .findById(id)
    .populate('postingLink')
    .exec(function (err, opening) {
      if (err) {
        return next(err);
      }
      if (!opening) {
        return next(new Error('Failed to load opening ' + id));
      }
      req.opening = opening;
      next();
    });
};

/**
 * Opening authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
  if (req.opening.user.id !== req.user.id) {
    return res.send(403, {
      message: 'User is not authorized'
    });
  }
  next();
};
