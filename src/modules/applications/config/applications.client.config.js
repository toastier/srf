(function () {
  'use strict';
  // Configuring the Applications module
  angular.module('applications').run(['Menus',
    function (Menus) {
      // Set top bar menu items
      Menus.addMenuItem('sidebar', 'Applications', 'applications', null, '#!/applications', false, ['admin', 'committee member', 'manager'], 50, 'applications');
    }
  ]);
})();
