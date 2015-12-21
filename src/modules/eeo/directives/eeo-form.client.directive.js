(function () {
  'use strict';
  angular
    .module('eeo')
    .directive('eeoForm', eeoForm)
    .directive('eeodemographicForm', eeodemographicForm)
    .directive('eeodisabilityForm', eeodisabilityForm)
    .directive('eeoveteranForm', eeoveteranForm)
    .directive('duDisabilityManagementSystem', duDisabilityManagementSystem)
    .directive('duDisabilityBrief', duDisabilityBrief)
    .directive('eeoSubmitted', eeoSubmitted)


  function eeoForm() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eeo/directives/partials/eeo-form.client.partial.html'
    };
  }

  function eeodemographicForm() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eeo/directives/partials/eeodemographic-form.client.partial.html',
      controller: 'CreateEeoController',
      controllerAs: 'vm',
      bindToController: true
    };
  }

  function eeoveteranForm() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eeo/directives/partials/eeoveteran-form.client.partial.html'
    };
  }
  function eeodisabilityForm() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eeo/directives/partials/eeodisability-form.client.partial.html'
    };
  }
  function duDisabilityManagementSystem() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eeo/directives/partials/du-disability-management-system.client.partial.html'
    };
  }
  function duDisabilityBrief() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eeo/directives/partials/du-disability-brief.client.partial.html'
    };
  }

  function eeoSubmitted() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eeo/directives/partials/eeo-submitted.client.partial.html'
    };
  }


})();
