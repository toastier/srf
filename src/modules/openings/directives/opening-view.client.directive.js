(function () {
  'use strict';
  angular
    .module('openings')
    .directive('openingView', openingView);

  function openingView() {
    return {
      restrict: 'E',
      templateUrl: 'modules/openings/directives/partials/opening-view.client.partial.html'
    };
  }
})();
