'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users')
  , applications = require('../../app/controllers/applications')
  , uploads = require('../../app/controllers/uploads.server.controller');

module.exports = function (app) {
  // Application Routes
  app.route('/applications')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.list)
    .post(applications.create); //@todo need to consider security here more thoroughly
  app.route('/applications/:applicationId')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.read)
    .put(applications.update)//@todo this is a big security no no.  Need to fix
    .delete(users.requiresLogin, users.hasAuthorization(['manager', 'admin']), applications.delete);

  // Finish by binding the application middleware
  app.param('applicationId', applications.applicationByID);
};