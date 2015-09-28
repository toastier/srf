(function () {
  'use strict';
  angular
    .module('positions')
    .controller('CreatePositionController', CreatePositionController);

  /* @ngInject */
  function CreatePositionController(Authentication, Navigation, Position, Messages, _) {
    /* jshint validthis: true */
    var vm = this;
    vm.authentication = Authentication.init();
    vm.disableSaveButton = disableSaveButton;
    vm.cancel = cancel;
    vm.dateCloseOpen = false;
    vm.datePostedOpen = false;
    vm.dateRequestedOpen = false;
    vm.dateStartOpen = false;
    vm.position = new Position();
    vm.savePosition = savePosition;
    vm.toggleDatePicker = toggleDatePicker;

    activate();

    function cancel() {
      Position.listPositions();
    }

    function disableSaveButton() {
      return angular.isUndefined(vm.positionForm) || vm.positionForm.$invalid || vm.positionForm.$pristine;
    }

    function savePosition() {
      vm.position.$save()
        .then(function (result) {
          Messages.addMessage('The Position "' + result.name + '" was saved.', 'success');
          Position.listPositions();
        })
        .catch(function (error) {
          Messages.addMessage('There was a problem saving the Position ' + error.data.message, 'error');
        });
    }

    function toggleDatePicker(event, datePicker) {
      var datePickerOpenName = datePicker + 'Open';
      vm[datePickerOpenName] = !vm[datePickerOpenName];
    }

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation
      Navigation.breadcrumbs.add('Positions', '#!/positions', '#!/positions'); // add a breadcrumb
      /** @type Array Actions we wish to add to the Navigation that we define locally **/
      var controllerActions = [
        {title: 'Save Position', method: vm.savePosition, type: 'button', style: 'btn-save', disableIf: vm.disableSaveButton},
        {title: 'Cancel', method: vm.cancel, type: 'button', style: 'btn-cancel'}
      ];

      var actions = Position.getActions(); // get the actions from the Model
      actions.splice(0, 3); // splice out the ones we don't want (were taking them all out here)
      actions = _.union(actions, controllerActions); // merge together actions defined in the controller with those from the Model
      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('Create Position'); // set the page title
    }

    function activate() {

      setupNavigation();
    }
  }
})();
