(function () {
  'use strict';
  angular
    .module('core')
    .controller('HomeController', HomeController);

  function HomeController($state, $location, resolvedAuth) {

    var vm = this;
    vm.user = resolvedAuth;

    function activate() {
      if (vm.user._id) {

        if (vm.user.hasRole(['admin'])) {
          $state.go('main.listOpenings');
        } else if (vm.user.hasRole(['committee member'])) {
          $state.go('main.listOpenings');
        }
      } else {
        $state.go('main.listCurrentOpenings');
      }
    }

    activate();
  }

})();
