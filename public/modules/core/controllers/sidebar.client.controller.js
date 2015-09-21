angular
  .module('core')
  .controller('SidebarController', SidebarController);

function SidebarController (Authentication, Menus) {
    var sidebar = this;
    Authentication.init();
    sidebar.authentication = Authentication.init();
    sidebar.menus = Menus;
    sidebar.menu = Menus.getMenu('sidebar');
}