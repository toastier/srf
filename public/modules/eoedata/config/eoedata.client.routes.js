(function () {
  'use strict';
  // Setting up route
  angular.module('eoedata').config(['$stateProvider',
    function ($stateProvider) {
      // Eoedata state routing
      $stateProvider
        .state('main.listEoedata', {
          url: '/eoedata',
          templateUrl: 'modules/eoedata/views/list-eoedata.client.view.html',
          controller: 'LstEoedataController',
          controllerAs: 'vm',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.createEoedata', {
          url: '/eoedata/create',
          templateUrl: 'modules/eoedata/views/create-eoedata.client.view.html',
          controller: 'CreateEoedataController',
          controllerAs: 'vm',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.viewEoedata', {
          url: '/eoedata/:eoedataId',
          templateUrl: 'modules/eoedata/views/view-eoedata.client.view.html',
          controller: 'ViewEoedataController',
          controllerAs: 'vm',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.editEoedata', {
          url: '/eoedata/:eoedataId/edit',
          templateUrl: 'modules/eoedata/views/edit-eoedata.client.view.html',
          controller: 'EditEoedataController',
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
