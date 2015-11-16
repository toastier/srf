(function () {
  'use strict';
  angular.module('worksheetFields').config(['$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('main.worksheetFields', {
          url: '/worksheetFields',
          'views': {
            'content@': {
              templateUrl: 'modules/worksheet-fields/views/worksheet-fields.client.view.html',
              controller: 'WorksheetFieldsController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        });
    }]);
})();