(function () {
  'use strict';
  angular
    .module('eoeDatademographic')
    .controller('CreateEoeDatademographicController', CreateEoeDatademographicController);

  /* @ngInject */
  function CreateEoeDatademographicController(Authentication, Messages, Navigation, EoeDatademographic, Position, _) {
    /* jshint validthis: true */
    var vm = this;
    vm.authentication = Authentication.init();
    vm.disableSaveButton = disableSaveButton;
    vm.cancel = cancel;
    vm.datePickerStates = {dateCloseOpen: false, datePostedOpen: false, dateRequestedOpen: false, dateStartOpen: false};
    vm.fillPositionInfo = fillPositionInfo;
    vm.eoeDatademographic = new EoeDatademographic();
    vm.saveEoeDatademographic = saveEoeDatademographic;
    vm.toggleDatePicker = toggleDatePicker;
    vm.options = {};

    activate();

    function cancel() {
      EoeDatademographic.listEoeDatademographic();
    }

    function disableSaveButton() {
      return angular.isUndefined(vm.eoeDatademographicForm) || vm.eoeDatademographicForm.$invalid || vm.eoeDatademographicForm.$pristine;
    }

    function getPosition(positionId) {
      var matched = false;
      angular.forEach(vm.options.positions, function(position) {
        if (!matched && positionId === position._id) {
          matched = position;
        }
      });
      return matched;
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

    function fillPositionInfo() {
      var position = getPosition(vm.eoeDatademographic.position);
      vm.eoeDatademographic.name = position.name;
      vm.eoeDatademographic.details = position.details;
    }

    function saveEoeDatademographic() {
      vm.eoeDatademographic.$save()
        .then(function (result) {
          Messages.addMessage('The EoeDatademographic "' + result.name + '" was saved.', 'success');
          EoeDatademographic.listEoeDatademographic();
        })
        .catch(function (error) {
          Messages.addMessage('There was a problem saving the EoeDatademographic ' + error.data.message, 'error');
        });
    }

    function calculateDates () {
      vm.eoeDatademographic.calculateDates();
    }

    function setupEoeDatademographic() {
      vm.eoeDatademographic.isActive = true;
    }

    function toggleDatePicker(event, datePicker) {
      var datePickerOpenName = datePicker + 'Open';
      vm.datePickerStates[datePickerOpenName] = !vm.datePickerStates[datePickerOpenName];
    }

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation
      Navigation.breadcrumbs.add('EoeDatademographic', '#!/eoeDatademographic', '#!/eoeDatademographic'); // add a breadcrumb
      /** @type Array Actions we wish to add to the Navigation that we define locally **/
      var controllerActions = [
        {title: 'Save EoeDatademographic', method: vm.saveEoeDatademographic, type: 'button', style: 'btn-save', disableIf: vm.disableSaveButton},
        {title: 'Cancel', method: vm.cancel, type: 'button', style: 'btn-cancel'}
      ];

      var actions = EoeDatademographic.getActions(); // get the actions from the Model
      actions.splice(0, 3); // splice out the ones we don't want (were taking them all out here)
      actions = _.union(actions, controllerActions); // merge together actions defined in the controller with those from the Model
      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('Create EoeDatademographic'); // set the page title
    }



    function activate() {
      setupEoeDatademographic();
      calculateDates();
      setupNavigation();
      getValueLists();
    }
  }
})();
