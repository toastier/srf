(function () {
  'use strict';
  // Setting up route
  angular.module('eoeDataDemographics').config(['$stateProvider',
    function ($stateProvider) {
      // EoeDataDemographics state routing
      $stateProvider
        .state('main.listEoeDataDemographics', {
          url: '/eoeDataDemographics',
          templateUrl: 'modules/eoeDataDemographics/views/list-eoeDataDemographics.client.view.html',
          controller: 'ListEoeDataDemographicsController',
          controllerAs: 'vm',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.createEoeDataDemographics', {
          url: '/eoeDataDemographics/create',
          templateUrl: 'modules/eoeDataDemographics/views/create-eoeDataDemographics.client.view.html',
          controller: 'CreateEoeDataDemographicsController',
          controllerAs: 'vm',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.viewEoeDataDemographics', {
          url: '/eoeDataDemographics/:eoeDataDemographicsId',
          templateUrl: 'modules/eoeDataDemographics/views/view-eoeDataDemographics.client.view.html',
          controller: 'ViewEoeDataDemographicsController',
          controllerAs: 'vm',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.editEoeDataDemographics', {
          url: '/eoeDataDemographics/:eoeDataDemographicsId/edit',
          templateUrl: 'modules/eoeDataDemographics/views/edit-eoeDataDemographics.client.view.html',
          controller: 'EditEoeDataDemographicsController',
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
