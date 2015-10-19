'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users');
var applications = require('../../app/controllers/applications');
var openings = require('../../app/controllers/openings.server.controller');

module.exports = function (app) {
  // Application Routes
  app.route('/applications')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.list)
    .post(applications.create); //@todo need to consider security here more thoroughly

  app.route('/applications/createForUser')
    .post(users.requiresLogin, users.hasAuthorization(['user']), applications.createForUser);

  app.route('/applications/forOpeningForUser/:openingId')
    .get(users.requiresLogin, users.hasAuthorization(['user']), applications.findForUserForOpening);

  app.route('/applications/iAmReviewer')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.iAmReviewer);

  app.route('/applications/iAmPhoneInterviewer')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.iAmPhoneInterviewer);

  app.route('/applications/:applicationId/conductPhoneInterview')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.conductPhoneInterview);

  app.route('/applications/:applicationId/conductReview')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.conductReview);

  app.route('/applications/:applicationId')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.read)
    .put(applications.update)//@todo this is a big security no no.  Need to fix
    .delete(users.requiresLogin, users.hasAuthorization(['manager', 'admin']), applications.delete);

  // Finish by binding the application middleware
  app.param('applicationId', applications.applicationByID);
  app.param('openingId', openings.openingByID);
};