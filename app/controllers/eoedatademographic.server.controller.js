'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	EoeDataDemographic = mongoose.model('EoeDataDemographic'),
	EoeDisability = mongoose.model('EoeDisability'),
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
				message = 'EoeDataDemographic already exists';
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
 * Create a EoeDataDemographic record
 */
exports.create = function(req, res) {
	console.log('creating');
	console.log(req.body);
	var eoeDataDemographic = new EoeDataDemographic(_.omit(req.body, 'disability'));
	eoeDataDemographic.user = req.user;

	eoeDataDemographic.save(function(err) {
		if (err) {
			return res.send(400, {
				// this doesn't work, dumping errorHandler into its own controller
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(eoeDataDemographic);
		}
	});

	console.log('creating EOE disability');
	var eoeDisability = new EoeDisability(_.omit(req.body, ['ethnicity', 'gender', 'race']));
	//eoeDataDemographic.user = req.user;

	eoeDisability.save(function(err) {
		if (err) {
			return res.send(400, {
				// this doesn't work, dumping errorHandler into its own controller
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(eoeDisability);
		}
	});
};


/**
 * Create an EOE Disability record
 */





/**
 * Show the current eoeDataDemographic
 */
exports.read = function(req, res) {
	res.jsonp(req.eoeDataDemographic);
};

/**
 * Update a eoeDataDemographic
 */
exports.update = function(req, res) {
	var eoeDataDemographic = req.eoeDataDemographic;

	eoeDataDemographic = _.extend(eoeDataDemographic, req.body);

	eoeDataDemographic.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(eoeDataDemographic);
		}
	});
};

/**
 * Delete an eoeDataDemographic
 */
exports.delete = function(req, res) {
	var eoeDataDemographic = req.eoeDataDemographic;

	eoeDataDemographic.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(eoeDataDemographic);
		}
	});
};

/**
 * List of EoeDataDemographic
 */
exports.list = function(req, res) {
	EoeDataDemographic.find()
	.sort('-postDate')
	.populate('opening')
	.exec(function(err, eoeDataDemographic) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(eoeDataDemographic);
		}
	});
};

/**
 * EoeDataDemographic middleware
 */
exports.eoeDataDemographicByID = function(req, res, next, id) {
	EoeDataDemographic.findById(id).populate('user', 'displayName').exec(function(err, eoeDataDemographic) {
		if (err) return next(err);
		if (!eoeDataDemographic) return next(new Error('Failed to load eoeDataDemographic ' + id));
		req.eoeDataDemographic = eoeDataDemographic;
		next();
	});
};

/**
 * EoeDataDemographic authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.eoeDataDemographic.user.id !== req.user.id) {
		return res.send(403, {
			message: 'User is not authorized'
		});
	}
	next();
};