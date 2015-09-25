'use strict';

var users = require('../../app/controllers/users'),
  openings = require('../../app/controllers/openings');

module.exports = function(app) {
  // Position Routes
  app.route('/openings')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), openings.list)
    .post(users.requiresLogin, users.hasAuthorization(['manager', 'admin']), openings.create);
  app.route('/openings/:openingId')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), openings.read)
    .put(users.requiresLogin, users.hasAuthorization(['manager', 'admin']), openings.update)
    .delete(users.requiresLogin, users.hasAuthorization(['manager', 'admin']), openings.delete);

  // Finish by binding the opening middleware
  app.param('openingId', openings.openingByID);
};
