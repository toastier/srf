(function () {
  'use strict';
  angular
    .module('core')
    .controller('SidebarController', SidebarController);

  function SidebarController(Menus, resolvedAuth) {
    var sidebar = this;
    sidebar.user = resolvedAuth;
    sidebar.menus = Menus;
    sidebar.menu = Menus.getMenu('sidebar');
  }
})();
