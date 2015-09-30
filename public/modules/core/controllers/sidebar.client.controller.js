(function () {
  'use strict';
  angular
    .module('core')
    .controller('SidebarController', SidebarController);

  function SidebarController(Authentication, Menus) {
    var sidebar = this;

    // Authentication returns a promise.  Wait for it to resolve before setting up the state.
    // @todo convert to use ui-router resolve as we are doing in the main area of the view
    Authentication.promise
      .then(function (result) {
        sidebar.user = result;
        sidebar.menus = Menus;
        sidebar.menu = Menus.getMenu('sidebar');
      });
  }
})();
