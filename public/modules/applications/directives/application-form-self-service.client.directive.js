(function() {
  'use strict';
  angular
    .module('applications')
    .directive('applicationFormSelfService', applicationFormSelfService);

  function applicationFormSelfService() {
    return {
      restrict: 'E',
      templateUrl: 'modules/applications/directives/partials/application-form-self-service.client.partial.html'
    };
  }
})();
