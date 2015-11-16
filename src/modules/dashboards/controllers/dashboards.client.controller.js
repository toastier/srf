(function(){
  'use strict';
  angular
    .module('dashboards')
    .controller('DashboardsController', DashboardsController);

  function DashboardsController(resolvedAuth, Navigation) {
    var vm = this;
    vm.user = resolvedAuth;
    activate();

    function activate() {
      Navigation.clear();
      Navigation.viewTitle.set('Dashboard');
    }
  }
})();
