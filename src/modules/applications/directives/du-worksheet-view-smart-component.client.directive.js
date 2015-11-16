(function () {
  'use strict';

  angular
    .module('applications')
    .directive('duWorksheetViewSmartComponent', duWorksheetViewSmartComponent);

  /* @ngInject */
  function duWorksheetViewSmartComponent() {

    return {
      restrict: 'E',
      templateUrl: 'modules/applications/directives/partials/du-worksheet-view-smart-component.client.partial.html',
      controller: duWorksheetViewSmartComponentController,
      controllerAs: 'vm',
      bindToController: true,
      scope: {
        worksheetFields: '='
      }
    };

    function duWorksheetViewSmartComponentController() {
      /*jshint validthis:true*/
      var vm = this;

      activate();

      function activate() {
        // code to run on activation
      }
    }
  }
})();

