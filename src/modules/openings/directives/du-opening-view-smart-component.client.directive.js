(function () {
  'use strict';

  angular
    .module('openings')
    .directive('duOpeningViewSmartComponent', duOpeningViewSmartComponent);

  /* @ngInject */
  function duOpeningViewSmartComponent() {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'modules/openings/directives/partials/du-opening-view-smart-component.client.partial.html',
      scope: {
        openingId: '=',
        startCollapsed: '@'
      },
      controller: duOpeningViewSmartComponentController,
      controllerAs: 'vm',
      bindToController: true
    };

    function duOpeningViewSmartComponentController($scope, Opening, Messages) {
      var vm = this;
      vm.isCollapsed = false;
      vm.toggleOpening = toggleOpening;

      function toggleOpening() {
        vm.isCollapsed = !vm.isCollapsed;
      }

      activate();

      function getOpening() {
        Opening.get({openingId: vm.openingId}).$promise
          .then(function(opening) {
            vm.opening = opening;
          })
          .catch(function (err) {
            Messages.addMessage(err.data.message, 'error');
          });
      }

      function activate() {

        if(vm.startCollapsed === 'true') {
          vm.isCollapsed = true;
        }

        $scope.$watch('vm.openingId', function(newVal) {
          if(angular.isString(newVal)) {
            getOpening();
          }
        });
      }
    }
  }
})();
