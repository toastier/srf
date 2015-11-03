'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	EoeDemographic = mongoose.model('EoeDemographic'),
	EoeDisability = mongoose.model('EoeDisability'),
	EoeVeteran = mongoose.model('EoeVeteran'),
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
 * Create EOE records
 */
// TODO use better method to parse out req.body
exports.create = function(req, res) {
	console.log('creating EOE record...');
	req.body.opening = req.application.opening._id;
	var eoeDemographic = new EoeDemographic(_.omit(req.body, ['disability', 'veteran', 'vetClass', 'vetDecline']));
	var eoeDisability = new EoeDisability(_.omit(req.body, ['ethnicity', 'gender', 'race', 'veteran', 'vetClass', 'vetDecline']));
	var eoeVeteran = new EoeVeteran(_.omit(req.body, ['ethnicity', 'gender', 'race', 'disability']));
	// TODO refactor this...it works but it's sloppy
	eoeDemographic.save(function (err) {
		if (err) {
			return res.send(400, {
				// this doesn't work, dumping errorHandler into its own controller
				message: getErrorMessage(err)
			});
		} else {
			eoeDisability.save(function (err) {
				if (err) {
					return res.send(400, {
						// this doesn't work, dumping errorHandler into its own controller
						message: getErrorMessage(err)
					});
				} else {
					eoeVeteran.save(function (err) {
						if (err) {
							return res.send(400, {
								// this doesn't work, dumping errorHandler into its own controller
								message: getErrorMessage(err)
							});
						} else {
							var application = req.application;
							application = _.extend(application, req.application.body);
							application.eoeProvided = true;
							application.save(function (err) {
								if (err) {
									return res.send(400, {
										message: getErrorMessage(err)
									});
								} else {
									res.jsonp((_.merge(eoeDemographic, [eoeDisability, eoeVeteran])));
								}
							});
						}
					});
				}
			});
		}
	});
};


/**
 * List of Eoe
 */
exports.list = function(req, res) {
	EoeDemographic.find()
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