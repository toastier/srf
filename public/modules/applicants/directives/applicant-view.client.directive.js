(function () {
  'use strict';
  angular
    .module('applicants')
    .directive('applicantView', applicantView);
  function applicantView() {
    return {
      restrict: 'E',
      templateUrl: 'modules/applicants/directives/partials/applicant-view.client.partial.html'
    };
  }
})();
