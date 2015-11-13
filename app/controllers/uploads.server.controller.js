'use strict';

var config = require('../../config/config');
var mongoose = require('mongoose');
var mongo = mongoose.mongo;
var mime = require('mime-types');
var formidable = require('formidable');
var fs = require('fs');
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = new Grid(mongoose.connection.db);

/**
 * Handles uploading a cv and inserting into FSGrid Mongo Storage
 * @param {Obejct} req
 * @param {Object} res
 * @param {Function} next
 * @todo consider combining with #uploadFile method
 */
exports.uploadNewFile = function (req, res, next) {
  var form = new formidable.IncomingForm();
  form.uploadDir = __dirname + '/../data/uploads/cv';
  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    if (!err) {
      console.log('File uploaded : ' + files.file.path);

      var writeStream = gfs.createWriteStream({
        filename: files.file.name
      });

      fs.createReadStream(files.file.path).pipe(writeStream);

      writeStream.on('close', function (gfsFile) {
        fs.unlink(files.file.path, function () {
          req.newFileId = gfsFile._id;
          next();
        });
      });
    }
  });
};

/**
 * Handles uploading a cv and inserting into FSGrid Mongo Storage
 * @param {Object} req
 * @param {Object} res
 * @todo consider combining with #uploadNewFile method
 */
exports.uploadFile = function (req, res) {
  var form = new formidable.IncomingForm();
  form.uploadDir = __dirname + '/../data/uploads/cv';
  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    if (!err) {
      console.log('File uploaded : ' + files.file.path);
      var writeStream = gfs.createWriteStream({
        filename: files.file.name
      });
      fs.createReadStream(files.file.path).pipe(writeStream);
      writeStream.on('close', function (gfsFile) {
        fs.unlink(files.file.path, function () {
          res.jsonp({fileId: gfsFile._id});
        });
      });
    }
  });
};

/**
 * Returns metadata for the given file
 * @param {String} fileId
 */
exports.getFileMetadata = function (fileId) {
  gfs.findOne({_id: fileId}, function (err, file) {
    if (err) {
      //@todo handle error
      console.log(err);
    } else {
      return file;
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
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.getFileById = function (req, res, next) {

  gfs.findOne({_id: req.params.fileId}, function (err, fileMeta) {
    if (err) {
      err.status = 404;
      return next(err);
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
};

/**
 * Delete a file from GridFS
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.deleteFile = function (req, res, next) {
  var fileId = req.params.fileId;
  gfs.remove({_id: fileId}, function (err) {
    if (err) {
      res.send(400, {message: 'An error occurred while deleting the file'});
    }
    next();
  });
};
