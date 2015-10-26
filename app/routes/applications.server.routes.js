'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users');
var applications = require('../../app/controllers/applications.server.controller');
var openings = require('../../app/controllers/openings.server.controller');

var isCurrentUser = function() {
  return true;
}

module.exports = function (app) {
  // Application Routes
  app.route('/applications')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.list)
    .post(applications.create); //@todo need to consider security here more thoroughly

  app.route('/applications/createForUser')
    .post(users.requiresLogin, users.hasAuthorization(['user']), applications.createForUser);

  app.route('/applications/forOpeningForUser/:openingId')
    .get(applications.findForUserForOpening); //@todo look at security on this

  app.route('/applications/iAmReviewer')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.iAmReviewer);

  app.route('/applications/iAmPhoneInterviewer')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.iAmPhoneInterviewer);

  app.route('/applications/:applicationId/conductPhoneInterview')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.conductPhoneInterview);

  app.route('/applications/:applicationId/conductReview')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.conductReview);
  
  app.route('/applications/:applicationId/saveReview/:reviewId')
    .post(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.saveReview);

  app.route('/applications/:applicationId/saveComment')
    .post(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.saveComment);

  app.route('/applications/:applicationId/deleteComment')
    .post(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.deleteComment);

  app.route('/applications/:applicationId')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member', isCurrentUser]), applications.read)
    .put(applications.update)//@todo this is a big security no no.  Need to fix
    .delete(users.requiresLogin, users.hasAuthorization(['manager', 'admin']), applications.delete);

  // Finish by binding the application middleware
  app.param('applicationId', applications.applicationByID);
  app.param('openingId', openings.openingByID);
};
