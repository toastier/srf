'use strict';
var users = require('../../app/controllers/users.server.controller');

module.exports = function(app) {
  var uploads = require('../../app/controllers/uploads.server.controller');

  app.route('/uploads/file')
    .post(uploads.uploadFile); //route called to add file to existing application

  app.route('/uploads/file/:fileId')
    .get(users.requiresLogin, users.hasAuthorization(['admin', 'manager', 'committee member']), uploads.getFileById);
};
