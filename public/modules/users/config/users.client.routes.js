'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.
      state('profile', {
        url: '/settings/profile',
        templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
      }).
      state('password', {
        url: '/settings/password',
        templateUrl: 'modules/users/views/settings/change-password.client.view.html'
      }).
      state('accounts', {
        url: '/settings/accounts',
        templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
      }).
      state('signup', {
        url: '/signup',
        templateUrl: 'modules/users/views/signup.client.view.html'
      }).
      state('signin', {
        url: '/signin',
        templateUrl: 'modules/users/views/signin.client.view.html'
      }).
      state('list', {
        url: '/users/list',
        templateUrl: 'modules/users/views/list.client.view.html',
        controller: 'UsersController',
        controllerAs: 'vm'
      }).
      state('create', {
        url: '/users/create',
        templateUrl: 'modules/users/views/create.client.view.html',
        controller: 'UsersController',
        controllerAs: 'vm'
      });
  }
]);