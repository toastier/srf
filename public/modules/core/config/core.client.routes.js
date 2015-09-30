(function () {
  'use strict';
  // Setting up route
  angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      // Redirect to home view when route not found
      $urlRouterProvider.otherwise('/');

      $stateProvider
        // resolves Authentication and provides to all nested states as resolvedAuth
        .state('main', {
          url: '',
          abstract: true,
          template: '<ui-view/>',
          resolve: {
            resolvedAuth: function(Authentication) {
              return Authentication.promise;
            }
          }
        })
        // Home state routing
        .state('main.home', {
          url: '/',
          controller: 'HomeController',
          controllerAs: 'vm',
          templateUrl: 'modules/core/views/home.client.view.html',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        });
    }
  ]);
})();
