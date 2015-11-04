(function () {
  'use strict';
  angular
    .module('core')
    .controller('YesNoModalController', YesNoModalController);

  function YesNoModalController($modalInstance, modalTitle, modalMessage) {

    var vm = this;
    vm.modalTitle = modalTitle;
    vm.modalMessage = modalMessage;
    vm.yes = yes;
    vm.no = no;

    function yes() {
      $modalInstance.close(true);
    }

    function no() {
      $modalInstance.close(false);
    }

    activate();

    ////////////////

    function activate() {
    }
  }
})();
