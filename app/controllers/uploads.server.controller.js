'use strict';

var config = require('../../config/config');
var mongoose = require('mongoose');
var mongo = mongoose.mongo;
var formidable = require('formidable');
var fs = require('fs');
var grid = require('gridfs-stream');
var connection = mongoose.createConnection(config.db);
var db = connection.db;
var async = require('async');
var _ = require('lodash');

/**
 * Handles uploading a cv and inserting into FSGrid Mongo Storage
 * @param req
 * @param res
 * @param next
 */
exports.uploadCv = function (req, res, next) {
  var form = new formidable.IncomingForm();
  form.uploadDir = __dirname + '/../data/uploads/cv';
  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    if (!err) {
      console.log('File uploaded : ' + files.file.path);
      connection.once('open', function () {
        var gfs = grid(db, mongo);
        var writeStream = gfs.createWriteStream({
          filename: files.file.name
        });
        fs.createReadStream(files.file.path).pipe(writeStream);

        writeStream.on('close', function (gfsFile) {
          fs.unlink(files.file.path, function () {
            req.fileId = gfsFile._id;
            next();
          });
        });
      });
    }
  });
};

/**
 * Handles uploading coverLetter and cv, and inserting into FSGrid Mongo storage
 * @param req
 * @param res
 * @param next
 */
exports.uploadCvAndCoverLetter = function (req, res, next) {
  var form = new formidable.IncomingForm();
  form.uploadDir = __dirname + '/../data/uploads';
  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    if (!err) {
      //console.log('File uploaded : ' + files.file.path);
      connection.once('open', function () {
        var gfs = grid(db, mongo);

        //async as it is an IO operation running on each item in files
        //async.each(files, function(file, callback) {
          var writeStream = gfs.createWriteStream({
            filename: file.name
          });
          fs.createReadStream(files.file.path).pipe(writeStream);

          writeStream.on('close', function (gfsFile) {
            fs.unlink(files.file.path, function () {

              req.fileId = gfsFile._id;
              next();
              //return res.send('done');
            });
            //callback();
          });
        //});
        //next();

      });
    }
  });
};
