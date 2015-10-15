(function () {
  'use strict';
  angular
    .module('eoeDataDemographic')
    .directive('eoeDataDemographicForm', eoeDataDemographicForm)
    //.directive('eoeDisabilityForm', eoeDisabilityForm);


  function eoeDataDemographicForm() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eoeDataDemographic/directives/partials/eoeDataDemographic-form.client.partial.html'
    };
  }
  //function eoeDisabilityForm() {
  //  return {
  //    restrict: 'E',
  //    templateUrl: 'modules/eoeDataDemographic/directives/partials/eoeDisability-form.client.partial.html'
  //  };
  //}
})();
