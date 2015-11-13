'use strict';

module.exports = function (app) {
  // Root routing
  var users = require('../../app/controllers/users.server.controller');
  var core = require('../../app/controllers/core.server.controller');

  app.route('/').get(core.index);
  app.route('/app-info').get(core.appInfo);
};
