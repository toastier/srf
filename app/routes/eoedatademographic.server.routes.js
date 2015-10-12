'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	eoeDataDemographic = require('../../app/controllers/eoedatademographic');

module.exports = function(app) {
	// EOE Demographic Routes
	app.route('/eoeDataDemographic')
		.get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), eoeDataDemographic.list)
		.post(users.requiresLogin, users.hasAuthorization(['manager', 'admin']), eoeDataDemographic.create);
};