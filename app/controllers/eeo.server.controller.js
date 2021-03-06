'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  EeoDemographic = mongoose.model('EeoDemographic'),
  EeoDisability = mongoose.model('EeoDisability'),
  EeoVeteran = mongoose.model('EeoVeteran'),
  _ = require('lodash'),
  Opening = mongoose.model('Opening'),
  Q = require('q'),
  _ = require('lodash')

/**
 * Get the error message from error object
 */
var getErrorMessage = function (err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'Eeo already exists';
        break;
      default:
        message = 'Something went wrong';
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message) {
        message = err.errors[errName].message;
      }
    }
  }

  return message;
};

/**
 * Create EEO records
 */
// TODO use better method to parse out req.body
exports.create = function(req, res) {

	var eeoData = {};

	var getPosition = function() {
		var deferred = Q.defer();
		Opening.findById(req.application.opening._id,
				function (err, opening) {
					if (err) {
						deferred.reject(new Error(error));
					}
					else {
						deferred.resolve(opening.position);
					}
				});
		return deferred.promise;
	}
	var createEeoDemographic = function() {
		var deferred = Q.defer();
		var eeoDemographic = new EeoDemographic(_.omit(req.body, ['disability', 'veteran', 'vetClass', 'vetDecline']));
		eeoDemographic.save(function (err) {
			if (err) {
				deferred.reject(new Error(err));
			}
			else {
				deferred.resolve(this);
			}
		});
		return deferred.promise;
	}
	var createEeoVeteran = function() {
		var deferred = Q.defer();
		if (req.body.veteran) {
			var eeoVeteran = new EeoVeteran(_.omit(req.body, ['ethnicity', 'race', 'disability']));
			eeoVeteran.save(function (err) {
				if (err) {
					deferred.reject(new Error(err));
				}
				else {
					deferred.resolve(this);
				}
			});
		}
		else {
			deferred.resolve(this);
		}
		return deferred.promise;
	}
	var createEeoDisability = function() {
		var deferred = Q.defer();
		if (req.body.disability) {
			var eeoDisability = new EeoDisability(_.omit(req.body, ['ethnicity', 'race', 'veteran', 'vetClass', 'vetDecline']));
			eeoDisability.save(function (err) {
				if (err) {
					deferred.reject(new Error(err));
				}
				else {
					deferred.resolve(this);
				}
			});
		}
		else {
			deferred.resolve(this);
		}
		return deferred.promise;
	}

	console.log('creating EEO record...');
	req.body.opening = req.application.opening._id;
	getPosition().then(function (position) {
		req.body.position = position;
	}).then(function() {
		createEeoDemographic().then(function (data) {
			_.merge(eeoData, data);
			createEeoDisability().then(function (data) {
				_.merge(eeoData, data);
				createEeoVeteran().then(function (data) {
					_.merge(eeoData, data);
					res.jsonp(eeoData);
				})
			})
		})
	});
};

/**
 * List of Eeo
 */
exports.list = function (req, res) {
  var eeoDataSet = [
    {type: 'demographic', data: {}},
    {type: 'disability', data: {}},
    {type: 'veteran', data: {}}, 1
  ];

  var eeoDataSetAdd = function (subData, type) {
    var i = _.findIndex(eeoDataSet, function (subset) {
      return subset.type === type;
    });
    eeoDataSet[i].data = subData;
  };

	EeoDemographic
	.find()
	.populate({
		path: 'opening',
		populate: {
			path: 'position'
		}
	})
	.exec(function(err, eeoDemographic) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			eeoDataSetAdd(eeoDemographic, "demographic");
			EeoDisability
				.find()
				.populate('opening')
				.exec(function(err, eeoDisability) {
					if (err) {
						return res.send(400, {
							message: getErrorMessage(err)
						});
					} else {
						eeoDataSetAdd(eeoDisability, "disability");
						EeoVeteran.find()
							.populate('opening')
							.exec(function(err, eeoVeteran) {
								if (err) {
									return res.send(400, {
										message: getErrorMessage(err)
									});
								} else {
									eeoDataSetAdd(eeoVeteran, "veteran");
									res.jsonp(eeoDataSet);
								}
						})
					}
				})
			}
		});
};

/**
 * Eeo authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
  if (req.eeo.user.id !== req.user.id) {
    return res.send(403, {
      message: 'User is not authorized'
    });
  }
  next();
};
