(function () {
  'use strict';
  angular
    .module('core')
    .controller('HomeController', HomeController);

  function HomeController($state, Authentication) {

    var vm = this;
    vm.authentication = Authentication.init();

    function activate() {

      vm.authentication.user.$promise
        .then(function () {
          if (vm.authentication.user._id) {
            var hasRole = vm.authentication.hasRole;
            if (hasRole(['admin'])) {
              $state.go('listPositions');
            } else if (hasRole(['faculty/staff'])) {
              $state.go('listAssets');
            } else {
              $state.go('noAccess');
            }
          } else {
            $state.go('signin');
          }
        });

    }

    activate();
  }
})();
