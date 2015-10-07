(function () {
  'use strict';
  angular.module('applications').config(['$stateProvider',
    function ($stateProvider) {
      // Applications state routing
      $stateProvider
        .state('main.listApplications', {
          url: '/applications',
          templateUrl: 'modules/applications/views/applications.client.view.html',
          controller: 'ApplicationsController',
          controllerAs: 'vm',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.createApplication', {
          url: '/applications/create/:openingId',
          templateUrl: 'modules/applications/views/create-application.client.view.html',
          controller: 'CreateApplicationController',
          controllerAs: 'vm',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.viewApplication', {
          url: '/applications/:applicationId',
          templateUrl: 'modules/applications/views/view-application.client.view.html'
        })
        .state('main.manageApplication', {
          url: '/applications/:applicationId/manage',
          templateUrl: 'modules/applications/views/manage-application.client.view.html',
          controller: 'ManageApplicationController',
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
