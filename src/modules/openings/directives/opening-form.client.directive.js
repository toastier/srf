(function () {
  'use strict';
  angular
    .module('openings')
    .directive('openingForm', openingForm);

  function openingForm() {
    return {
      restrict: 'E',
      templateUrl: 'modules/openings/directives/partials/opening-form.client.partial.html'
    };
  }
})();
