'use strict';

module.exports = function (app) {
  // Root routing
  var users = require('../../app/controllers/users.server.controller');
  var core = require('../../app/controllers/core.server.controller');

  app.route('/').get(core.index);
  app.route('/app-info').get(core.appInfo);

  app.use(logErrors);
  app.use(clientErrorHandler);

  function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
  }

  function clientErrorHandler(err, req, res, next) {
    var message = err.message || 'Internal Server Error';
    var status = err.status || 500;
    res.send(status, {
      message: message
    });
  }
};
