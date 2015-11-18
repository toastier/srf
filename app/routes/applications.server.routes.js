'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller');
var applications = require('../../app/controllers/applications.server.controller');
var openings = require('../../app/controllers/openings.server.controller');
var uploads = require('../../app/controllers/uploads.server.controller');

module.exports = function (app) {
  // Application Routes
  app.route('/applications')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.list)
    .post(users.requiresLogin, users.hasAuthorization(['manager', 'admin']), applications.create);

  app.route('/applications/allOpen')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.allOpen);

  app.route('/applications/allClosed')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.allClosed);

  app.route('/applications/allReviewPhase')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.allReviewPhase);

  app.route('/applications/allPhoneInterviewPhase')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.allPhoneInterviewPhase);

  app.route('/applications/allOnSiteVisitPhase')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.allOnSiteVisitPhase);

  app.route('/applications/allNotSubmitted')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.allNotSubmitted);

  app.route('/applications/allSuccessful')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.allSuccessful);

  app.route('/applications/createByUser')
    .post(users.requiresLogin, users.hasAuthorization(['user']), applications.createByUser);

  app.route('/applications/forOpeningForUser/:openingId')
    .get(applications.forOpeningForUser); //@todo look at security on this

  app.route('/applications/eoeProvided/:applicationId')
      .get(applications.eoeProvided);

  app.route('/applications/iAmReviewer')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.iAmReviewer);

  app.route('/applications/iAmPhoneInterviewer')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.iAmPhoneInterviewer);

  app.route('/applications/successfulForOpening/:opening')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.successfulForOpening);

  app.route('/applications/:applicationId/conductPhoneInterview')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.conductPhoneInterview);

  app.route('/applications/:applicationId/savePhoneInterview/:phoneInterviewId')
    .post(users.hasAuthorization(['manager', 'admin', 'committee member']), applications.savePhoneInterview);

  app.route('/applications/:applicationId/conductReview')
    .get(users.hasAuthorization(['manager', 'admin', 'committee member']), applications.conductReview);

  app.route('/applications/:applicationId/saveReview/:reviewId')
    .post(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.saveReview);

  app.route('/applications/:applicationId/saveComment')
    .post(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.saveComment);

  app.route('/applications/:applicationId/deleteComment')
    .post(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applications.deleteComment);

  app.route('/applications/:applicationId/removeFile/:fileId')
    .put(
      users.hasAuthorization(['manager', 'admin', 'user'])
      , applications.hasAuthorization //check that user is privileged user, or is the owner of the application
      , applications.removeFile //remove the file from req.application
      , uploads.deleteFile //delete the file from Mongo
      , applications.update //update the application
  );

  app.route('/applications/:applicationId/uploadFile/:type')
    .post(
    users.hasAuthorization(['manager', 'admin', 'user'])
    , applications.hasAuthorization
    , uploads.uploadNewFile
    , applications.addFile
    , applications.update
  );

  app.route('/applications/forOpening/:opening/:isActive')
    .get(users.hasAuthorization(['manager', 'admin', 'committee member']), applications.forOpening);

  app.route('/applications/forApplicant/:applicant/:isActive')
    .get(users.hasAuthorization(['manager', 'admin', 'committee member']), applications.forApplicant);

  app.route('/applications/:applicationId/manage')
    .put(users.hasAuthorization(['manager', 'admin']), applications.manage);

  app.route('/applications/:applicationId')
    .get(users.hasAuthorization(['manager', 'admin', 'committee member', 'user'])
      , applications.hasAuthorization,
      applications.read)
    .put(applications.update)//@todo this is a big security no no.  Need to fix
    .delete(users.requiresLogin, users.hasAuthorization(['manager', 'admin']), applications.delete);

  // Finish by binding the application middleware
  app.param('applicationId', applications.applicationByID);
  app.param('openingId', openings.openingByID);
};
users.hasAuthorization(['manager', 'admin', 'user']);
