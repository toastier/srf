(function () {
  'use strict';
  // Configuring the EoeDataDemographic module
  angular.module('eoeDataDemographic').run(['Menus',
    function (Menus) {
      // Set top bar menu items
      Menus.addMenuItem('sidebar', 'EOE Demographics - Create', '', '#!/eoeDataDemographic/create', '#!/eoeDataDemographic/create', false, ['admin'], 998);
      Menus.addMenuItem('sidebar', 'EOE Demographics - Report', '', '#!/eoeDataDemographic', '#!/eoeDataDemographic', false, ['admin'], 999);
    }
  ]);
})();
