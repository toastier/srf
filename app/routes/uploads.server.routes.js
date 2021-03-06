'use strict';
var users = require('../../app/controllers/users.server.controller');

module.exports = function(app) {
  var uploads = require('../../app/controllers/uploads.server.controller');

  app.route('/uploads/file')
    .post(uploads.uploadFile); //route called to add file to existing application

  app.route('/uploads/file/download/:fileId') //@todo add ability for user to view/download own files
    .get(users.hasAuthorization(['admin', 'manager', 'committee member'])
      , uploads.setHeadersForDownload
      , uploads.getFileById);

  app.route('/uploads/file/:fileId')
    .get(users.hasAuthorization(['admin', 'manager', 'committee member'])
      , uploads.setHeadersForEmbed
      , uploads.getFileById);
};
