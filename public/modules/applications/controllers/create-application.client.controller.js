(function () {
  'use strict';
  angular
    .module('applications')
    .controller('CreateApplicationController', CreateApplicationController);
  
  function CreateApplicationController($stateParams, resolvedAuth, Messages, Application, Applicant, Opening, Navigation, _ ) {
    var vm = this;
    vm.user = resolvedAuth;
    vm.application = new Application();
    vm.saveApplication = saveApplication;
    vm.submitApplication = submitApplication;
    vm.options = {};

    activate();

    function activate() {
      if(!vm.user.hasRole(['admin', 'committee member'])) {

        Opening.getForPublic({
          openingId: $stateParams.openingId
        }).$promise
          .then(function (result) {
            vm.opening = result;
            vm.application.opening = vm.opening._id;
            setupPublicNavigation();
          })
          .catch(function (err) {
            Messages.addMessage(err.data.message, 'error');
          });
        vm.application.applicant = null;
        return 'done';
      }

      setupNavigation();
      getValueLists();
    }

    function submitApplication() {
      vm.application.createApplication()
        .then(function (uploadResponse) {
          //vm.application.$save()
          //  .then(function (saveResponse) {
          //    Messages.addMessage('Your Application was successfully submitted');
          //    Opening.listCurrentOpenings();
          //  })
          //  .catch(function (err) {
          //    Messages.addMessage(err.data.message, 'error');
          //  });
        });
    }

    function saveApplication() {
      vm.application.$save()
        .then(function (result) {
          Messages.addMessage('The Application was saved.', 'success');
          Application.listApplications();
        })
        .catch(function (error) {
          Messages.addMessage('There was a problem saving the Application ' + error.data.message, 'error');
        });
    }

    function getValueLists() {
      Opening.query().$promise
        .then(function(result) {
          vm.options.openings = result;
        })
        .catch(function(error) {
          Messages.addMessage(error.data.message, 'error');
        });
      Applicant.query().$promise
        .then(function(result) {
          vm.options.applicants = result;
        })
        .catch(function(error) {
          Messages.addMessage(error.data.message, 'error');
        });
    }

    function setupPublicNavigation() {
      Navigation.clear();
      Navigation.breadcrumbs.add('Openings', '#!/openings', '#!/openings');
      Navigation.breadcrumbs.add( vm.opening.name, '#!/openings/' + $stateParams.openingId, '#!/openings/' + $stateParams.openingId);
      Navigation.viewTitle.set('Apply for Opening');
    }

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation
      Navigation.breadcrumbs.add('Applications', '#!/applications', '#!/applications'); // add a breadcrumb
      /** @type Array Actions we wish to add to the Navigation that we define locally **/
      var controllerActions = [
        {title: 'Save Application', method: vm.saveApplication, type: 'button', style: 'btn-save', disableIf: vm.disableSaveButton},
        {title: 'Cancel', method: vm.cancel, type: 'button', style: 'btn-cancel'}
      ];

      var actions = Application.getActions(); // get the actions from the Model
      actions.splice(0, 3); // splice out the ones we don't want (were taking them all out here)
      actions = _.union(actions, controllerActions); // merge together actions defined in the controller with those from the Model
      Navigation.actions.addMany(actions); // add the actions to the Navigation service


      Navigation.viewTitle.set('Create Application'); // set the page title
    }
  }
})();
