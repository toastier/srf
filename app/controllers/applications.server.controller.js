'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Application = mongoose.model('Application'),
	errorHandler = 	require('./errors.server.controller'), //this doesn't work
	_ = require('lodash');


/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Application already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a application
 */
exports.create = function(req, res) {
	var application = new Application(req.body);
	application.user = req.user;

	application.save(function(err) {
		if (err) {
			return res.send(400, {
				// this doesn't work, dumping errorHandler into its own controller
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(application);
		}
	});
};



/**
 * Show the current application
 */
exports.read = function(req, res) {
	res.jsonp(req.application);
};

/**
 * Update a application
 */
exports.update = function(req, res) {
	var application = req.application;

	application = _.extend(application, req.body);

	application.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(application);
		}
	});
};

/**
 * Delete an application
 */
exports.delete = function(req, res) {
	var application = req.application;

	application.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(application);
		}
	});
};

/**
 * List of Applications
 */
exports.list = function(req, res) {
	Application.find()
		.sort('-postDate')
		.populate('applicant')
		.populate('opening')
		.exec(function(err, applications) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(applications);
		}
	});
};

/**
 * Application middleware
 */
exports.applicationByID = function(req, res, next, id) {
	Application.findById(id).populate('user', 'displayName').exec(function(err, application) {
		if (err) return next(err);
		if (!application) return next(new Error('Failed to load application ' + id));
		req.application = application;
		next();
	});
};

/**
 * Application authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.application.user.id !== req.user.id) {
		return res.send(403, {
			message: 'User is not authorized'
		});
	}
	next();
};