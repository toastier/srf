(function () {
  'use strict';
  // Configuring the Eoe module
  angular.module('eoe').run(['Menus',
    function (Menus) {
      // Set top bar menu items
      Menus.addMenuItem('sidebar', 'EOE Report', '', '#!/eoe', '#!/eoe', false, ['admin'], 999);
    }
  ]);
})();
