(function () {
  'use strict';
  angular
    .module('eoe')
    .directive('eoeReportGenderHeader', eoeReportGenderHeader);

  function eoeReportGenderHeader() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eoe/directives/partials/eoe-report-gender-header.client.partial.html'
    };
  }
})();
