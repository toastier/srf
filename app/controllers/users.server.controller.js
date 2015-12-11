'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User'),
  _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var config = require('../../config/env/all');
var developerSettings = require('../../config/env/developer-settings');

/**
 * define userRoles
 */
var userRoles = ['user', 'admin', 'manager', 'committee member'];

/**
 * Get the error message from error object
 */
var getErrorMessage = function (err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'Username already exists';
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
 * Signup
 */
exports.signup = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init Variables
  var user = new User(req.body);
  var message = null;

  // Add missing user fields
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;

  // Then save the user
  user.save(function (err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          res.send(400, err);
        } else {
          res.jsonp(user);
        }
      });
    }
  });
};

/**
 * Privileged function allowing Admin Users to create Users
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 */
exports.adminCreate = function (req, res) {
  // Init Variables
  var user = new User(req.body);

  // Add missing user fields
  user.provider = 'shib';
  user.displayName = user.firstName + ' ' + user.lastName;

  // Then save the user
  user.save(function (err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(user);
    }
  });
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.send(400, info);
    } else {

      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          next(err);
        } else {
          var sanitizedUser = new SanitizedUser(user);
          res.jsonp(sanitizedUser);
        }
      });
    }
  })(req, res, next);
};

/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  var user = req.user;
  var message = null;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function (err) {
      if (err) {
        return res.send(400, {
          message: getErrorMessage(err)
        });
      } else {
        req.login(user, function (err) {
          if (err) {
            res.send(400, err);
          } else {
            res.jsonp(user);
          }
        });
      }
    });
  } else {
    res.send(400, {
      message: 'User is not signed in'
    });
  }
};

/**
 * Change Password
 */
exports.changePassword = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;
  var message = null;

  if (req.user) {
    User.findById(req.user.id, function (err, user) {
      if (!err && user) {
        if (user.authenticate(passwordDetails.currentPassword)) {
          if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
            user.password = passwordDetails.newPassword;

            user.save(function (err) {
              if (err) {
                return res.send(400, {
                  message: getErrorMessage(err)
                });
              } else {
                req.login(user, function (err) {
                  if (err) {
                    res.send(400, err);
                  } else {
                    res.send({
                      message: 'Password changed successfully'
                    });
                  }
                });
              }
            });
          } else {
            res.send(400, {
              message: 'Passwords do not match'
            });
          }
        } else {
          res.send(400, {
            message: 'Current password is incorrect'
          });
        }
      } else {
        res.send(400, {
          message: 'User is not found'
        });
      }
    });
  } else {
    res.send(400, {
      message: 'User is not signed in'
    });
  }
};

/**
 * Signout
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.jsonp(req.user || null);
};

/**
 * Json User
 */
exports.jsonMe = function (req, res) {
  res.jsonp(req.user || {id: false});
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {
    passport.authenticate(strategy, function (err, user, redirectURL) {
      if (err || !user) {
        return res.redirect('/#!/signin');
      }
      req.login(user, function (err) {
        if (err) {
          return res.redirect('/#!/signin');
        }

        return res.redirect(redirectURL || '/');
      });
    })(req, res, next);
  };
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  User.findOne({
    _id: id
  }).exec(function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error('Failed to load User ' + id));
    }
    req.profile = user;
    next();
  });
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    var err = new Error('Login is Required');
    err.status = 401;
    return next(err);
  }
  return next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function (roles) {
  var _this = this;

  return function (req, res, next) {
    _this.requiresLogin(req, res, function () {
      if (_.intersection(req.user.roles, roles).length) {
        return next();
      } else {
        var err = new Error('User is not Authorized');
        err.status = 403;
        return next(err);
      }
    });
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    User.findOne(searchQuery, function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

          User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            user = new User({
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              email: providerUserProfile.email,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            });

            // And save the user
            user.save(function (err) {
              return done(err, user);
            });
          });
        } else {
          return done(err, user);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    User.findById(req.user.id, function (err, user) {
      if (err) {
        return done(err);
      } else {
        // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
        if (user && user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
          // Add the provider data to the additional provider data field
          if (!user.additionalProvidersData) {
            user.additionalProvidersData = {};
          }
          user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

          // Then tell mongoose that we've updated the additionalProvidersData field
          user.markModified('additionalProvidersData');

          // And save the user
          user.save(function (err) {
            return done(err, user, '/#!/settings/accounts');
          });
        } else {
          return done(err, user);
        }
      }
    });
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.param('provider');

  if (user && provider) {
    // Delete the additional provider
    if (user.additionalProvidersData[provider]) {
      delete user.additionalProvidersData[provider];

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');
    }

    user.save(function (err) {
      if (err) {
        return res.send(400, {
          message: getErrorMessage(err)
        });
      } else {
        req.login(user, function (err) {
          if (err) {
            res.send(400, err);
          } else {
            res.jsonp(user);
          }
        });
      }
    });
  }
};

/**
 * List of Users
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 */
exports.list = function (req, res) {
  User.find().sort('lastName').exec(function (err, users) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(users);
    }
  });
};

exports.committeeMembersOptionList = function (req, res) {
  User.find({roles: 'committee member'})
    .sort('lastName')
    .select('displayName lastName _id')
    .exec(function(err, committeeMembers) {
      if (err) {
        res.send(400,
          {
            message: 'An error occurred while retrieving the committee members from the server'
          });
      } else {
        res.jsonp(committeeMembers);
      }
    });
};

/**
 * Modify User details - privileged method for Admin(s) (authorization in router)
 */
exports.adminUpdate = function (req, res) {
  // Init Variables
  User.findById(req.body._id, function (err, user) {
    if (err) {
      return err;
    } else {
      if (user) {
        // Merge existing user
        user = _.extend(user, req.body);
        user.updated = Date.now();
        user.displayName = user.firstName + ' ' + user.lastName;

        user.save(function (err) {
          if (err) {
            return res.send(400, {
              message: getErrorMessage(err)
            });
          } else {
            res.jsonp(user);
          }
        });
      } else {
        res.send(400, {
          message: 'User not found'
        });
      }
    }
  });
};

exports.emailAddressIsUnique = function (req, res, next) {
  var result = {unique: false, local: false};
  User.findOne({email: req.body.email})
    .exec(function(err, user) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      if (user && user._id) {
        if (user.provider === 'local') {
          result.local = true;
        }
        return res.jsonp(result);
      }
      result.local = true;
      result.unique = true;
      return res.jsonp(result);
    });
};

/**
 * Masquerade as another user
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 */
exports.masquerade = function(req, res) {
  // Init Variables
  User.findById(req.body._id, function (err, user) {
    if (err) {
      return err;
    } else {
      if (user) {
        req.login(user, function (err) {
          if (err) {
            res.send(400, err);
          } else {
            res.jsonp(user);
          }
        });
      } else {
        res.send(400, {
          message: 'User not found'
        });
      }
    }
  });
};

exports.roles = function (req, res) {
  res.jsonp(userRoles);
};

/**
 * Method for User(s) created under the 'local' strategy to get a token sent to their email so that they can reset their password.
 * @todo check that the user was created under the 'local' strategy.  this method should not be available to users created under shibboleth as that would be a vulnerability.
 *
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 * @param {Function} next
 * @returns {*}
 */
exports.forgotPassword = function (req, res, next) {
  var err;

  if (!req.body.user.email) {
    err = new Error('Email not Provided');
    err.status = 400;
    return next(err);
  }

  async.waterfall([

    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },

    function(token, done) {
      User.findOne({email: req.body.user.email})
        .exec(function(err, user) {
          if (err) {
            return next(err);
          }

          if (user.provider !== 'local') {
            var error = new Error('Duke NetId accounts cannot have their passwords reset through this application');
            return next(error);
          }

          user.resetPasswordToken = token;
          user.resetPasswordState = req.body.resetPasswordState;
          user.resetPasswordStateParams = req.body.resetPasswordStateParams;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function(err) {
            done(err, token, user);
          });
        });
    },
    function(token, user, done) {

      var emailTo = (process.env.NODE_ENV === 'production') ? user.email : developerSettings.developerEmail;

      var smtpTransport = nodemailer.createTransport(config.sendGridSettings);

      var mailOptions = {
        to: emailTo,
        from: 'noreply@frs.nursing.duke.edu',
        subject: 'DUSON FRS Password Reset',
        text: 'You are receiving this message because we received a request to reset the password associate with your email address.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/#!/resetPassword/' + token + '\n\n' +
        'If you did not request that your password be reset, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        done(err, 'done');
      });

      done(err, user, token);
    }
  ], function(err, user, token) {
    if (err) {
      return next(err);
    }
    var responseObject = {email: user.email};
    res.jsonp(responseObject);
  });

};

/**
 * Validate email reset token
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 * @param {Function} next
 */
exports.validateToken = function (req, res, next) {
  var error;
  User.findOne({resetPasswordToken: req.params.token})
    .where('resetPasswordExpires').gte(Date.now())
    .exec(function(err, result) {
      if (err) {
        return next(err);
      }
      if (!result) {
        error = new Error('The token is not valid');
        error.status = 400;
        return next(err);
      }
      res.jsonp({'tokenStatus': 'valid'});
    });
};

/**
 * Performs password reset using email link with token
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 * @param {Function} next
 */
exports.resetPassword = function (req, res, next) {
  var error;
  var password = req.body.password;
  User.findOne({resetPasswordToken: req.params.token})
    .where('resetPasswordExpires').gte(Date.now())
    .exec(function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        error = new Error('The token is not valid');
        error.status = 400;
        return next(err);
      }
      var state = (user.resetPasswordState) ? _.clone(user.resetPasswordState) : null;
      var stateParams = (user.resetPasswordStateParams) ? _.clone(user.resetPasswordStateParams) : null;
      user.password = password;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      user.resetPasswordState = null;
      user.resetPasswordStateParams = null;
      user.save(function(err, result) {
        if (err) {
          err.status = 400;
          return next(err);
        }
        if (!result) {
          error = new Error('There was a problem saving the new password');
          return next(err);
        }
        if (user.authenticate(password)) {
          req.login(user, function (err) {
            if (err) {
              err.status = 400;
              next(err);
            } else {
              res.jsonp({
                'resetStatus': 'valid',
                'state': state,
                'stateParams': stateParams,
                'user': new SanitizedUser(user)
              });
            }
          });
        }
      });
    });
};

exports.getInfo = function (req, res) {
  //User.findOne({
  //  _id: id
  //}).exec(function (err, user) {
  //  if (err) return (err);
  //  if (!user) return (new Error('Failed to load User ' + id));
  //  req.profile = user;
  //  next();
  //});
  var safeProfile = {
    _id: req.profile._id,
    displayName: req.profile.displayName,
    firstName: req.profile.firstName,
    lastName: req.profile.lastName
  };
  res.jsonp(safeProfile);
};

function SanitizedUser (user) {

  this._id = user._id;
  this.honorific = user.honorific;
  this.firstName = user.firstName;
  this.middleName = user.middleName;
  this.lastName = user.lastName;
  this.displayName = user.displayName;
  this.roles = user.roles;
  this.resetPasswordState = user.resetPasswordState || null;
  this.resetPasswordStateParams = user.resetPasswordStateParams || null;

}

