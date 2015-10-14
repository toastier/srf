(function () {
  'use strict';

  angular
    .module('openings')
    .directive('duListOpeningsSmartComponent', duListOpeningsSmartComponent);

  /* @ngInject */
  function duListOpeningsSmartComponent() {

    return {
      restrict: 'E',
      templateUrl: 'modules/openings/directives/partials/du-list-openings-smart-component.client.partial.html',
      scope: {
        mode: '='
      },
      controller: duListOpeningsSmartComponentController,
      controllerAs: 'vm',
      bindToController: true
    };

    function duListOpeningsSmartComponentController(Authentication, Opening) {
      var vm = this;

      activate();

      function activate() {
        // code to run on activation
        Authentication.promise
          .then(function (result) {
            vm.user = result;
            Opening.query().$promise
              .then(function(openingResponse) {
                vm.openings = openingResponse;
              });
          });
      }
    }
  }
})();

