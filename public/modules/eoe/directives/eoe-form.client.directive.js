(function () {
  'use strict';
  angular
    .module('eoe')
    .directive('eoeForm', eoeForm)
    .directive('eoedemographicForm', eoedemographicForm)
    .directive('eoedisabilityForm', eoedisabilityForm)
    .directive('eoeveteranForm', eoeveteranForm)
    .directive('duDisabilityManagementSystem', duDisabilityManagementSystem)
    .directive('duDisabilityBrief', duDisabilityBrief)



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
  function duDisabilityManagementSystem() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eoe/directives/partials/du-disability-management-system.client.partial.html'
    };
  }
  function duDisabilityBrief() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eoe/directives/partials/du-disability-brief.client.partial.html'
    };
  }
})();
