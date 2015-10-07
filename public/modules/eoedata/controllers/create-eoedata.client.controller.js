(function () {
  'use strict';
  angular
    .module('eoeDataDemographics')
    .controller('CreateEoeDataDemographicsController', CreateEoeDataDemographicsController);

  /* @ngInject */
  function CreateEoeDataDemographicsController(Authentication, Messages, Navigation, EoeDataDemographics, Position, _) {
    /* jshint validthis: true */
    var vm = this;
    vm.authentication = Authentication.init();
    vm.disableSaveButton = disableSaveButton;
    vm.cancel = cancel;
    vm.datePickerStates = {dateCloseOpen: false, datePostedOpen: false, dateRequestedOpen: false, dateStartOpen: false};
    vm.fillPositionInfo = fillPositionInfo;
    vm.eoeDataDemographics = new EoeDataDemographics();
    vm.saveEoeDataDemographics = saveEoeDataDemographics;
    vm.toggleDatePicker = toggleDatePicker;
    vm.options = {};

    activate();

    function cancel() {
      EoeDataDemographics.listEoeDataDemographics();
    }

    function disableSaveButton() {
      return angular.isUndefined(vm.eoeDataDemographicsForm) || vm.eoeDataDemographicsForm.$invalid || vm.eoeDataDemographicsForm.$pristine;
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
      var position = getPosition(vm.eoeDataDemographics.position);
      vm.eoeDataDemographics.name = position.name;
      vm.eoeDataDemographics.details = position.details;
    }

    function saveEoeDataDemographics() {
      vm.eoeDataDemographics.$save()
        .then(function (result) {
          Messages.addMessage('The EoeDataDemographics "' + result.name + '" was saved.', 'success');
          EoeDataDemographics.listEoeDataDemographics();
        })
        .catch(function (error) {
          Messages.addMessage('There was a problem saving the EoeDataDemographics ' + error.data.message, 'error');
        });
    }

    function calculateDates () {
      vm.eoeDataDemographics.calculateDates();
    }

    function setupEoeDataDemographics() {
      vm.eoeDataDemographics.isActive = true;
    }

    function toggleDatePicker(event, datePicker) {
      var datePickerOpenName = datePicker + 'Open';
      vm.datePickerStates[datePickerOpenName] = !vm.datePickerStates[datePickerOpenName];
    }

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation
      Navigation.breadcrumbs.add('EoeDataDemographics', '#!/eoeDataDemographics', '#!/eoeDataDemographics'); // add a breadcrumb
      /** @type Array Actions we wish to add to the Navigation that we define locally **/
      var controllerActions = [
        {title: 'Save EoeDataDemographics', method: vm.saveEoeDataDemographics, type: 'button', style: 'btn-save', disableIf: vm.disableSaveButton},
        {title: 'Cancel', method: vm.cancel, type: 'button', style: 'btn-cancel'}
      ];

      var actions = EoeDataDemographics.getActions(); // get the actions from the Model
      actions.splice(0, 3); // splice out the ones we don't want (were taking them all out here)
      actions = _.union(actions, controllerActions); // merge together actions defined in the controller with those from the Model
      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('Create EoeDataDemographics'); // set the page title
    }



    function activate() {
      setupEoeDataDemographics();
      calculateDates();
      setupNavigation();
      getValueLists();
    }
  }
})();
