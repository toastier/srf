(function () {
  'use strict';
  angular
    .module('applications')
    .controller('ViewApplicationController', ViewApplicationController);

  function ViewApplicationController($stateParams, resolvedAuth, Application, Navigation, Messages ) {

    var vm = this;
    vm.user = resolvedAuth;
    vm.manageApplication = manageApplication;

    activate();

    ////////////////

    function activate() {
      Navigation.clear();
      Navigation.viewTitle.set('View Application');

      Application.get({applicationId: $stateParams.applicationId}).$promise
        .then(function (application) {
          vm.application = application;
        })
        .catch(function (err) {
          Messages.addMessage(err.data.message, 'error');
        });
      setupNavigation();
    }

    function manageApplication() {
      Application.manageApplication(vm.application);
    }

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation
      Navigation.breadcrumbs.add('Applications', '#!/applications', '#!/applications'); // add a breadcrumb
      /** @type Array Actions we wish to add to the Navigation that we define locally **/
      if(vm.user.hasRole(['admin', 'manager'])){
        var controllerActions = [
          {title: 'Manage Application', method: vm.manageApplication, type: 'button', style: 'btn-manage', disableIf: vm.disableSaveButton}

        ];
        Navigation.actions.addMany(controllerActions); // add the actions to the Navigation service
      }


    }
  }
})();
