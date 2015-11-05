(function () {
  'use strict';
  angular.module('dashboards').config(['$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('main.dashboards', {
          url: '/dashboards',
          'views': {
            'content@': {
              templateUrl: 'modules/dashboards/views/dashboards.client.view.html',
              controller: 'DashboardsController',
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
