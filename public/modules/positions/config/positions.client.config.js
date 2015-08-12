'use strict';

// Configuring the Positions module
angular.module('positions').run(['Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('sidebar', 'Positions', 'positions');
    Menus.addMenuItem('sidebar', 'New Position', 'positions/create');
  }
]);
