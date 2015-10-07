'use strict';

module.exports = function(app) {
  var applications = require('../../app/controllers/applications.server.controller');
  var uploads = require('../../app/controllers/uploads.server.controller');

  app.route('/uploads/cv').post(uploads.uploadCv, applications.update); //route called to update cv for existing application
  app.route('/uploads/coverLetter').post(uploads.uploadCv, applications.update); //route called to update cover letter for existing application
  app.route('/uploads/newApplication').post(uploads.uploadCvAndCoverLetter);

};
