'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function (app) {
  // User Routes
  var users = require('../../app/controllers/users');
  app.route('/users/me').get(users.me);
  app.route('/users/me/update').get(users.update);
  app.route('/users')
    .put(users.requiresLogin, users.hasAuthorization(['admin']), users.adminUpdate)
    .post(users.requiresLogin, users.hasAuthorization(['admin']), users.adminCreate)
    .get(users.requiresLogin, users.hasAuthorization(['admin']), users.list);
  app.route('/users/password').post(users.changePassword);
  app.route('/users/accounts').delete(users.removeOAuthProvider);
  app.route('/roles').get(users.requiresLogin, users.hasAuthorization(['admin']), users.roles);
  app.route('/users/masquerade').post(users.requiresLogin, users.hasAuthorization(['admin']), users.masquerade);

  // Setting up the users api
  app.route('/auth/signin').post(users.signin);
  app.route('/auth/signout').get(users.signout);

  // Setting the Saml routes
  app.route('/auth/saml').get(
    passport.authenticate('saml',
      {
        successRedirect: '/',
        failureRedirect: 'signin'
      }),
    function (req, res) {
      res.redirect('/');
    });

  app.route('/auth/saml/callback').post(
    passport.authenticate('saml',
      {
        failureRedirect: '/',
        failureFlash: true
      }),
    function (req, res) {
      res.redirect('/');
    });

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
