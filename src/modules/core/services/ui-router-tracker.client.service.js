    (function () {
      'use strict';

      angular
        .module('core')
        .factory('RouterTracker', RouterTracker);

      function RouterTracker($rootScope) {

        var routeHistory = [];
        var service = {
          getRouteHistory: getRouteHistory
        };

        $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
          routeHistory.push({route: from, routeParams: fromParams});
        });

        function getRouteHistory() {
          return routeHistory;
        }

        return service;
      }
    })();

