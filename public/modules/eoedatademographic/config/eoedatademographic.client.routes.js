(function () {
  'use strict';
  // Setting up route
  angular.module('eoeDataDemographic').config(['$stateProvider',
    function ($stateProvider) {
      // EoeDataDemographic state routing
      $stateProvider
        .state('main.listEoeDataDemographic', {
          url: '/eoeDataDemographic',
          templateUrl: 'modules/eoeDataDemographic/views/list-eoeDataDemographic.client.view.html',
          controller: 'ListEoeDataDemographicController',
          controllerAs: 'vm',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.createEoeDataDemographic', {
          url: '/eoeDataDemographic/create',
          templateUrl: 'modules/eoeDataDemographic/views/create-eoeDataDemographic.client.view.html',
          controller: 'CreateEoeDataDemographicController',
          controllerAs: 'vm',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.viewEoeDataDemographic', {
          url: '/eoeDataDemographic/:eoeDataDemographicId',
          templateUrl: 'modules/eoeDataDemographic/views/view-eoeDataDemographic.client.view.html',
          controller: 'ViewEoeDataDemographicController',
          controllerAs: 'vm',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.editEoeDataDemographic', {
          url: '/eoeDataDemographic/:eoeDataDemographicId/edit',
          templateUrl: 'modules/eoeDataDemographic/views/edit-eoddatademographic.client.view.html',
          controller: 'EditEoeDataDemographicController',
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
