(function () {
  'use strict';
  angular
    .module('eoeDatademographic')
    .directive('eoeDatademographicForm', eoeDatademographicForm);

  function eoeDatademographicForm() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eoeDatademographic/directives/partials/eoeDatademographic-form.client.partial.html'
    };
  }
})();
