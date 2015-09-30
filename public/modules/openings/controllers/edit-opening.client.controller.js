(function () {
  'use strict';
  angular
    .module('openings')
    .controller('EditOpeningController', EditOpeningController);


  /* @ngInject */
  function EditOpeningController($stateParams, Messages, Navigation, Opening, Position, resolvedAuth, _) {

    var vm = this;
    vm.authentication = resolvedAuth;
    vm.cancel = cancel;
    vm.datePickerStates = {dateCloseOpen: false, datePostedOpen: false, dateRequestedOpen: false, dateStartOpen: false};
    vm.deleteOpening = deleteOpening;
    vm.disableSaveButton = disableSaveButton;
    vm.fillPositionInfo = fillPositionInfo;
    vm.openingForm = {};
    vm.options = {};
    vm.remove = remove;
    vm.toggleDatePicker = toggleDatePicker;
    vm.update = update;

    activate();

    function cancel() {
      Opening.listOpenings();
    }

    function deleteOpening() {
      Opening.delete({openingId: vm.opening._id}).$promise
        .then(function() {
          Messages.addMessage('The Opening has been deleted permanently');
          Opening.listOpenings();
        })
        .catch(function(error) {
          Messages.addMessage('There was a problem deleting the Opening. ' + error.data.message, 'error');
        });
    }

    function disableSaveButton() {
      return vm.openingForm.$invalid || vm.openingForm.$pristine;
    }

    function fillPositionInfo() {
      var position = getPosition(vm.opening.position);
      vm.opening.name = position.name;
      vm.opening.details = position.details;
    }

    function getValueLists() {
      Position.query().$promise
        .then(function(result) {
          vm.options.positions = result;
        })
        .catch(function(error) {
          Messages.addMessage(error.data.message, 'error');
        });
    }

    function remove() {
      vm.opening.$remove()
        .then(function(result) {
          Opening.listOpenings();
          Messages.addMessage('The Opening has been permanently deleted');
        })
        .catch(function(error) {
          Messages.addMessage('There was a problem deleting the Opening: ' + error.data.message, 'error');
        });
    }

    function toggleDatePicker(event, datePicker) {
      var datePickerOpenName = datePicker + 'Open';
      vm.datePickerStates[datePickerOpenName] = !vm.datePickerStates[datePickerOpenName];
    }

    function update() {
      Opening.update(vm.opening).$promise
        .then(function(result) {
          Opening.listOpenings();
          Messages.addMessage('The Opening "' + result.name + '" was saved.', 'success');
        })
        .catch(function(error) {
          Messages.addMessage('There was a problem saving the Opening', 'error');
        });
    }

    function setupNavigation () {
      Navigation.clear(); // clear everything in the Navigation
      Navigation.breadcrumbs.add('Openings', '#!/openings', '#!/openings'); // add a breadcrumb
      /** @type Array Actions we wish to add to the Navigation that we define locally **/
      var controllerActions = [
        {title: 'Save Changes', method: vm.update, type: 'button', style: 'btn-save', disableIf: vm.disableSaveButton},
        {title: 'Cancel Changes', method: vm.cancel, type: 'button', style: 'btn-cancel'},
        {title: 'Delete Opening', method: vm.remove, type: 'button', style: 'btn-delete'}
      ];

      var actions = Opening.getActions(); // get the actions from the Model
      actions.splice(0, 3); // splice out the ones we don't want (were taking them all out here)
      actions = _.union(actions, controllerActions); // merge together actions defined in the controller with those from the Model
      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('Edit Opening'); // set the page title
    }

    function activate() {

      Opening.get({
        openingId: $stateParams.openingId
      }).$promise
        .then(function(result) {
          vm.opening = result;
          // setting date fields to new js Date because of bug with ui-bootstrap datepicker validation. Necessary
          // for the values to be seen as valid on page load.
          vm.opening.dateRequested = new Date(vm.opening.dateRequested);
          vm.opening.datePosted = new Date(vm.opening.datePosted);
          vm.opening.dateStart = new Date(vm.opening.dateStart);
          vm.opening.dateClose = new Date(vm.opening.dateClose);
        })
        .catch(function(err) {
          Messages.addMessage(err.data.message, 'error', null, 'dev');
        });
      setupNavigation();
      getValueLists();
    }
  }
})();
