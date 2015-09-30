(function () {
  'use strict';
  // Setting up route
  angular.module('positions').config(['$stateProvider',
    function ($stateProvider) {
      // Positions state routing
      $stateProvider
        .state('main.listPositions', {
          url: '/positions',
          templateUrl: 'modules/positions/views/positions.client.view.html',
          controller: 'PositionsController',
          controllerAs: 'vm',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.createPosition', {
          url: '/positions/create',
          templateUrl: 'modules/positions/views/create-position.client.view.html',
          controller: 'CreatePositionController',
          controllerAs: 'vm',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.viewPosition', {
          url: '/positions/:positionId',
          templateUrl: 'modules/positions/views/view-position.client.view.html',
          controller: 'ViewPositionController',
          controllerAs: 'vm',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.editPosition', {
          url: '/positions/:positionId/edit',
          templateUrl: 'modules/positions/views/edit-position.client.view.html',
          controller: 'EditPositionController',
          controllerAs: 'vm',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        });
    }
  ]);
})();
