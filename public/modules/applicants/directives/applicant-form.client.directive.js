(function () {
  'use strict';
  angular
    .module('applicants')
    .directive('applicantForm', applicantForm);

  function applicantForm () {
    return {
      restrict: 'E',
      templateUrl: 'modules/applicants/directives/partials/applicant-form.client.partial.html'
    };
  }
})();