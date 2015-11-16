(function () {
  'use strict';
  angular.module('dashboards').run(['Menus',
    function (Menus) {
      Menus.addMenuItem('sidebar', 'Dashboard', 'dashboards', null, '#!/dashboards', false, ['admin', 'manager', 'committee member'], 1, 'dashboard');
    }
  ]);
})();
