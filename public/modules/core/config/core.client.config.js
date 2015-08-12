'use strict';

//  Configuring the Core module
angular.module('core')
  .config(function (uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
  })
  .run(['Menus',
    function (Menus) {
      // Set top bar menu items
      Menus.addMenuItem('topbar', 'Dashboard', 'dashboard');
      Menus.addMenuItem('topbar', 'My Profile', 'settings/profile');
    }
  ]);
