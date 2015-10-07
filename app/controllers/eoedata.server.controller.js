'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	EoeDataDemographics = mongoose.model('EoeDataDemographics'),
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
				message = 'EoeDataDemographics already exists';
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
 * Create a EoeDataDemographicsset
 */
exports.create = function(req, res) {
	var eoeDataDemographics = new EoeDataDemographics(req.body);
	eoeDataDemographics.user = req.user;

	eoeDataDemographics.save(function(err) {
		if (err) {
			return res.send(400, {
				// this doesn't work, dumping errorHandler into its own controller
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(eoeDataDemographics);
		}
	});
};



/**
 * Show the current eoeDataDemographics
 */
exports.read = function(req, res) {
	res.jsonp(req.eoeDataDemographics);
};

/**
 * Update a eoeDataDemographics
 */
exports.update = function(req, res) {
	var eoeDataDemographics = req.eoeDataDemographics;

	eoeDataDemographics = _.extend(eoeDataDemographics, req.body);

	eoeDataDemographics.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(eoeDataDemographics);
		}
	});
};

/**
 * Delete an eoeDataDemographics
 */
exports.delete = function(req, res) {
	var eoeDataDemographics = req.eoeDataDemographics;

	eoeDataDemographics.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(eoeDataDemographics);
		}
	});
};

/**
 * List of EoeDataDemographics
 */
exports.list = function(req, res) {
	EoeDataDemographics.find().sort('-postDate').populate('user', 'displayName').exec(function(err, eoeDataDemographics) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(eoeDataDemographics);
		}
	});
};

/**
 * EoeDataDemographics middleware
 */
exports.eoeDataDemographicsByID = function(req, res, next, id) {
	EoeDataDemographics.findById(id).populate('user', 'displayName').exec(function(err, eoeDataDemographics) {
		if (err) return next(err);
		if (!eoeDataDemographics) return next(new Error('Failed to load eoeDataDemographics ' + id));
		req.eoeDataDemographics = eoeDataDemographics;
		next();
	});
};

/**
 * EoeDataDemographics authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.eoeDataDemographics.user.id !== req.user.id) {
		return res.send(403, {
			message: 'User is not authorized'
		});
	}
	next();
};