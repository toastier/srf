(function () {
  'use strict';
  // Setting up route
  angular.module('openings').config(['$stateProvider',
    function ($stateProvider) {
      // Openings state routing
      $stateProvider
        .state('main.listOpenings', {
          url: '/openings',
          'views': {
            'content@': {
              templateUrl: 'modules/openings/views/openings.client.view.html',
              controller: 'OpeningsController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.listCurrentOpenings', {
          url: '/openings/list',
          'views': {
            'content@': {
              templateUrl: 'modules/openings/views/openings.client.view.html',
              controller: 'OpeningsController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.createOpening', {
          url: '/openings/create',
          'views': {
            'content@': {
              templateUrl: 'modules/openings/views/create-opening.client.view.html',
              controller: 'CreateOpeningController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.viewOpening', {
          url: '/openings/:openingId',
          'views': {
            'content@': {
              templateUrl: 'modules/openings/views/view-opening.client.view.html',
              controller: 'ViewOpeningController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.editOpening', {
          url: '/openings/:openingId/edit',
          'views': {
            'content@': {
              templateUrl: 'modules/openings/views/edit-opening.client.view.html',
              controller: 'EditOpeningController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        });
    }
  ]);
})();
