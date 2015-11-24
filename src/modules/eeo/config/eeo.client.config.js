(function () {
  'use strict';
  // Configuring the Eeo module
  angular.module('eeo').run(['Menus',
    function (Menus) {
      // Set top bar menu items
      Menus.addMenuItem('sidebar', 'EEO Report', '', '#!/eeo', '#!/eeo', false, ['admin', 'manager'], 999, 'reports');
    }
  ]);
})();
