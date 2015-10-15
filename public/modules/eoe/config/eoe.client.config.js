(function () {
  'use strict';
  // Configuring the Eoe module
  angular.module('eoe').run(['Menus',
    function (Menus) {
      // Set top bar menu items
      Menus.addMenuItem('sidebar', 'EOE Survey', '', '#!/eoe/create', '#!/eoe/create', false, ['admin'], 998);
      Menus.addMenuItem('sidebar', 'EOE Demographics - Report', '', '#!/eoe', '#!/eoe', false, ['admin'], 999);
    }
  ]);
})();
