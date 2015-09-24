(function () {
  'use strict';
  angular
    .module('positions')
    .controller('EditPositionController', EditPositionController);


  /* @ngInject */
  function EditPositionController($stateParams, Position, Navigation, Authentication, Messages, _) {

    var vm = this;
    vm.authentication = Authentication.init();
    vm.cancel = cancel;
    vm.dateCloseOpen = false;
    vm.datePostedOpen = false;
    vm.dateRequestedOpen = false;
    vm.dateStartOpen = false;
    vm.deletePosition = deletePosition;
    vm.disableSaveButton = disableSaveButton;
    vm.positionForm = {};
    vm.remove = remove;
    vm.toggleDatePicker = toggleDatePicker;
    vm.update = update;

    activate();

    function cancel() {
      Position.listPositions();
    }

    function deletePosition() {
      Position.delete({positionId: vm.position._id}).$promise
        .then(function() {
          Messages.addMessage('The Position has been deleted permanently');
          Position.listPositions();
        })
        .catch(function(error) {
          Messages.addMessage('There was a problem deleting the Position. ' + error.data.message, 'error');
        });
    }

    function disableSaveButton() {
      return vm.positionForm.$invalid || vm.positionForm.$pristine;
    }

    function remove() {
      vm.position.$remove()
        .then(function(result) {
          Messages.addMessage('The Position has been permanently deleted');
        })
        .catch(function(error) {
          Messages.addMessage('There was a problem deleting the Position: ' + error.data.message, 'error');
        });
    }

    function toggleDatePicker(event, datePicker) {
      var datePickerOpenName = datePicker + 'Open';
      vm[datePickerOpenName] = !vm[datePickerOpenName];
    }

    function update() {
      Position.update(vm.position).$promise
        .then(function(result) {
          Messages.addMessage('The Position "' + result.name + '" was saved.', 'success');
          Position.listPositions();
        })
        .catch(function(error) {
          Messages.addMessage('There was a problem saving the Position', 'error');
        });
    }

    function setupNavigation () {
      Navigation.clear(); // clear everything in the Navigation
      Navigation.breadcrumbs.add('Positions', '#!/positions', '#!/positions'); // add a breadcrumb
      /** @type Array Actions we wish to add to the Navigation that we define locally **/
      var controllerActions = [
        {title: 'Save Changes', method: vm.update, type: 'button', style: 'btn-save', disableIf: vm.disableSaveButton},
        {title: 'Cancel Changes', method: vm.cancel, type: 'button', style: 'btn-cancel'},
        {title: 'Delete Position', method: vm.remove, type: 'button', style: 'btn-delete'}
      ];

      var actions = Position.getActions(); // get the actions from the Model
      actions.splice(0, 3); // splice out the ones we don't want (were taking them all out here)
      actions = _.union(actions, controllerActions); // merge together actions defined in the controller with those from the Model
      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('Edit Position'); // set the page title
    }

    function activate() {

      Position.get({
        positionId: $stateParams.positionId
      }).$promise
        .then(function(result) {
          vm.position = result;
          // setting date fields to new js Date because of bug with ui-bootstrap datepicker validation. Necessary
          // for the values to be seen as valid on page load.
          vm.position.dateRequested = new Date(vm.position.dateRequested);
          vm.position.datePosted = new Date(vm.position.datePosted);
          vm.position.dateStart = new Date(vm.position.dateStart);
          vm.position.dateClose = new Date(vm.position.dateClose);
        })
        .catch(function(err) {
          Messages.addMessage(err.data.message, 'error', null, 'dev');
        });
      setupNavigation();
    }
  }
})();
