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
        fileMetadata: '=',
        heading: '@'
      }
    };

    function duGridFileMetadataViewController() {
      var vm = this;

      activate();

      function activate() {
        // code to run on activation
      }
    }
  }
})();

