(function () {
  'use strict';
  // Setting up route
  angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      // Redirect to home view when route not found
      $urlRouterProvider.otherwise('/');

      $stateProvider
        // resolves Authentication and provides to all nested states as resolvedAuth
        .state('main', {
          url: '',
          abstract: true,
          template: '<ui-view/>',
          views: {
            'content': {
            },
            'sidebar': {
              templateUrl: 'modules/core/views/sidebar.client.view.html',
              controller: 'SidebarController',
              controllerAs: 'sidebar'
            },
            'footer': {
              templateUrl: 'modules/core/views/footer.client.view.html',
              controller: 'FooterController',
              controllerAs: 'footer'
            },
            'header': {
              templateUrl: 'modules/core/views/header.client.view.html',
              controller: 'HeaderController',
              controllerAs: 'header'
            }
          },
          resolve: {
            resolvedAuth: function(Authentication) {
              return Authentication.promise;
            }
          }
        })
        // Home state routing
        .state('main.home', {
          views: {
            'content@': {
              controller: 'HomeController',
              controllerAs: 'vm',
              templateUrl: 'modules/core/views/home.client.view.html',
            }
          },
          url: '/',
          resolve: {
            resolvedAuth: function(resolvedAuth) {
              return resolvedAuth;
            }
          }
        })
        // Style Guide
        .state('main.styles', {
          url: '/styles',
          views: {
            'content@': {
              controller: 'StyleGuideController',
              controllerAs: 'vm',
              templateUrl: 'modules/core/views/style-guide.client.view.html',
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
