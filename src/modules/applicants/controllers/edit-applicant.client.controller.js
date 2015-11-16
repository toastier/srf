(function () {
  'use strict';
  angular
    .module('applicants')
    .controller('EditApplicantController', EditApplicantController);

  function EditApplicantController($stateParams, resolvedAuth, Navigation, Applicant, Messages, _ ) {
    var vm = this;
    vm.user = resolvedAuth;
    vm.remove = remove;
    vm.update = update;
    vm.cancel = Applicant.listApplicants;
    vm.datePickerStates = {PositionExpectedCompletionDate: false };
    vm.toggleDatePicker = toggleDatePicker;
    vm.options = {};
    vm.options.focalAreas = Applicant.getFocalAreaOptions();
    vm.view = view;

    activate();

    function activate() {
      Applicant.get({
        applicantId: $stateParams.applicantId
      }).$promise.then(function (result) {
          vm.applicant = result;
        });

      setupNavigation();
    }

    function setupNavigation () {
      Navigation.clear(); // clear everything in the Navigation
      Navigation.breadcrumbs.add('Applicants', '#!/applicants', '#!/applicants'); // add a breadcrumb
      /** @type Array Actions we wish to add to the Navigation that we define locally **/
      var controllerActions = [
        {title: 'Save', method: vm.update, type: 'button', style: 'btn-save', disableIf: vm.disableSaveButton},
        {title: 'Cancel', method: vm.cancel, type: 'button', style: 'btn-cancel'},
        {title: 'Delete', method: vm.remove, type: 'button', style: 'btn-delete'},
        {title: 'View', method: vm.view, type: 'button', style: 'btn-view'}
      ];

      var actions = Applicant.getActions(); // get the actions from the Model
      actions.splice(0, 3); // splice out the ones we don't want (were taking them all out here)
      actions = _.union(actions, controllerActions); // merge together actions defined in the controller with those from the Model
      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('Edit Applicant'); // set the page title
    }

    /**
     * toggle the datePicker
     * @param event
     * @param {Object | string} datePicker
     */
    function toggleDatePicker(event, datePicker) {
      // to accommodate repeating elements, we need to accept an Object reference, on which we will set the toggle property
      if(angular.isObject(datePicker)) {
        /** @type Object **/
        var object = datePicker;
        if(angular.isUndefined(object.datePickerOpen)) {
          object.datePickerOpen = true;
        } else {
          object.datePickerOpen = !object.datePickerOpen;
        }
      } else {
        // if the given is not an Object assume string, and set the toggle variable on the viewModel
        var datePickerOpenName = datePicker + 'Open';
        vm.datePickerStates[datePickerOpenName] = !vm.datePickerStates[datePickerOpenName];
      }
    }

    function remove () {

      vm.applicant.$remove()
        .then(function() {
          Messages.addMessage('The Applicant was permanently deleted.', 'info');
        })
        .catch(function(err) {
          Messages.addMessage(err.data.message, 'error', 'Problem deleting Applicant');
        });
    }

    function update () {

      vm.applicant.$update()
        .then(function(result) {
          Messages.addMessage('The Applicant ' + result.name.firstName + ' ' + result.name.lastName + ' has been updated', 'success');
        })
        .catch(function(err) {
          Messages.addMessage(err.data.message, 'error', 'Problem updating Applicant');
        });

    }

    function view () {
      vm.applicant.viewApplicant(vm.applicant);
    }


  }
})();
