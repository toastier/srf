(function () {
  'use strict';
  angular
    .module('applicants')
    .controller('ViewApplicantController', ViewApplicantController);

  function ViewApplicantController($stateParams, resolvedAuth, Navigation, Applicant) {
    var vm = this;
    vm.user = resolvedAuth;

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
      var actions = Applicant.getActions(); // get the actions from the Model
      if(vm.user.hasRole(['admin'])) {
        actions.splice(0, 2); // for admin and director, splice out actions other than 'edit'
      } else {
        actions.splice(0, actions.length); // for anyone else, splice out everything.
      }
      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('View Applicant'); // set the page title
    }

  }

})();
