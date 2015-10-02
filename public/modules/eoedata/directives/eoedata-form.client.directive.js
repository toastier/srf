(function () {
  'use strict';
  angular
    .module('eoedata')
    .directive('eoedataForm', eoedataForm);

  function eoedataForm() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eoedata/directives/partials/eoedata-form.client.partial.html'
    };
  }
})();
