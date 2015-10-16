(function () {
  'use strict';

  angular
    .module('core')
    .directive('duValidateEmail', duValidateEmail);

  /* @ngInject */
  function duValidateEmail() {
    var EMAIL_REGEXP = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    return {
      require: 'ngModel',
      restrict: '',
      priority: 2,
      link: link
    };

    function link(scope, element, attrs, ctrl) {
      if(ctrl && ctrl.$validators.email) {

        ctrl.$validators.email = function(modelValue) {
          return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
        };
      }
    }
  }
})();

