(function () {
  'use strict';
  angular
    .module('eoe')
    .directive('duDisabilityManagementSystem', duDisabilityManagementSystem)

  function duDisabilityManagementSystem() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eoe/directives/partials/du-disability-management-system.client.partial.html'
    };
  }
})();
