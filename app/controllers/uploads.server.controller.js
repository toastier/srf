'use strict';

var config = require('../../config/config');
var mongoose = require('mongoose');
var mongo = mongoose.mongo;
var mime = require('mime-types');
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
 * Returns metadata for the given file
 * @param fileId
 */
exports.getFileMetadata = function (fileId) {
  var connection = mongoose.createConnection(config.db);
  connection.once('open', function () {
    var gfs = grid(connection.db, mongo);
    gfs.findOne({_id: fileId}, function (err, file) {
      if (err) {
        //@todo handle error
        console.log(err);
      } else {
        return file;
      }
    });
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

exports.setHeadersForEmbed = function (req, res, next) {
  res.set('X-Frame-Options', 'SAMEORIGIN');
  next();
};

exports.setHeadersForDownload = function (req, res, next) {
  res.set('Content-Disposition', 'attachment');
  next();
};

/**
 * Streams a file from GridFS
 * @param req
 * @param res
 * @param next
 */
exports.getFileById = function (req, res, next) {

  var connection = mongoose.createConnection(config.db);
  connection.once('open', function () {

    var gfs = grid(connection.db, mongo);

    gfs.findOne({_id: req.params.fileId}, function (err, fileMeta) {
      if (err) {
        //@todo handle error
        console.log(err);
      } else {

        var readStream = gfs.createReadStream({
          _id: req.params.fileId
        });
        //@todo detect file type and set headers appropriately
        res.set('Content-Type', mime.lookup(fileMeta.filename));

        // check if the file is to be downloaded and set the Content-Disposition http header accordingly
        var contentDisposition = res.get('Content-Disposition');
        if (contentDisposition && contentDisposition === 'attachment') {
          res.set('Content-Disposition', 'attachment; ' + 'filename="' + fileMeta.filename + '"');
        }

        req.on('error', function (err) {
          res.send(500, err);
        });

        readStream.on('error', function (err) {
          res.send(500, err);
        });

        readStream.pipe(res);
      }
    });
  });
};

exports.deleteFile = function(req, res, next) {
  var fileId = req.params.fileId;
  var connection = mongoose.createConnection(config.db);
  connection.once('open', function () {

    var gfs = grid(connection.db, mongo);

    gfs.remove({_id: fileId}, function(err) {
      if(err) {
        res.send(400, {message: 'An error occurred while deleting the file'});
      }
      next();
    });

  });

};
