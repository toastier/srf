'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Position = mongoose.model('Position'),
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
        message = 'Position already exists';
        break;
      default:
        message = 'Something went wrong';
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }

  return message;
};

/**
 * Create a position
 */
exports.create = function (req, res) {
  var position = new Position(req.body);
  position.user = req.user;

  position.save(function (err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(position);
    }
  });
};

/**
 * Show the current position
 */
exports.read = function (req, res) {
  res.jsonp(req.position);
};

/**
 * Update a position
 */
exports.update = function (req, res) {
  var position = req.position;

  position = _.extend(position, req.body);

  position.save(function (err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(position);
    }
  });
};

/**
 * Delete an position
 */
exports.delete = function (req, res) {
  var position = req.position;

  position.remove(function (err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(position);
    }
  });
};

/**
 * List of Positions
 */
exports.list = function (req, res) {
  Position.find().sort('-postDate').populate('user', 'displayName').exec(function (err, positions) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(positions);
    }
  });
};

/**
 * Position middleware
 */
exports.positionByID = function (req, res, next, id) {
  Position
    .findById(id)
    .populate('user', 'displayName')
    .exec(function (err, position) {
      if (err) {
        return next(err);
      }
      if (!position) {
        return next(new Error('Failed to load position ' + id));
      }
      req.position = position;
      next();
    });
};

/**
 * Position authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
  if (req.position.user.id !== req.user.id) {
    return res.send(403, {
      message: 'User is not authorized'
    });
  }
  next();
};