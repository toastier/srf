(function () {
  'use strict';
  angular
    .module('applications')
    .directive('applicationFormDualSelector', ApplicationFormDualSelector);

  function ApplicationFormDualSelector() {
    return {
      restrict: 'E',
      templateUrl: 'modules/applications/directives/partials/application-form-dual-selector.client.partial.html'
    };
  }
})();