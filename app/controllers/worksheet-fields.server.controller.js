'use strict';

var mongoose = require('mongoose');
var WorksheetField = mongoose.model('WorksheetField');
var _ = require('lodash');

/**
 * WorksheetField middleware
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @param {String} id
 */
exports.worksheetFieldById = function (req, res, next, id) {
  WorksheetField
    .findById(id)
    .exec(function (err, worksheetField) {
      if (err) {
        return next(err);
      }
      if (!worksheetField) {
        return next({
          message: 'Failed to load worksheet field ' + id
        });
      }
      req.worksheetField = worksheetField;
      next();
    });
};

exports.list = function (req, res) {
  WorksheetField
    .find()
    .sort('order')
    .sort('name')
    .exec(function (err, worksheetFields) {
      if (err) {
        return res.send(400, {
          message: err
        });
      } else {
        res.jsonp(worksheetFields);
      }
    });
};

exports.byType = function (req, res) {
  WorksheetField
    .find()
    .where('appliesTo').equals(req.params.type)
    .exec(function (err, worksheetFields) {
      if (err) {
        return res.send(400, {
          message: err
        });
      } else {
        res.jsonp(worksheetFields);
      }
    });
};

exports.create = function (req, res) {
  var worksheetField = new WorksheetField(req.body);

  worksheetField.save(function (err) {
    if (err) {
      return res.send(400, {
        message: err
      });
    } else {
      res.jsonp(worksheetField);
    }
  });
};

exports.delete = function (req, res) {
  var worksheetField = req.worksheetField;

  worksheetField.remove(function (err) {
    if (err) {
      return res.send(400, {
        message: err
      });
    } else {
      res.jsonp(worksheetField);
    }
  });
};

exports.update = function (req, res) {
  var worksheetField = req.worksheetField;

  worksheetField = _.extend(worksheetField, req.body);

  worksheetField.save(function (err) {
    if (err) {
      return res.send(400, err);
    } else {
      res.jsonp(worksheetField);
    }
  });
};
