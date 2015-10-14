(function () {
  'use strict';
  angular
    .module('eoeDataDemographic')
    .controller('CreateEoeDataDemographicController', CreateEoeDataDemographicController);

  /* @ngInject */
  function CreateEoeDataDemographicController(Messages, Navigation, Opening, EoeDataDemographic, _) {
    /* jshint validthis: true */
    var vm = this;

    vm.disableSaveButton = disableSaveButton;
    vm.cancel = cancel;
    vm.eoeDataDemographic = new EoeDataDemographic();
    vm.saveEoeDataDemographic = saveEoeDataDemographic;
    vm.options = { 'showCrumbs' : false };

    activate();

    function cancel() {
      //EoeDataDemographic.();
    }

    function disableSaveButton() {
      return angular.isUndefined(vm.eoeDataDemographicForm) || vm.eoeDataDemographicForm.$invalid || vm.eoeDataDemographicForm.$pristine;
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
      Opening.query().$promise
          .then(function(result) {
            vm.options.openings = result;
          })
          .catch(function(error) {
            Messages.addMessage(error.data.message, 'error');
          });
      vm.options.races = [
        { code: 'native', description: 'American Indian or Alaskan Native' },
        { code: 'black', description: 'Black or Afranic American' },
        { code: 'pacific', description: 'Native Hawaiian or Other Pacific Islander' },
        { code: 'white', description: 'White' },
        { code: 'other', description: 'Other' }
      ];
    }

    function getRaces() {
      vm.options.races = [
        { code: 'native', description: 'American Indian or Alaskan Native' },
        { code: 'black', description: 'Black or Afranic American' },
        { code: 'pacific', description: 'Native Hawaiian or Other Pacific Islander' },
        { code: 'white', description: 'White' },
        { code: 'other', description: 'Other' }
      ];
    }

    function fillPositionInfo() {
      var position = getPosition(vm.eoeDataDemographic.position);
      vm.eoeDataDemographic.name = position.name;
      vm.eoeDataDemographic.details = position.details;
    }

    function saveEoeDataDemographic() {
      vm.eoeDataDemographic.$save()
        .then(function (result) {
          Messages.addMessage('The EoeDataDemographic "' + result.name + '" was saved.', 'success');
          EoeDataDemographic.listEoeDataDemographic();
        })
        .catch(function (error) {
          Messages.addMessage('There was a problem saving the EoeDataDemographic ' + error.data.message, 'error');
        });
    }

    function calculateDates () {
      vm.eoeDataDemographic.calculateDates();
    }

    function setupEoeDataDemographic() {
      vm.eoeDataDemographic.isActive = true;
    }

    function toggleDatePicker(event, datePicker) {
      var datePickerOpenName = datePicker + 'Open';
      vm.datePickerStates[datePickerOpenName] = !vm.datePickerStates[datePickerOpenName];
    }

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation
      Navigation.breadcrumbs.add('EoeDataDemographic', '#!/eoeDataDemographic', '#!/eoeDataDemographic'); // add a breadcrumb
      /** @type Array Actions we wish to add to the Navigation that we define locally **/
      var controllerActions = [
        {title: 'Save EoeDataDemographic', method: vm.saveEoeDataDemographic, type: 'button', style: 'btn-save', disableIf: vm.disableSaveButton},
        {title: 'Cancel', method: vm.cancel, type: 'button', style: 'btn-cancel'}
      ];

      var actions = EoeDataDemographic.getActions(); // get the actions from the Model
      actions.splice(0, 3); // splice out the ones we don't want (were taking them all out here)
      actions = _.union(actions, controllerActions); // merge together actions defined in the controller with those from the Model
      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('Create EoeDataDemographic'); // set the page title
    }



    function activate() {
      setupEoeDataDemographic();
      setupNavigation();
      getRaces();
    }
  }
})();
