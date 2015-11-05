(function () {
  'use strict';
  angular.module('applications').config(['$stateProvider',
    function ($stateProvider) {
      // Applications state routing
      $stateProvider
        .state('main.listApplications', {
          views: {
            'content@': {
              templateUrl: 'modules/applications/views/applications.client.view.html',
              controller: 'ApplicationsController',
              controllerAs: 'vm'
            }
          },
          url: '/applications',

          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.createApplication', {
          views: {
            'content@': {
              templateUrl: 'modules/applications/views/create-application.client.view.html',
              controller: 'CreateApplicationController',
              controllerAs: 'vm'
            }
          },
          url: '/applications/create/:openingId',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.managerCreateApplication', {
          views: {
            'content@': {
              templateUrl: '/modules/applications/views/manager-create-application.client.view.html',
              controller: 'ManagerCreateApplicationController',
              controllerAs: 'vm'
            }
          },
          url: '/applications/managerCreate/:applicantId/:openingId',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.viewApplication', {
          url: '/applications/:applicationId',
          'views': {
            'content@': {
              templateUrl: 'modules/applications/views/view-application.client.view.html',
              controller: 'ViewApplicationController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.manageApplication', {
          url: '/applications/:applicationId/manage',
          'views': {
            'content@': {
              templateUrl: 'modules/applications/views/manage-application.client.view.html',
              controller: 'ManageApplicationController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.conductReview', {
          url: '/applications/:applicationId/review/conduct',
          'views': {
            'content@': {
              templateUrl: 'modules/applications/views/conduct-review.client.view.html',
              controller: 'ApplicationReviewController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            resolvedAuth: function (resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.conductPhoneInterview', {
          url: '/applications/:applicationId/phoneInterview/conduct',
          'views': {
            'content@': {
              templateUrl: 'modules/applications/views/conduct-phone-interview.client.view.html',
              controller: 'ApplicationPhoneInterviewController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            resolvedAuth: function (resolvedAuth) {
              return resolvedAuth;
            }
          }
        });
  }]);
})();
