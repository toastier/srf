'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Applicant = mongoose.model('Applicant'),
	errorHandler = 	require('./errors.server.controller'),
	_ = require('lodash');

/**
 * Create a applicant
 */
exports.create = function(req, res) {
	var applicant = new Applicant(req.body);
	applicant.user = req.user;

	applicant.save(function(err) {
		if (err) {
			return res.send(400, {
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(applicant);
		}
	});
};

/**
 * Show the current applicant
 */
exports.read = function(req, res) {
	res.jsonp(req.applicant);
};

/**
 * Update a applicant
 */
exports.update = function(req, res) {
	var applicant = req.applicant;

	applicant = _.extend(applicant, req.body);

	applicant.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(applicant);
		}
	});
};

/**
 * Delete an applicant
 */
exports.delete = function(req, res) {
	var applicant = req.applicant;

	applicant.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(applicant);
		}
	});
};

/**
 * List of Applicants
 */
exports.list = function(req, res) {
	Applicant.find().sort('-postDate').populate('user', 'displayName').exec(function(err, applicants) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(applicants);
		}
	});
};

/**
 * Applicant middleware
 */
exports.applicantByID = function(req, res, next, id) {
	Applicant.findById(id).populate('user', 'displayName').exec(function(err, applicant) {
		if (err) return next(err);
		if (!applicant) return next(new Error('Failed to load applicant ' + id));
		req.applicant = applicant;
		next();
	});
};

/**
 * Applicant authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.applicant.user.id !== req.user.id) {
		return res.send(403, {
			message: 'User is not authorized'
		});
	}
	next();
};