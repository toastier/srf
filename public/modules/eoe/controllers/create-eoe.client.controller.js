(function () {
  'use strict';
  angular
    .module('eoe')
    .controller('CreateEoeController', CreateEoeController);

  /* @ngInject */
  function CreateEoeController(Messages, Navigation, Opening, Eoe, _) {
    /* jshint validthis: true */
    var vm = this;

    vm.disableSaveButton = disableSaveButton;
    vm.cancel = cancel;
    vm.eoe = new Eoe();
    vm.eoe.disability = 'Yes';
    vm.saveEoe = saveEoe;
    //vm.saveEoeDisability = saveEoeDisability;
    vm.options = { };

    activate();

    function cancel() {
      //Eoe.();
    }

    function disableSaveButton() {
      return angular.isUndefined(vm.eoeForm) || vm.eoeForm.$invalid || vm.eoeForm.$pristine;
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
        { code: 'black', description: 'Black or African American' },
        { code: 'pacific', description: 'Native Hawaiian or Other Pacific Islander' },
        { code: 'white', description: 'White' },
        { code: 'other', description: 'Other' }
      ];
      vm.options.vetClasses = [
        { code: 'disabled', description: 'Disabled Veteran' },
        { code: 'recent', description: 'Recently Separated Veteran' },
        { code: 'active', description: 'Active Duty Wartime or Campaign Badge Veteran' },
        { code: 'medal', description: 'Armed Forces Service Medal Veteran' }
      ];
    }

    function fillPositionInfo() {
      var position = getPosition(vm.eoe.position);
      vm.eoe.name = position.name;
      vm.eoe.details = position.details;
    }

    function saveEoe() {
      console.log('Saving EOE...');
      vm.eoe.$save()
        .then(function (result) {
          Messages.addMessage('The Eoe "' + result.name + '" was saved.', 'success');
          Eoe.listEoe();
        })
        .catch(function (error) {
          Messages.addMessage('There was a problem saving the Eoe ' + error.data.message, 'error');
        });
      //vm.eoeDisability.$save()
      //  .then(function (result) {
      //    Messages.addMessage('The Eoe disability data "' + result.name + '" was saved.', 'success');
      //    //Eoe.listEoe();
      //  })
      //  .catch(function (error) {
      //    Messages.addMessage('There was a problem saving the Eoe Disability ' + error.data.message, 'error');
      //  });
    }

    function calculateDates () {
      vm.eoe.calculateDates();
    }

    function setupEoe() {
      vm.eoe.isActive = true;
    }

    function toggleDatePicker(event, datePicker) {
      var datePickerOpenName = datePicker + 'Open';
      vm.datePickerStates[datePickerOpenName] = !vm.datePickerStates[datePickerOpenName];
    }

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation
      //Navigation.breadcrumbs.add('Eoe', '#!/eoe', '#!/eoe'); // add a breadcrumb
      /** @type Array Actions we wish to add to the Navigation that we define locally **/
      var controllerActions = [
        {title: 'Submit', method: vm.saveEoe, type: 'button', style: 'btn-save', disableIf: vm.disableSaveButton},
        {title: 'Cancel', method: vm.cancel, type: 'button', style: 'btn-cancel'}
      ];

      var actions = Eoe.getActions(); // get the actions from the Model
      actions.splice(0, 3); // splice out the ones we don't want (were taking them all out here)
      actions = _.union(actions, controllerActions); // merge together actions defined in the controller with those from the Model
      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('EOE Survey'); // set the page title
    }



    function activate() {
      setupEoe();
      setupNavigation();
      getValueLists();
    }
  }
})();
