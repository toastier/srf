(function () {
  'use strict';

  angular
    .module('applications')
    .directive('duWorksheetEditSmartComponent', duWorksheetEditSmartComponent);

  /* @ngInject */
  function duWorksheetEditSmartComponent() {

    return {
      restrict: 'E',
      templateUrl: 'modules/applications/directives/partials/du-worksheet-edit-smart-component.client.partial.html',
      controller: duWorksheetEditSmartComponentController,
      controllerAs: 'vm',
      bindToController: true,
      scope: {
        worksheetFields: '='
      }
    };

    function duWorksheetEditSmartComponentController() {
      /*jshint validthis:true*/
      var vm = this;

      activate();

      function activate() {
        // code to run on activation
      }
    }
  }
})();

