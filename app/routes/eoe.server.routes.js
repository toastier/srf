'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	eoe = require('../../app/controllers/eoe'),
	applications = require('../../app/controllers/applications');

module.exports = function(app) {
	// EOE Routes
	app.route('/eoe')
		.get(users.hasAuthorization(['manager', 'admin', 'committee member']), eoe.list)
		.post(users.hasAuthorization(['user']), eoe.create);
	app.route('/eoe/create/:applicationId')
		//.get(users.hasAuthorization(['manager', 'admin', 'committee member']), eoe.list)
		.post(users.hasAuthorization(['user']), eoe.create);
	// Finish by binding the application middleware
	app.param('applicationId', applications.applicationByID);
};

