(function () {
  'use strict';
  angular
    .module('eoeDataDemographics')
    .directive('eoeDataDemographicsForm', eoeDataDemographicsForm);

  function eoeDataDemographicsForm() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eoeDataDemographics/directives/partials/eoeDataDemographics-form.client.partial.html'
    };
  }
})();
