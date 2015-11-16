(function () {
  'use strict';
  angular.module('core')
    .config(function (uiSelectConfig) {
      uiSelectConfig.theme = 'bootstrap';
    })
    .run(['Menus', '_', function (Menus, _) {
      // invoking _ (lodash) service at runtime so the service has a chance to remove lodash from the global scope.

      // Set top bar menu items
      Menus.addMenuItem('sidebar', 'Style Guide', 'core', null, '#!/styles', false, ['admin'], 500, 'styles');

    }]);
})();
