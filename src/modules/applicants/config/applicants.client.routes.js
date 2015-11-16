(function () {
  'use strict';
  angular.module('applicants').config(['$stateProvider',
    function ($stateProvider) {
      // Applicants state routing
      $stateProvider
        .state('main.listApplicants', {
          url: '/applicants',
          'views': {
            'content@': {
              templateUrl: 'modules/applicants/views/applicants.client.view.html',
              controller: 'ApplicantsController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.createApplicant', {
          url: '/applicants/create',
          'views': {
            'content@': {
              templateUrl: 'modules/applicants/views/create-applicant.client.view.html',
              controller: 'CreateApplicantController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.viewApplicant', {
          url: '/applicants/:applicantId',
          'views': {
            'content@': {
              templateUrl: 'modules/applicants/views/view-applicant.client.view.html',
              controller: 'ViewApplicantController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.editApplicant', {
          url: '/applicants/:applicantId/edit',
          'views': {
            'content@': {
              templateUrl: 'modules/applicants/views/edit-applicant.client.view.html',
              controller: 'EditApplicantController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        });
    }
  ]);
})();
