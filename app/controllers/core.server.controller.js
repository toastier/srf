'use strict';

/**
 * Module dependencies.
 */
var packageJson = require('../../package.json');
exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.appInfo = function(req, res) {
	res.jsonp({version: packageJson.version, name: packageJson.displayName});
};