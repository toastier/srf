(function () {
  'use strict';
  angular
    .module('eoe')
      .directive('eoeReportGenderTotals', eoeReportGenderTotals)
      .directive('eoeReportGenderHeader', eoeReportGenderHeader)
      .directive('eoeReportSearchCriteria', eoeReportSearchCriteria)
      .directive('eoeReportApplicantsHired', eoeReportApplicantsHired)

  function eoeReportSearchCriteria() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eoe/directives/partials/eoe-report-search-criteria.client.partial.html'
    };
  }

  function eoeReportApplicantsHired() {
      return {
        restrict: 'E',
        templateUrl: 'modules/eoe/directives/partials/eoe-report-applicants-hired.client.partial.html'
      };
  }

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
