(function () {
  'use strict';
  angular
    .module('core')
    .controller('HomeController', HomeController);

  function HomeController($state, resolvedAuth) {

    var vm = this;
    vm.user = resolvedAuth;

    function activate() {
      if (vm.user._id) {

        if (vm.user.hasRole(['admin'])) {
          $state.go('main.listPositions');
        } else if (vm.user.hasRole(['faculty/staff'])) {
          $state.go('main.listAssets');
        } else {
          $state.go('main.noAccess');
        }
      } else {
        $state.go('main.signin');
      }
    }

    activate();
  }

})();
