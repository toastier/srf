'use strict';

//  Configuring the Core module
angular.module('core')
  .config(function (uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
  })
  //.run(['Menus',
  //  function (Menus) {
  //    // Set top bar menu items
  //    Menus.addMenuItem('topbar', 'Dashboard', 'dashboard');
  //  }
  //])
  .run(function( _ ){
    // invoking _ (lodash) service at runtime so the service has a chance to remove lodash from the global scope.
  });
