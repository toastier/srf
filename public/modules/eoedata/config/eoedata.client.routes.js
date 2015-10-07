(function () {
  'use strict';
  // Setting up route
  angular.module('eoeDatademographic').config(['$stateProvider',
    function ($stateProvider) {
      // EoeDatademographic state routing
      $stateProvider
        .state('main.listEoeDatademographic', {
          url: '/eoeDatademographic',
          templateUrl: 'modules/eoeDatademographic/views/list-eoeDatademographic.client.view.html',
          controller: 'ListEoeDatademographicController',
          controllerAs: 'vm',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.createEoeDatademographic', {
          url: '/eoeDatademographic/create',
          templateUrl: 'modules/eoeDatademographic/views/create-eoeDatademographic.client.view.html',
          controller: 'CreateEoeDatademographicController',
          controllerAs: 'vm',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.viewEoeDatademographic', {
          url: '/eoeDatademographic/:eoeDatademographicId',
          templateUrl: 'modules/eoeDatademographic/views/view-eoeDatademographic.client.view.html',
          controller: 'ViewEoeDatademographicController',
          controllerAs: 'vm',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.editEoeDatademographic', {
          url: '/eoeDatademographic/:eoeDatademographicId/edit',
          templateUrl: 'modules/eoeDatademographic/views/edit-eoeDatademographic.client.view.html',
          controller: 'EditEoeDatademographicController',
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
