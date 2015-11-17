(function () {
  'use strict';

  angular
    .module('applications')
    .directive('duApplicationOffer', duApplicationOffer);

  /* @ngInject */
  function duApplicationOffer(Application) {

    return {
      restrict: 'E',
      templateUrl: 'modules/applications/directives/partials/du-application-offer.client.partial.html',
      scope: {
        application: '=',
        mode: '@'
      },
      controller: duApplicationOfferController,
      controllerAs: 'vm',
      bindToController: true
    };

    function duApplicationOfferController() {
      /*jshint validthis:true*/
      var vm = this;
      vm.datePickerStates = {
        dateOfferedOpen: false,
        dateAcceptedOpen: false,
        dateRetractedOpen: false
      };
      vm.toggleDatePicker = toggleDatePicker;

      activate();

      function activate() {
        if (vm.mode !== 'edit') {
          vm.mode = 'view';
        }
      }

      function toggleDatePicker(event, datePicker) {
        var datePickerOpenName = datePicker + 'Open';
        vm.datePickerStates[datePickerOpenName] = !vm.datePickerStates[datePickerOpenName];
      }
    }
  }
})();
