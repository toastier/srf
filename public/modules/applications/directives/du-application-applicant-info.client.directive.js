(function () {
  'use strict';

  angular
    .module('applications')
    .directive('duApplicationApplicantInfo', duApplicationApplicantInfo);

  /* @ngInject */
  function duApplicationApplicantInfo() {

    return {
      restrict: 'E',
      templateUrl: 'modules/applications/directives/partials/du-application-applicant-info.client.partial.html',
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

