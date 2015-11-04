'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	applicants = require('../../app/controllers/applicants.server.controller');

module.exports = function(app) {
	// Applicant Routes
	app.route('/applicants')
		.get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applicants.list)
		.post(users.requiresLogin, users.hasAuthorization(['manager', 'admin']), applicants.create);
	app.route('/applicants/:applicantId')
		.get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), applicants.read)
		.put(users.requiresLogin, users.hasAuthorization(['manager', 'admin']), applicants.update)
		.delete(users.requiresLogin, users.hasAuthorization(['manager', 'admin']), applicants.delete);

	// Finish by binding the applicant middleware
	app.param('applicantId', applicants.applicantByID);
};