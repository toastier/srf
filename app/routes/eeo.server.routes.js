'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	eeo = require('../../app/controllers/eeo'),
	applications = require('../../app/controllers/applications');

module.exports = function(app) {
	// EEO Routes
	app.route('/eeo')
		.get(users.hasAuthorization(['manager', 'admin', 'committee member']), eeo.list)
		.post(users.hasAuthorization(['user']), eeo.create);
	app.route('/eeo/create/:applicationId')
		.post(users.hasAuthorization(['user']), eeo.create);
	// Finish by binding the application middleware
	app.param('applicationId', applications.applicationByID);
};

