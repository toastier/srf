(function () {
  'use strict';
  // Configuring the Openings module
  angular.module('openings').run(['Menus',
    function (Menus) {
      // Set top bar menu items
      Menus.addMenuItem('sidebar', 'Openings', 'openings', '#!/openings', '#!/openings');
    }
  ]);
})();
