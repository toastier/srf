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
        uploadType: '@',
        fileMetadata: '=',
        fileModel: '=',
        showRemoveOption: '@',
        removeFileMethod: '&'
      },
      controller: duApplicationUploadFileController,
      controllerAs: 'vm',
      bindToController: true
    };

    function duApplicationUploadFileController() {
      var vm = this;
      vm.removeFile = removeFile;

      function removeFile () {
        vm.removeFileMethod({fileId: vm.fileMetadata._id});
      }

      activate();

      function activate() {
        // code to run on activation
      }
    }
  }
})();

