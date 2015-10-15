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
        //.state('main.createApplication.loggedIn', {
        //  url: '/loggedIn',
        //  templateUrl: 'modules/applications/views/create-application.client.view.html',
        //  controller: 'CreateApplicationController',
        //  controllerAs: 'vm',
        //  resolve: {
        //    resolvedAuth: function(resolvedAuth) {
        //      var newResolvedAuth = resolvedAuth;
        //      if (!resolvedAuth._id) {
        //        resolvedAuth.refresh();
        //        newResolvedAuth = resolvedAuth.promise;
        //      }
        //      return newResolvedAuth;
        //    }
        //  }
        //})
        .state('main.viewApplication', {
          url: '/applications/:applicationId',
          templateUrl: 'modules/applications/views/view-application.client.view.html',
          controller: 'ViewApplicationController',
          controllerAs: 'vm',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
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
        })
        .state('main.conductReview', {
          url: '/applications/:applicationId/review/conduct',
          templateUrl: 'modules/applications/views/conduct-review.client.view.html',
          controller: 'ApplicationReviewController',
          controllerAs: 'vm',
          resolve: {
            resolvedAuth: function (resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.conductPhoneInterview', {
          url: '/applications/:applicationId/phoneInterview/conduct',
          templateUrl: 'modules/applications/views/conduct-phone-interview.client.view.html',
          controller: 'ApplicationPhoneInterviewController',
          controllerAs: 'vm',
          resolve: {
            resolvedAuth: function (resolvedAuth) {
              return resolvedAuth;
            }
          }
        });
  }]);
})();
