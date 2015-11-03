'use strict';

var users = require('../../app/controllers/users.server.controller');
var worksheetFields = require('../../app/controllers/worksheet-fields.server.controller');

module.exports = function(app) {

  app.route('/worksheetFields')
    .get(users.hasAuthorization(['admin', 'manager']), worksheetFields.list)
    .post(users.hasAuthorization(['admin', 'manager']), worksheetFields.create);

  app.route('/worksheetFields/byType/:type')
    .get(users.hasAuthorization(['admin', 'manager']), worksheetFields.byType);

  app.route('/worksheetFields/:worksheetFieldId')
    .put(users.hasAuthorization(['admin', 'manager']), worksheetFields.update)
    .delete(users.hasAuthorization(['admin', 'manager']), worksheetFields.delete);


  app.param('worksheetFieldId', worksheetFields.worksheetFieldById);
};