(function () {
  'use strict';
  angular.module('users').config(['$stateProvider',
    function ($stateProvider) {
      // Users state routing
      $stateProvider
        .state('main.profile', {
          url: '/settings/profile',
          'views': {
            'content@': {
              templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
            }
          },
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.password', {
          url: '/settings/password',
          'views': {
            'content@': {
              templateUrl: 'modules/users/views/settings/change-password.client.view.html'
            }
          },
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.accounts', {
          url: '/settings/accounts',
          'views': {
            'content@': {
              templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
            }
          },
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.signup', {
          url: '/signup',
          'views': {
            'content@': {
              templateUrl: 'modules/users/views/signup.client.view.html',
              controller: 'AuthenticationController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.signin', {
          url: '/signin',
          'views': {
            'content@': {
              templateUrl: 'modules/users/views/signin.client.view.html',
              controller: 'AuthenticationController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.list', {
          url: '/users/list',
          'views': {
            'content@': {
              templateUrl: 'modules/users/views/list.client.view.html',
              controller: 'UsersController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.create', {
          url: '/users/create',
          'views': {
            'content@': {
              templateUrl: 'modules/users/views/create.client.view.html',
              controller: 'UsersController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.noAccess', {
          'views': {
            'content@': {
              templateUrl: 'modules/users/views/no-access.client.view.html',
              controller: 'NoAccessController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        .state('main.resetPassword', {
          'url': '/resetPassword/:token',
          'views': {
            'content@': {
              templateUrl: 'modules/users/views/reset-password.client.view.html',
              controller: 'ResetPasswordController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
      ;
    }
  ]);
})();
