'use strict';

function navigation() {

  return {
    restrict: 'E',
    templateUrl: 'modules/core/directives/navigation.client.partial.html',
    controller: function(Navigation) {
      var nav = this;
      nav.title = Navigation.viewTitle.get();
      nav.buttons = Navigation.actions.get('buttons');
      nav.dropdownItems = Navigation.actions.get('dropdownItems');

    },
    controllerAs: 'nav',
    bindToController: true
  };
}

angular
  .module('core')
  .directive('navigation', navigation);
