'use strict';

module.exports = function(app) {
  var applications = require('../../app/controllers/applications.server.controller');
  var uploads = require('../../app/controllers/uploads.server.controller');

  app.route('/uploads/file').post(uploads.uploadFile); //route called to update cv for existing application

};
