(function () {
  'use strict';

  angular
    .module('applications')
    .directive('duApplicationPhoneInterviewPhaseSmartComponent', duApplicationPhoneInterviewPhaseSmartComponent);

  /* @ngInject */
  function duApplicationPhoneInterviewPhaseSmartComponent() {

    return {
      restrict: 'E',
      templateUrl: 'modules/applications/directives/partials/du-application-phone-interview-phase-smart-component.client.partial.html',
      controller: duApplicationPhoneInterviewPhaseSmartComponentController,
      controllerAs: 'vm',
      bindToController: true,
      scope: {
        phoneInterviewPhase: '=',
        proceedToPhoneInterviewPhase: '@',
        startCollapsed: '@'
      }
    };

    function duApplicationPhoneInterviewPhaseSmartComponentController($scope, Authentication, PhoneInterviewPhase, _) {
      /*jshint validthis:true*/
      var vm = this;
      vm.togglePhoneInterviewPhase = togglePhoneInterviewPhase;

      activate();

      function activate() {
        Authentication.promise.then(function (user) {
          vm.user = user;
          $scope.$watch('vm.phoneInterviewPhase', function (newVal) {
            if (!_.isUndefined(newVal)) {
              vm.phoneInterviewPhaseModel = new PhoneInterviewPhase(vm.phoneInterviewPhase, vm.proceedToPhoneInterviewPhase, vm.user);
              if (vm.phoneInterviewPhaseModel.phoneInterviewPhaseStatus === 'Complete' || vm.phoneInterviewPhaseModel.phoneInterviewPhaseStatus === 'Closed') {
                vm.isCollapsed = true;
              }
            }
          });
        });
      }

      function togglePhoneInterviewPhase() {
        vm.isCollapsed = !vm.isCollapsed;
      }
    }
  }
})();
