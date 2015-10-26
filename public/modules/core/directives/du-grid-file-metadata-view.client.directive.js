(function () {
  'use strict';

  angular
    .module('core')
    .directive('duGridFileMetadataView', duGridFileMetadataView);

  /* @ngInject */
  function duGridFileMetadataView() {

    return {
      restrict: 'E',
      controller: duGridFileMetadataViewController,
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'modules/core/directives/partials/du-grid-file-metadata-view.client.partial.html',
      scope: {
        showRemoveOption: '@',
        removeFileMethod: '&',
        fileMetadata: '=',
        heading: '@'
      }
    };

    function duGridFileMetadataViewController(Uploads, $scope, $sce, _ ) {
      var vm = this;

      vm.fileVisible = false;
      vm.hideFile = hideFile;
      vm.showFile = showFile;
      vm.removeFile = removeFile;

      vm.viewFile = function(fileMetadata) {
        Uploads.viewFile({fileId: fileMetadata._id}).$promise
          .then(function(fileStream) {
            var blob = new Blob([fileStream], {type: 'application/pdf'});
            var fileUrl = (window.URL || window.webkitURL).createObjectURL(blob);
            vm.file = $sce.trustAsResourceUrl(fileUrl);

          });
      };

      function hideFile () {
        vm.fileVisible = false;
      }

      function showFile () {
        vm.fileVisible = true;
      }

      function removeFile () {
        vm.removeFileMethod({fileId: vm.fileMetadata._id});
      }

      activate();

      function activate() {
        $scope.$watch('vm.fileMetadata', function (newVal) {
          if(_.isObject(newVal)) {
            newVal.url = $sce.trustAsResourceUrl('/uploads/file/' + newVal._id);
            newVal.downloadUrl = $sce.trustAsResourceUrl('/uploads/file/download/' + newVal._id);

          }
        });
      }
    }
  }
})();

