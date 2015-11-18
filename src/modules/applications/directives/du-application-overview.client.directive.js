(function () {
  'use strict';

  angular
    .module('applications')
    .directive('duApplicationOverview', duApplicationOverview);

  /* @ngInject */
  function duApplicationOverview() {

    return {
      restrict: 'E',
      templateUrl: 'modules/applications/directives/partials/du-application-overview.client.partial.html',
      controller: duApplicationApplicantInfoController,
      controllerAs: 'vm',
      bindToController: true,
      scope: {
        application: '='
      }
    };

    function duApplicationApplicantInfoController() {
      /*jshint validthis:true*/
      var vm = this;

      activate();

      function activate() {
        // code to run on activation
      }
    }
  }
})();

