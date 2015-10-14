/**
 * Smart Component Directive: duPositionInfoSmartComponent
 * An Isolate Scope Directive which uses the Positions service to retrieve and then display information about
 * the Position whose id is provided as the value of the attribute 'position-id'
 * @example
 <du-position-info-component position-id="yourViewModel.yourPositionId"></du-position-info-component>
 */
(function () {
  'use strict';

  angular
    .module('positions')
    .directive('duPositionInfoSmartComponent', duPositionInfoSmartComponent);

  /* @ngInject */
  function duPositionInfoSmartComponent() {

    return {
      restrict: 'E',
      templateUrl: 'modules/positions/directives/partials/du-position-info-smart-component.client.partial.html',
      scope: {
        positionId: '='
      },
      controller: duPositionInfoSmartComponentController,
      controllerAs: 'vm',
      bindToController: true
    };

    function duPositionInfoSmartComponentController ($scope, Position, Messages) {
      var vm = this;
      activate();

      function activate() {
        lookupPosition();
        // because the positionId provided may be tied to a promise (via $resource for instance), we need to watch
        // vm.positionId and then fire lookupPosition if it changes.
        $scope.$watch('vm.positionId', function(newVal) {
          if (newVal) {
            lookupPosition();
          }
        });
      }

      /**
       * Retrieves the data for the Position
       */
      function lookupPosition () {

        if(vm.positionId) {
          Position.get({positionId: vm.positionId}).$promise
            .then(function (result) {
              vm.position = result;
            })
            .catch(function (err) {
              Messages.addMessage(err.data.message, 'error', null, 'dev');
            });
        }

      }

    }
  }
})();
