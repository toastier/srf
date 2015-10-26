(function () {
  'use strict';

  angular
    .module('applications')
    .directive('duApplicationUploadFile', duApplicationUploadFile);

  /* @ngInject */
  function duApplicationUploadFile() {

    return {
      restrict: 'E',
      templateUrl: 'modules/applications/directives/partials/du-application-upload-file.client.partial.html',
      scope: {
        uploadMethod: '&',
        heading: '@',
        uploadType: '@'
      },
      controller: duApplicationUploadFileController,
      controllerAs: 'vm',
      bindToController: true
    };

    function duApplicationUploadFileController() {
      var vm = this;

      activate();

      function activate() {
        // code to run on activation
      }
    }
  }
})();

