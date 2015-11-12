(function () {
  'use strict';
  angular
    .module('eoe')
    .directive('eoeForm', eoeForm)
    .directive('eoedemographicForm', eoedemographicForm)
    .directive('eoedisabilityForm', eoedisabilityForm)
    .directive('eoeveteranForm', eoeveteranForm)

  function eoeForm() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eoe/directives/partials/eoe-form.client.partial.html'
    };
  }

  function eoedemographicForm() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eoe/directives/partials/eoedemographic-form.client.partial.html'
    };
  }
  function eoeveteranForm() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eoe/directives/partials/eoeveteran-form.client.partial.html'
    };
  }
  function eoedisabilityForm() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eoe/directives/partials/eoedisability-form.client.partial.html'
    };
  }
})();
