(function () {
  'use strict';
  // Configuring the Eoe module
  angular.module('eoe').run(['Menus',
    function (Menus) {
      // Set top bar menu items
      Menus.addMenuItem('sidebar', 'EEO Report', '', '#!/eoe', '#!/eoe', false, ['admin', 'manager'], 999, 'reports');
    }
  ]);
})();
