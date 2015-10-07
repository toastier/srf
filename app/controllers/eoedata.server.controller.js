'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Eoedata = mongoose.model('Eoedata'),
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
				message = 'Eoedata already exists';
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
 * Create a EOEDataset
 */
exports.create = function(req, res) {
	var eoedata = new Eoedata(req.body);
	eoedata.user = req.user;

	eoedata.save(function(err) {
		if (err) {
			return res.send(400, {
				// this doesn't work, dumping errorHandler into its own controller
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(eoedata);
		}
	});
};



/**
 * Show the current eoedata
 */
exports.read = function(req, res) {
	res.jsonp(req.eoedata);
};

/**
 * Update a eoedata
 */
exports.update = function(req, res) {
	var eoedata = req.eoedata;

	eoedata = _.extend(eoedata, req.body);

	eoedata.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(eoedata);
		}
	});
};

/**
 * Delete an eoedata
 */
exports.delete = function(req, res) {
	var eoedata = req.eoedata;

	eoedata.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(eoedata);
		}
	});
};

/**
 * List of Eoedata
 */
exports.list = function(req, res) {
	Eoedata.find().sort('-postDate').populate('user', 'displayName').exec(function(err, eoedata) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(eoedata);
		}
	});
};

/**
 * Eoedata middleware
 */
exports.eoedataByID = function(req, res, next, id) {
	Eoedata.findById(id).populate('user', 'displayName').exec(function(err, eoedata) {
		if (err) return next(err);
		if (!eoedata) return next(new Error('Failed to load eoedata ' + id));
		req.eoedata = eoedata;
		next();
	});
};

/**
 * Eoedata authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.eoedata.user.id !== req.user.id) {
		return res.send(403, {
			message: 'User is not authorized'
		});
	}
	next();
};