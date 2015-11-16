/**
 * Provides vertical sizing of viewable files embedded as objects.  Sizing is based on US Letter size
 * portrait orientation.
 */
(function () {
  'use strict';

  angular
    .module('core')
    .directive('duEmbeddedFileAsObject', duEmbeddedFileAsObject);

  /* @ngInject */
  function duEmbeddedFileAsObject($window) {

    return {
      restrict: 'A',
      link: link
    };

    function link(scope, element) {

      resizeObject();

      function resizeObject() {

        if (element[0].clientWidth > 0) {
          var calculatedHeight = Math.floor(element[0].clientWidth * 1.29);
          if (calculatedHeight > 1070) {
            calculatedHeight = 1070;
          }
          element[0].height = calculatedHeight.toString(10) + 'px';
        }
      }

      //Get the global window object as an element
      var w = angular.element($window);
      scope.$watch(function() {
        return {
          'w': w[0].innerWidth
        };
      }, function () { //no args because we just using the watch as a trigger
        //windowWidth = newValue.w;
        //windowHeight = newValue.h;
        resizeObject();
      }, true);

      w.bind('resize', function () {
        scope.$apply();
      });
    }

  }
})();
