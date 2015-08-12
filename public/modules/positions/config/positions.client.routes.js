'use strict';

// Setting up route
angular.module('positions').config(['$stateProvider',
  function ($stateProvider) {
    // Positions state routing
    $stateProvider.
      state('listPositions', {
        url: '/positions',
        templateUrl: 'modules/positions/views/list-positions.client.view.html'
      }).
      state('createPosition', {
        url: '/positions/create',
        templateUrl: 'modules/positions/views/create-position.client.view.html'
      }).
      state('viewPosition', {
        url: '/positions/:positionId',
        templateUrl: 'modules/positions/views/view-position.client.view.html'
      }).
      state('editPosition', {
        url: '/positions/:positionId/edit',
        templateUrl: 'modules/positions/views/edit-position.client.view.html'
      });
  }
]);