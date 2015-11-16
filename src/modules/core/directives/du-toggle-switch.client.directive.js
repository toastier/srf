(function () {
  'use strict';
  angular
    .module('core')
    .directive('duToggleSwitch', duToggleSwitch);

  function duToggleSwitch() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'modules/core/directives/partials/du-toggle-switch.client.partial.html',
      scope: {
        toggleSwitchModel: '='
      },
      controller: function () {
        var vm = this;
        vm.toggleSwitch = toggleSwitch;

        function toggleSwitch(event) {
          switch (event.currentTarget.className) {
            case 'switch-on-zone':
              if (vm.toggleSwitchModel === null) {
                vm.toggleSwitchModel = true;
              } else {
                vm.toggleSwitchModel = null;
              }
              break;
            case 'switch-off-zone':
              if (vm.toggleSwitchModel === null) {
                vm.toggleSwitchModel = false;
              } else {
                vm.toggleSwitchModel = null;
              }
          }
        }
      },
      controllerAs: 'vm',
      bindToController: true
    };
  }
})();
