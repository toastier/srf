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
	console.log('creating EEO record...');
	req.body.opening = req.application.opening._id;
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
	getPosition().then(function (position) {
		req.body.position = position;
		var eeoDemographic = new EeoDemographic(_.omit(req.body, ['disability', 'veteran', 'vetClass', 'vetDecline']));
		var eeoDisability = new EeoDisability(_.omit(req.body, ['ethnicity', 'race', 'veteran', 'vetClass', 'vetDecline']));
		var eeoVeteran = new EeoVeteran(_.omit(req.body, ['ethnicity', 'race', 'disability']));
		// TODO refactor this...it works but it's sloppy
		eeoDemographic.save(function (err) {
			if (err) {
				return res.send(400, {
					// this doesn't work, dumping errorHandler into its own controller
					message: getErrorMessage(err)
				});
			} else {
				eeoDisability.save(function (err) {
					if (err) {
						return res.send(400, {
							// this doesn't work, dumping errorHandler into its own controller
							message: getErrorMessage(err)
						});
					} else {
						eeoVeteran.save(function (err) {
							if (err) {
								return res.send(400, {
									// this doesn't work, dumping errorHandler into its own controller
									message: getErrorMessage(err)
								});
							} else {
								var application = req.application;
								application = _.extend(application, req.application.body);
								application.eeoProvided = true;
								application.save(function (err) {
									if (err) {
										return res.send(400, {
											message: getErrorMessage(err)
										});
									} else {
										res.jsonp((_.merge(eeoDemographic, [eeoDisability, eeoVeteran])));
									}
								});
							}
						});
					}
				});
			}
		});
	})
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

	EeoDemographic.find()
	.sort('-postDate')
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
			EeoDisability.find()
				.sort('-postDate')
				.populate('opening')
				.exec(function(err, eeoDisability) {
					if (err) {
						return res.send(400, {
							message: getErrorMessage(err)
						});
					} else {
						eeoDataSetAdd(eeoDisability, "disability");
						EeoVeteran.find()
							.sort('-postDate')
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
