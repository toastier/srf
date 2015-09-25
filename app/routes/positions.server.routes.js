'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	positions = require('../../app/controllers/positions');

module.exports = function(app) {
	// Position Routes
	app.route('/positions')
		.get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), positions.list)
		.post(users.requiresLogin, users.hasAuthorization(['manager', 'admin']), positions.create);
	app.route('/positions/:positionId')
		.get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), positions.read)
		.put(users.requiresLogin, users.hasAuthorization(['manager', 'admin']), positions.update)
		.delete(users.requiresLogin, users.hasAuthorization(['manager', 'admin']), positions.delete);

	// Finish by binding the position middleware
	app.param('positionId', positions.positionByID);
};
