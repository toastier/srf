'use strict';

var config = require('../../config/config');
var mongoose = require('mongoose');
var mongo = mongoose.mongo;
var formidable = require('formidable');
var fs = require('fs');
var grid = require('gridfs-stream');
var async = require('async');
var _ = require('lodash');

/**
 * Handles uploading a cv and inserting into FSGrid Mongo Storage
 * @param req
 * @param res
 * @param next
 * @todo split this out to distinguish between cv and coverLetter uploads
 */
exports.uploadFile = function (req, res) {
  var form = new formidable.IncomingForm();
  form.uploadDir = __dirname + '/../data/uploads/cv';
  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    if (!err) {
      console.log('File uploaded : ' + files.file.path);
      grid.mongo = mongo;
      var connection = mongoose.createConnection(config.db);
      connection.once('open', function () {
        var gfs = grid( connection.db, mongo);
        var writeStream = gfs.createWriteStream({
          filename: files.file.name
        });
        fs.createReadStream(files.file.path).pipe(writeStream);

        writeStream.on('close', function (gfsFile) {
          fs.unlink(files.file.path, function () {
            res.jsonp({fileId: gfsFile._id});
          });
        });
      });
    }
  });
};

/**
 * Handles uploading a coverLetter and inserting into FSGird Mongo Storage
 * @param req
 * @param res
 * @param next
 */
exports.uploadCoverLetter = function (req, res, next) {
  var form = new formidable.IncomingForm();
  form.uploadDir = __dirname + '/../data/uploads/coverLetter';
  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    if (!err) {
      console.log('File uploaded : ' + files.file.path);
      grid.mongo = mongo;
      var connection = mongoose.createConnection(config.db);
      connection.once('open', function () {
        var gfs = grid( connection.db, mongo);
        var writeStream = gfs.createWriteStream({
          filename: files.file.name
        });
        fs.createReadStream(files.file.path).pipe(writeStream);

        writeStream.on('close', function (gfsFile) {
          fs.unlink(files.file.path, function () {
            res.jsonp({coverLetter: gfsFile._id});
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
      grid.mongo = mongo;
      var connection = mongoose.createConnection(config.db);
      connection.once('open', function () {
        var gfs = grid( connection.db, mongo);

        //async as it is an IO operation running on each item in files
        async.each(files,
          //executed for each item in the collection (file in files)
          function(file, callback) {
            var writeStream = gfs.createWriteStream({
              filename: file.name
            });
            fs.createReadStream(file.path).pipe(writeStream);

            writeStream.on('close', function (gfsFile) {
              fs.unlink(file.path, function () {
                //todo remove files from file system
                req.fileId = gfsFile._id;
                //next();
              });
              callback();
            });
        },
        //executed when all async operations have completed
        function(err) {
          if(err) {
            //todo handle the error
          }
          return res.send('done');
          //next();
        });
      });
    } else {
      return res.send(err.message);
    }
  });
};
