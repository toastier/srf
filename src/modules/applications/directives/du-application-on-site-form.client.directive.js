(function () {
  'use strict';

  angular
    .module('applications')
    .directive('duApplicationOnSiteForm', duApplicationOnSiteForm);

  /* @ngInject */
  function duApplicationOnSiteForm() {

    return {
      restrict: 'E',
      templateUrl: 'modules/applications/directives/partials/du-application-on-site-form.client.partial.html',
      scope: true,
      controller: duApplicationOnSiteFormController,
      controllerAs: 'onSitePhase'
    };

    function duApplicationOnSiteFormController() {
      /*jshint validthis:true*/
      var onSitePhase = this;
      onSitePhase.toggleDatePicker = toggleDatePicker;
      onSitePhase.datePickerStates = {
        dateCompletedOpen: false
      };

      function toggleDatePicker(event, datePicker) {
        var datePickerOpenName = datePicker + 'Open';
        onSitePhase.datePickerStates[datePickerOpenName] = !onSitePhase.datePickerStates[datePickerOpenName];
      }
    }
  }
})();
