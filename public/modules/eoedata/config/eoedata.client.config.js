(function () {
  'use strict';
  // Configuring the EoeDatademographic module
  angular.module('eoeDatademographic').run(['Menus',
    function (Menus) {
      // Set top bar menu items
      Menus.addMenuItem('sidebar', 'EoeDatademographic', 'eoeDatademographic', '#!/eoeDatademographic', '#!/eoeDatademographic');
    }
  ]);
})();
