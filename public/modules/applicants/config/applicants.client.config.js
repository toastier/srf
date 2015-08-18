'use strict';

// Configuring the Applicants module
angular.module('applicants').run(['Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('sidebar', 'Applicants', 'applicants', '#!/applicants');
    Menus.addMenuItem('sidebar', 'New Applicant', 'applicants/create', '#!/applicants/create');
  }
]);