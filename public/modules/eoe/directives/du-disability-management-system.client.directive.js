(function () {
  'use strict';
  angular
    .module('eoe')
    .directive('duDisabilityManagementSystem', duDisabilityManagementSystem)
    .directive('duDisabilityBrief', duDisabilityBrief)


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
