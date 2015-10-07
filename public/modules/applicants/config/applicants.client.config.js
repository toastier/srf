(function () {
  'use strict';
  angular.module('applicants').run(['Menus',
    function (Menus) {
      // Set top bar menu items
      Menus.addMenuItem('sidebar', 'Applicants', 'applicants', null, '#!/applicants', false, ['admin', 'manager'], 80, 'applicants');
    }
  ]);
})();
