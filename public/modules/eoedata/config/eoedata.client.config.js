(function () {
  'use strict';
  // Configuring the EoeDataDemographics module
  angular.module('eoeDataDemographics').run(['Menus',
    function (Menus) {
      // Set top bar menu items
      Menus.addMenuItem('sidebar', 'EoeDataDemographics', 'eoeDataDemographics', '#!/eoeDataDemographics', '#!/eoeDataDemographics');
    }
  ]);
})();
