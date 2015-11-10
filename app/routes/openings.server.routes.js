'use strict';

var users = require('../../app/controllers/users.server.controller'),
  openings = require('../../app/controllers/openings.server.controller');

module.exports = function(app) {
  // Position Routes
  app.route('/openings')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), openings.list)
    .post(users.requiresLogin, users.hasAuthorization(['manager', 'admin']), openings.create);
  app.route('/openings/current')
    .get(openings.current);
  app.route('/openings/current/:openingId')
    .get(openings.readCurrent);
  app.route('/openings/forPosition/:position')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin']), openings.current);
  app.route('/openings/:openingId')
    .get(users.requiresLogin, users.hasAuthorization(['manager', 'admin', 'committee member']), openings.read)
    .put(users.requiresLogin, users.hasAuthorization(['manager', 'admin']), openings.update)
    .delete(users.requiresLogin, users.hasAuthorization(['manager', 'admin']), openings.delete);

  // Finish by binding the opening middleware
  app.param('openingId', openings.openingByID);
};
