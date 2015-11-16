(function () {
  'use strict';
  angular
    .module('eoe')
    .directive('eoeView', eoeView);

  function eoeView() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eoe/directives/partials/eoe-view.client.partial.html'
    };
  }
})();
