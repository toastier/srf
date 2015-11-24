(function () {
  'use strict';
  // Setting up route
  angular.module('eeo').config(['$stateProvider',
    function ($stateProvider) {
      // Eeo state routing
      $stateProvider
        .state('main.listEeo', {
          url: '/eeo',
          'views': {
            'content@': {
              templateUrl: 'modules/eeo/views/list-eeo.client.view.html',
              controller: 'ListEeoController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            resolvedAuth: function (resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.createEeo', {
          url: '/eeo/:applicationId',
          'views': {
            'content@': {
              templateUrl: 'modules/eeo/views/create-eeo.client.view.html',
              controller: 'CreateEeoController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            resolvedAuth: function (resolvedAuth) {
              return resolvedAuth;
            }
          }
        });
      //.state('main.viewEeo', {
      //  url: '/eeo/:eeoId',
      //  templateUrl: 'modules/eeo/views/view-eeo.client.view.html',
      //  controller: 'ViewEeoController',
      //  controllerAs: 'vm',
      //  resolve: {
      //    resolvedAuth: function(resolvedAuth) {
      //      return resolvedAuth;
      //    }
      //  }
      //});
    }
  ]);
})();
