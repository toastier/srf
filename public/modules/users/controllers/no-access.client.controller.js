(function () {
  'use strict';
  angular
    .module('users')
    .controller('NoAccessController', NoAccessController);

  function NoAccessController(Navigation) {

    var vm = this;

    function activate() {
      Navigation.clear();
      Navigation.viewTitle.set('You Do Not Have Access');
    }

    activate();
  }
})();
