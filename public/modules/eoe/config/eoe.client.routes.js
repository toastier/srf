(function () {
  'use strict';
  // Setting up route
  angular.module('eoe').config(['$stateProvider',
    function ($stateProvider) {
      // Eoe state routing
      $stateProvider
        .state('main.listEoe', {
          url: '/eoe',
          templateUrl: 'modules/eoe/views/list-eoe.client.view.html',
          controller: 'ListEoeController',
          controllerAs: 'vm',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.createEoe', {
          url: '/eoe/create/:applicationId',
          templateUrl: 'modules/eoe/views/create-eoe.client.view.html',
          controller: 'CreateEoeController',
          controllerAs: 'vm',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        //.state('main.viewEoe', {
        //  url: '/eoe/:eoeId',
        //  templateUrl: 'modules/eoe/views/view-eoe.client.view.html',
        //  controller: 'ViewEoeController',
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
