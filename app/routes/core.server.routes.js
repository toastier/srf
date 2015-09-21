'use strict';

module.exports = function(app) {
	// Root routing
	var users = require('../../app/controllers/users.server.controller');
	var core = require('../../app/controllers/core.server.controller');

	app.route('/').get(core.index);
	app.route('/app-info').get(core.appInfo);

	function handle403(err, req, res, next) {
		if (err.status !== 403) return next();
		res.send('403 error');
	}

	app.use(handle403);

};
