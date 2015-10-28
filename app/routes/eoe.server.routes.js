'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	eoe = require('../../app/controllers/eoe');

module.exports = function(app) {
	// EOE Routes
	app.route('/eoe')
		.get(users.hasAuthorization(['manager', 'admin', 'committee member']), eoe.list)
		.post(users.hasAuthorization(['user']), eoe.create);
};