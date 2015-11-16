(function () {
  'use strict';
  angular
    .module('openings')
    .controller('ChangeOpeningModalController', ChangeOpeningModalController);

  /**
   * UI-Bootstrap Modal Controller for Selecting an Opening
   * @description accepts the current Opening Object as currentOpening, and allows the user to
   * select an different opening from a list.  Returns the newly chosen Opening object
   * @param $modalInstance
   * @param Messages
   * @param Opening
   * @param currentOpening
   * @constructor
   */
  function ChangeOpeningModalController($modalInstance, Messages, Opening, currentOpening) {

    var vm = this;
    vm.cancel = cancel;
    vm.selectedOpening = null;
    vm.ok = ok;
    vm.selectOpening = selectOpening;

    activate();

    /**
     * Get the list of Openings
     */
    function activate() {
      Opening.forPosition({ positionId: currentOpening.position}).$promise
        .then(function(openings) {
          removeCurrentOpeningFromList(openings);
          vm.openings = openings;
        })
        .catch(function (err) {
          Messages.addMessage(err.data.message, 'error');
        });
    }

    /**
     * Dismiss the Modal and return the reason
     */
    function cancel() {
      $modalInstance.dismiss('User cancelled');
    }

    /**
     * Select an Opening from the list
     * @param opening
     */
    function selectOpening(opening) {
      vm.selectedOpening = opening;
    }

    /**
     * Close the Modal and return the selected Opening
     */
    function ok() {
      $modalInstance.close(vm.selectedOpening);
    }

    /**
     * Remove the currentOpening (passed as a resolve param in the invoking Controller) from the list.
     * @param openings
     */
    function removeCurrentOpeningFromList(openings) {
      var matched = false;
      angular.forEach(openings, function(opening) {
        if(!matched && currentOpening._id === opening._id) {
          matched = true;
          openings.splice(openings.indexOf(opening), 1);
        }
      });
    }
  }
})();
