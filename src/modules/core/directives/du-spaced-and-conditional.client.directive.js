(function () {
  'use strict';

  angular
    .module('core')
    .directive('duSpacedAndConditional', duSpacedAndConditional);

  /* @ngInject */
  function duSpacedAndConditional() {

    return {
      restrict: 'A',
      controller: controller,
      controllerAs: 'conditional',
      scope: {
        scValue: '@'
      },
      bindToController: true,
      templateUrl: 'modules/core/directives/partials/du-spaced-and-conditional.client.partial.html'
    };

    function controller() {
      var conditional = this;
      var foo = 'bar';
      //link code
    }
  }
})();

