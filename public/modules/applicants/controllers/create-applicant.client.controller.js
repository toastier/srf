(function () {
  'use strict';
  angular
    .module('applicants')
    .controller('CreateApplicantController', CreateApplicantController);

  function CreateApplicantController(Navigation, resolvedAuth, Applicant, Messages) {
    var vm = this;
    vm.user = resolvedAuth;
    vm.saveApplicant = saveApplicant;
    vm.applicant = new Applicant();
    vm.cancel = Applicant.listApplicants;
    vm.options = {};
    vm.options.focalAreas = Applicant.getFocalAreaOptions();

    activate();

    function activate() {
      setupNavigation();
    }

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation
      Navigation.breadcrumbs.add('Applicants', '#!/applicants', '#!/applicants'); // add a breadcrumb
      /** @type Array Actions we wish to add to the Navigation that we define locally **/
      var actions = [
        {title: 'Save Applicant', method: vm.saveApplicant, type: 'button', style: 'btn-save', disableIf: vm.disableSaveButton},
        {title: 'Cancel', method: vm.cancel, type: 'button', style: 'btn-cancel'}
      ];

      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('Create Applicant'); // set the page title
    }

    function saveApplicant () {
      vm.applicant.$save()
        .then(function (response) {
          vm.applicant.viewApplicant(response);
          Messages.addMessage('The Applicant was added', 'success');
        })
        .catch(function (err) {
          Messages.addMessage(err.data.message, 'error', 'Problem adding Applicant');
        });
    }

  }
})();
