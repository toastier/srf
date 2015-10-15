'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	EoeDemographic = mongoose.model('EoeDemographic'),
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
				message = 'Eoe already exists';
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
 * Create a EOE Demographic record
 */
exports.create = function(req, res) {
	console.log('creating EOE demographic record');
	console.log(req.body);
	var eoeDemographic = new EoeDemographic(_.omit(req.body, 'disability'));
	eoeDemographic.user = req.user;

	eoeDemographic.save(function(err) {
		if (err) {
			return res.send(400, {
				// this doesn't work, dumping errorHandler into its own controller
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(eoeDemographic);
		}
	});

	/**
	 * Create an EOE Disability record
	 */

	console.log('creating EOE disability');
	var eoeDisability = new EoeDisability(_.omit(req.body, ['ethnicity', 'gender', 'race']));

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
 * Show the current eoe
 */
exports.read = function(req, res) {
	res.jsonp(req.eoe);
};

/**
 * Update a eoe
 */
exports.update = function(req, res) {
	var eoe = req.eoe;

	eoe = _.extend(eoe, req.body);

	eoe.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(eoe);
		}
	});
};

/**
 * Delete an eoe
 */
exports.delete = function(req, res) {
	var eoe = req.eoe;

	eoe.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(eoe);
		}
	});
};

/**
 * List of Eoe
 */
exports.list = function(req, res) {
	Eoe.find()
	.sort('-postDate')
	.populate('opening')
	.exec(function(err, eoe) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(eoe);
		}
	});
};

/**
 * Eoe middleware
 */
exports.eoeByID = function(req, res, next, id) {
	Eoe.findById(id).populate('user', 'displayName').exec(function(err, eoe) {
		if (err) return next(err);
		if (!eoe) return next(new Error('Failed to load eoe ' + id));
		req.eoe = eoe;
		next();
	});
};

/**
 * Eoe authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.eoe.user.id !== req.user.id) {
		return res.send(403, {
			message: 'User is not authorized'
		});
	}
	next();
};