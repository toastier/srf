(function () {
  'use strict';
  // Configuring the EoeDataDemographic module
  angular.module('eoeDataDemographic').run(['Menus',
    function (Menus) {
      // Set top bar menu items
      Menus.addMenuItem('sidebar', 'EOE - Demographics', '#!/eoeDataDemographic', '#!/eoeDataDemographic', '#!/eoeDataDemographic');
      //Menus.addMenuItem('sidebar', 'EOE Demographic', '#!/eoeDataDemographic', '#!/eoeDataDemographic', '#!/eoeDataDemographic');
    }
  ]);
})();
