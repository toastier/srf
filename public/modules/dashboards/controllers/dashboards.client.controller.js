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
      Navigation.viewTitle.set('Dashboard');
    }
  }
})();
