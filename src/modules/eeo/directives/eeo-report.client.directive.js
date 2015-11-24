(function () {
  'use strict';
  angular
    .module('eeo')
      .directive('eeoReportGenderTotals', eeoReportGenderTotals)
      .directive('eeoReportGenderHeader', eeoReportGenderHeader)
      .directive('eeoReportSearchCriteria', eeoReportSearchCriteria)
      .directive('eeoReportApplicantsHired', eeoReportApplicantsHired)

  function eeoReportSearchCriteria() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eeo/directives/partials/eeo-report-search-criteria.client.partial.html'
    };
  }

  function eeoReportApplicantsHired() {
      return {
        restrict: 'E',
        templateUrl: 'modules/eeo/directives/partials/eeo-report-applicants-hired.client.partial.html'
      };
  }

  function eeoReportGenderHeader() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eeo/directives/partials/eeo-report-gender-header.client.partial.html'
    };
  }

  function eeoReportGenderTotals() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eeo/directives/partials/eeo-report-gender-totals.client.partial.html'
    };
  }
})();
