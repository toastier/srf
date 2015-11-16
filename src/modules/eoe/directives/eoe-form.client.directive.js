(function () {
  'use strict';
  angular
    .module('eoe')
    .directive('eoeForm', eoeForm)

  function eoeForm() {
    return {
      restrict: 'E',
      templateUrl: 'modules/eoe/directives/partials/eoe-form.client.partial.html'
    };
  }
})();
