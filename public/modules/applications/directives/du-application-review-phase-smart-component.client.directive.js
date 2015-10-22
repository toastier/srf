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
        proceedToReviewPhase: '@'
      }
    };

    function duApplicationReviewPhaseSmartComponentController($scope, Authentication, ReviewPhase, _ ) {
      var vm = this;

      activate();

      function activate() {

        Authentication.promise.then(function(user) {
          vm.user = user;
          $scope.$watch('vm.reviewPhase', function (newVal) {
            if(!_.isUndefined(newVal)) {
              vm.reviewPhaseModel = new ReviewPhase(vm.reviewPhase, vm.proceedToReviewPhase, vm.user);
            }
          });
        });
      }
    }
  }
})();
