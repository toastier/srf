(function () {
  'use strict';
  angular
    .module('eoeDataDemographic')
    .directive('eoeDataDemographicForm', eoeDataDemographicForm);

  function eoeDataDemographicForm() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eoeDataDemographic/directives/partials/eoeDataDemographic-form.client.partial.html'
    };
  }
})();
