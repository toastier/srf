(function () {
  'use strict';
  angular
    .module('positions')
    .directive('positionForm', positionForm);

  function positionForm() {
    return {
      restrict: 'E',
      templateUrl: 'modules/positions/directives/partials/position-form.client.partial.html'
    };
  }
})();
