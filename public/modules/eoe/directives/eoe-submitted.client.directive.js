(function () {
  'use strict';
  angular
    .module('eoe')
    .directive('eoeSubmitted', eoeSubmitted)

  function eoeSubmitted() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eoe/directives/partials/eoe-submitted.client.partial.html'
    };
  }
})();
