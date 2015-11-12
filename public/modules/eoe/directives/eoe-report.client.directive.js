(function () {
  'use strict';
  angular
    .module('eoe')
      .directive('genderTotals', eoeReportGenderTotals);
    //.directive('eoeReportGenderHeader', eoeReportGenderHeader);

  function eoeReportGenderHeader() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eoe/directives/partials/eoe-report-gender-header.client.partial.html'
    };
  }

  function eoeReportGenderTotals() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eoe/directives/partials/eoe-report-gender-totals.client.partial.html'
    };
  }
})();
