(function () {
  'use strict';
  angular
    .module('applications')
    .directive('applicationForm', ApplicationForm);

  function ApplicationForm() {
    return {
      restrict: 'E',
      templateUrl: 'modules/applications/directives/partials/application-form.client.partial.html'
    };
  }
})();