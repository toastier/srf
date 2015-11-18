(function () {
  'use strict';

  angular
    .module('applications')
    .directive('duApplicationReviewPhaseSmartComponent', duApplicationReviewPhaseSmartComponent);

  /* @ngInject */
  function duApplicationReviewPhaseSmartComponent() {

    return {
      restrict: 'E',
      templateUrl: 'modules/applications/directives/partials/du-application-review-phase-smart-component.client.partial.html',
      controller: duApplicationReviewPhaseSmartComponentController,
      controllerAs: 'vm',
      bindToController: true,
      scope: {
        reviewPhase: '=',
        proceedToReviewPhase: '@',
        startCollapsed: '@'
      }
    };

    function duApplicationReviewPhaseSmartComponentController($scope, Authentication, ReviewPhase, _) {
      /*jshint validthis:true */
      var vm = this;
      vm.toggleReviewPhase = toggleReviewPhase;

      activate();

      function activate() {

        Authentication.promise.then(function (user) {
          vm.user = user;
          $scope.$watch('vm.reviewPhase', function (newVal) {
            if (!_.isUndefined(newVal)) {
              vm.reviewPhaseModel = new ReviewPhase(vm.reviewPhase, vm.proceedToReviewPhase, vm.user);
              if (vm.reviewPhaseModel.reviewPhaseStatus === 'Complete' || vm.reviewPhaseModel.reviewPhaseStatus === 'Closed') {
                vm.isCollapsed = true;
              }
            }
          });
        });

        if (vm.startCollapsed === 'true') {
          vm.isCollapsed = true;
        }
      }

      function toggleReviewPhase() {
        vm.isCollapsed = !vm.isCollapsed;
      }
    }
  }
})();
