(function () {
  'use strict';
  angular
    .module('openings')
    .controller('CreateOpeningController', CreateOpeningController);

  /* @ngInject */
  function CreateOpeningController(Authentication, Messages, Navigation, Opening, Position, _) {
    /* jshint validthis: true */
    var vm = this;
    vm.authentication = Authentication.init();
    vm.disableSaveButton = disableSaveButton;
    vm.cancel = cancel;
    vm.datePickerStates = {dateCloseOpen: false, datePostedOpen: false, dateRequestedOpen: false, dateStartOpen: false};
    vm.fillPositionInfo = fillPositionInfo;
    vm.opening = new Opening();
    vm.saveOpening = saveOpening;
    vm.toggleDatePicker = toggleDatePicker;
    vm.options = {};

    activate();

    function cancel() {
      Opening.listOpenings();
    }

    function disableSaveButton() {
      return angular.isUndefined(vm.openingForm) || vm.openingForm.$invalid || vm.openingForm.$pristine;
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
      var position = getPosition(vm.opening.position);
      vm.opening.name = position.name;
      vm.opening.details = position.details;
    }

    function saveOpening() {
      vm.opening.$save()
        .then(function (result) {
          Messages.addMessage('The Opening "' + result.name + '" was saved.', 'success');
          Opening.listOpenings();
        })
        .catch(function (error) {
          Messages.addMessage('There was a problem saving the Opening ' + error.data.message, 'error');
        });
    }

    function calculateDates () {
      vm.opening.calculateDates();
    }

    function setupOpening() {
      vm.opening.isActive = true;
    }

    function toggleDatePicker(event, datePicker) {
      var datePickerOpenName = datePicker + 'Open';
      vm.datePickerStates[datePickerOpenName] = !vm.datePickerStates[datePickerOpenName];
    }

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation
      Navigation.breadcrumbs.add('Openings', '#!/openings', '#!/openings'); // add a breadcrumb
      /** @type Array Actions we wish to add to the Navigation that we define locally **/
      var controllerActions = [
        {title: 'Save Opening', method: vm.saveOpening, type: 'button', style: 'btn-save', disableIf: vm.disableSaveButton},
        {title: 'Cancel', method: vm.cancel, type: 'button', style: 'btn-cancel'}
      ];

      var actions = Opening.getActions(); // get the actions from the Model
      actions.splice(0, 3); // splice out the ones we don't want (were taking them all out here)
      actions = _.union(actions, controllerActions); // merge together actions defined in the controller with those from the Model
      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('Create Opening'); // set the page title
    }



    function activate() {
      setupOpening();
      calculateDates();
      setupNavigation();
      getValueLists();
    }
  }
})();
