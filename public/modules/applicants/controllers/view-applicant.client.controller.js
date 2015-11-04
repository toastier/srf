(function () {
  'use strict';
  angular
    .module('applicants')
    .controller('ViewApplicantController', ViewApplicantController);

  function ViewApplicantController($state, $stateParams, resolvedAuth, Navigation, Applicant, _) {
    var vm = this;
    vm.user = resolvedAuth;
    vm.createApplicationForApplicant = createApplicationForApplicant;

    activate();

    function activate() {
      Applicant.get({
        applicantId: $stateParams.applicantId
      }).$promise.then(function (result) {
          vm.applicant = result;
        });
      setupNavigation();
    }

    function createApplicationForApplicant() {
      $state.go('main.managerCreateApplication', {applicantId: $stateParams.applicantId});
    }

    function setupNavigation () {
      Navigation.clear(); // clear everything in the Navigation
      Navigation.breadcrumbs.add('Applicants', '#!/applicants', '#!/applicants'); // add a breadcrumb
      var actions = Applicant.getActions(); // get the actions from the Model
      var controllerActions = [];
      if(vm.user.hasRole(['admin', 'manager'])) {
        actions.splice(0, 2); // for admin and director, splice out actions other than 'edit'
        controllerActions.push({title: 'Create Application', method: vm.createApplicationForApplicant, type: 'button', style: 'btn-add'});
      } else {
        actions.splice(0, actions.length); // for anyone else, splice out everything.
      }
      actions = _.union(actions, controllerActions);
      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('View Applicant'); // set the page title
    }

  }

})();
