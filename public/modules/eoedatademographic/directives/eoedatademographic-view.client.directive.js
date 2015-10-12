(function () {
  'use strict';
  angular
    .module('eoeDataDemographic')
    .directive('eoeDataDemographicView', eoeDataDemographicView);

  function eoeDataDemographicView() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eoeDataDemographic/directives/partials/eoeDataDemographic-view.client.partial.html'
    };
  }
})();
