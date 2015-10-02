(function () {
  'use strict';
  // Configuring the Eoedata module
  angular.module('eoedata').run(['Menus',
    function (Menus) {
      // Set top bar menu items
      Menus.addMenuItem('sidebar', 'Eoedata', 'eoedata', '#!/eoedata', '#!/eoedata');
    }
  ]);
})();
