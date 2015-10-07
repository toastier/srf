(function () {
  'use strict';
  angular
    .module('eoeDataDemographics')
    .directive('eoeDataDemographicsView', eoeDataDemographicsView);

  function eoeDataDemographicsView() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eoeDataDemographics/directives/partials/eoeDataDemographics-view.client.partial.html'
    };
  }
})();
