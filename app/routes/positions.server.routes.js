'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	positions = require('../../app/controllers/positions');

module.exports = function(app) {
	// Position Routes
	app.route('/positions')
		.get(positions.list)
		.post(users.requiresLogin, positions.create);
	
	app.route('/positions/:positionId')
		.get(positions.read)
		.put(users.requiresLogin, positions.hasAuthorization, positions.update)
	    .delete(users.requiresLogin, positions.hasAuthorization, positions.delete);

	// Finish by binding the position middleware
	app.param('positionId', positions.positionByID);
};