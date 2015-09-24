(function () {
  'use strict';
  angular
    .module('core')
    .directive('pluralize', pluralize);


  function pluralize(schemaArrayElement) {
    var length = (schemaArrayElement.length);
    return {
      restrict: 'E',
      replace: true,
      template: '<ng-pluralize count=length when="{\'1\': \' Position\', \'2\': \' Positions\'}> </ng-pluralize>'
    };
  }
})();
