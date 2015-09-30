(function () {
  'use strict';
  // Configuring the Applications module
  angular.module('applications').run(['Menus',
    function (Menus) {
      // Set top bar menu items
      Menus.addMenuItem('sidebar', 'Applications', 'applications', '#!/applications', '#!/applications');
    }
  ]);
})();
