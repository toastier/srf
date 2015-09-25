(function () {
  'use strict';
  // Setting up route
  angular.module('openings').config(['$stateProvider',
    function ($stateProvider) {
      // Openings state routing
      $stateProvider
        .state('listOpenings', {
          url: '/openings',
          templateUrl: 'modules/openings/views/openings.client.view.html',
          controller: 'OpeningsController',
          controllerAs: 'vm'
        })
        .state('createOpening', {
          url: '/openings/create',
          templateUrl: 'modules/openings/views/create-opening.client.view.html',
          controller: 'CreateOpeningController',
          controllerAs: 'vm'
        })
        .state('viewOpening', {
          url: '/openings/:openingId',
          templateUrl: 'modules/openings/views/view-opening.client.view.html',
          controller: 'ViewOpeningController',
          controllerAs: 'vm'
        })
        .state('editOpening', {
          url: '/openings/:openingId/edit',
          templateUrl: 'modules/openings/views/edit-opening.client.view.html',
          controller: 'EditOpeningController',
          controllerAs: 'vm'
        });
    }
  ]);
})();
