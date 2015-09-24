(function () {
  'use strict';
  angular.module('core')
    .config(function (uiSelectConfig) {
      uiSelectConfig.theme = 'bootstrap';
    })
    .run(function (_) {
      // invoking _ (lodash) service at runtime so the service has a chance to remove lodash from the global scope.
    });
})();
