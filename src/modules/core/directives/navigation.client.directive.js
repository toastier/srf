(function () {
  'use strict';
  angular
    .module('core')
    .directive('navigation', navigation);

  function navigation() {

    return {
      restrict: 'E',
      templateUrl: 'modules/core/directives/partials/navigation.client.partial.html',
      controller: function (Navigation) {
        var nav = this;
        nav.title = Navigation.viewTitle.get();
        nav.buttons = Navigation.actions.get('buttons');
        nav.dropdownItems = Navigation.actions.get('dropdownItems');
        nav.status = {
          isOpen: false
        };

      },
      controllerAs: 'nav',
      bindToController: true
    };
  }
})();
