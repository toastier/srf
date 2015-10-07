(function () {
  'use strict';
  angular
    .module('eoeDatademographic')
    .directive('eoeDatademographicView', eoeDatademographicView);

  function eoeDatademographicView() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eoeDatademographic/directives/partials/eoeDatademographic-view.client.partial.html'
    };
  }
})();
