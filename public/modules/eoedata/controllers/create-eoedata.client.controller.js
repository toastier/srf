(function () {
  'use strict';
  angular
    .module('eoedata')
    .controller('CreateEoedataController', CreateEoedataController);

  /* @ngInject */
  function CreateEoedataController(Authentication, Messages, Navigation, Eoedata, Position, _) {
    /* jshint validthis: true */
    var vm = this;
    vm.authentication = Authentication.init();
    vm.disableSaveButton = disableSaveButton;
    vm.cancel = cancel;
    vm.datePickerStates = {dateCloseOpen: false, datePostedOpen: false, dateRequestedOpen: false, dateStartOpen: false};
    vm.fillPositionInfo = fillPositionInfo;
    vm.eoedata = new Eoedata();
    vm.saveEoedata = saveEoedata;
    vm.toggleDatePicker = toggleDatePicker;
    vm.options = {};

    activate();

    function cancel() {
      Eoedata.listEoedata();
    }

    function disableSaveButton() {
      return angular.isUndefined(vm.eoedataForm) || vm.eoedataForm.$invalid || vm.eoedataForm.$pristine;
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
      var position = getPosition(vm.eoedata.position);
      vm.eoedata.name = position.name;
      vm.eoedata.details = position.details;
    }

    function saveEoedata() {
      vm.eoedata.$save()
        .then(function (result) {
          Messages.addMessage('The Eoedata "' + result.name + '" was saved.', 'success');
          Eoedata.listEoedata();
        })
        .catch(function (error) {
          Messages.addMessage('There was a problem saving the Eoedata ' + error.data.message, 'error');
        });
    }

    function calculateDates () {
      vm.eoedata.calculateDates();
    }

    function setupEoedata() {
      vm.eoedata.isActive = true;
    }

    function toggleDatePicker(event, datePicker) {
      var datePickerOpenName = datePicker + 'Open';
      vm.datePickerStates[datePickerOpenName] = !vm.datePickerStates[datePickerOpenName];
    }

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation
      Navigation.breadcrumbs.add('Eoedata', '#!/eoedata', '#!/eoedata'); // add a breadcrumb
      /** @type Array Actions we wish to add to the Navigation that we define locally **/
      var controllerActions = [
        {title: 'Save Eoedata', method: vm.saveEoedata, type: 'button', style: 'btn-save', disableIf: vm.disableSaveButton},
        {title: 'Cancel', method: vm.cancel, type: 'button', style: 'btn-cancel'}
      ];

      var actions = Eoedata.getActions(); // get the actions from the Model
      actions.splice(0, 3); // splice out the ones we don't want (were taking them all out here)
      actions = _.union(actions, controllerActions); // merge together actions defined in the controller with those from the Model
      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('Create Eoedata'); // set the page title
    }



    function activate() {
      setupEoedata();
      calculateDates();
      setupNavigation();
      getValueLists();
    }
  }
})();
