(function () {
  'use strict';
  angular.module('applicants').run(['Menus',
    function (Menus) {
      // Set top bar menu items
      Menus.addMenuItem('sidebar', 'Applicants', 'applicants', '#!/applicants', '#!/applicants');
      Menus.addMenuItem('sidebar', 'New Applicant', 'applicants/create', '#!/applicants/create', '#!/applicants/create');
    }
  ]);
})();
