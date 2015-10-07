'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	EoeDatademographic = mongoose.model('EoeDatademographic'),
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
				message = 'EoeDatademographic already exists';
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
 * Create a EoeDatademographicset
 */
exports.create = function(req, res) {
	var eoeDatademographic = new EoeDatademographic(req.body);
	eoeDatademographic.user = req.user;

	eoeDatademographic.save(function(err) {
		if (err) {
			return res.send(400, {
				// this doesn't work, dumping errorHandler into its own controller
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(eoeDatademographic);
		}
	});
};



/**
 * Show the current eoeDatademographic
 */
exports.read = function(req, res) {
	res.jsonp(req.eoeDatademographic);
};

/**
 * Update a eoeDatademographic
 */
exports.update = function(req, res) {
	var eoeDatademographic = req.eoeDatademographic;

	eoeDatademographic = _.extend(eoeDatademographic, req.body);

	eoeDatademographic.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(eoeDatademographic);
		}
	});
};

/**
 * Delete an eoeDatademographic
 */
exports.delete = function(req, res) {
	var eoeDatademographic = req.eoeDatademographic;

	eoeDatademographic.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(eoeDatademographic);
		}
	});
};

/**
 * List of EoeDatademographic
 */
exports.list = function(req, res) {
	EoeDatademographic.find().sort('-postDate').populate('user', 'displayName').exec(function(err, eoeDatademographic) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(eoeDatademographic);
		}
	});
};

/**
 * EoeDatademographic middleware
 */
exports.eoeDatademographicByID = function(req, res, next, id) {
	EoeDatademographic.findById(id).populate('user', 'displayName').exec(function(err, eoeDatademographic) {
		if (err) return next(err);
		if (!eoeDatademographic) return next(new Error('Failed to load eoeDatademographic ' + id));
		req.eoeDatademographic = eoeDatademographic;
		next();
	});
};

/**
 * EoeDatademographic authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.eoeDatademographic.user.id !== req.user.id) {
		return res.send(403, {
			message: 'User is not authorized'
		});
	}
	next();
};