(function () {
  'use strict';
  angular
    .module('eoedata')
    .directive('eoedataView', eoedataView);

  function eoedataView() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eoedata/directives/partials/eoedata-view.client.partial.html'
    };
  }
})();
