(function () {
  'use strict';
  angular
    .module('applications')
    .controller('ManageApplicationController', ManageApplicationController);

  function ManageApplicationController ($stateParams, resolvedAuth, Messages, Application, Navigation, _ ) {
    var vm = this;
    vm.user = resolvedAuth;
    vm.cancel = Application.listApplications;
    vm.options = {};
    vm.remove = remove;
    vm.removeFile = removeFile;
    vm.toggleSwitch = toggleSwitch;
    vm.update = update;
    vm.view = view;

    activate();

    function activate() {
      Application.get({
        applicationId: $stateParams.applicationId
      }).$promise
        .then(function(result) {
          vm.application = result;
        })
        .catch(function(err) {
          Messages.addMessage(err.data.message, 'error');
        });

      setupNavigation();
    }

    function removeFile(fileId) {
      Application.removeFile({
        applicationId: $stateParams.applicationId,
        fileId: fileId
      }).$promise
        .then(function() {
          if(vm.application.cv === fileId) {
          vm.application.cv = null;
          vm.application.cvFileMeta = null;
          }
          if(vm.application.coverLetter === fileId) {
            vm.application.coverLetter = null;
            vm.application.coverLetterFileMeta = null;
          }
        })
        .catch(function (err) {
          Messages.addMessage(err.data.message, 'error');
        });


    }

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation
      Navigation.breadcrumbs.add('Applications', '#!/applications', '#!/applications'); // add a breadcrumb
      /** @type Array Actions we wish to add to the Navigation that we define locally **/
      var controllerActions = [
        {title: 'Save Changes', method: vm.update, type: 'button', style: 'btn-save', disableIf: vm.disableSaveButton},
        {title: 'View', method: vm.view, type: 'button', style: 'btn-view'},
        {title: 'Cancel', method: vm.cancel, type: 'button', style: 'btn-cancel'}
      ];

      var actions = Application.getActions(); // get the actions from the Model
      actions.splice(0, 3); // splice out the ones we don't want (were taking them all out here)
      actions = _.union(actions, controllerActions); // merge together actions defined in the controller with those from the Model
      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('Manage Application'); // set the page title
    }

    function toggleSwitch(event) {
      switch (event.currentTarget.className) {
        case 'switch-on-zone':
          if (vm.application.proceedToReview === null) {
            vm.application.proceedToReview = true;
          } else {
            vm.application.proceedToReview = null;
          }
          break;
        case 'switch-off-zone':
          if (vm.application.proceedToReview === null) {
            vm.application.proceedToReview = false;
          } else {
            vm.application.proceedToReview = null;
          }
      }
    }


    function remove () {

      vm.application.$remove()
        .then(function() {
          Messages.addMessage('The Application was permanently deleted.', 'info');
        })
        .catch(function(err) {
          Messages.addMessage(err.data.message, 'error', 'Problem deleting Application');
        });
    }

    function view () {
      Application.viewApplication(vm.application);
    }

    function update () {

      vm.application.$update()
        .then(function() {
          Messages.addMessage('The Application has been updated', 'success');
        })
        .catch(function(err) {
          Messages.addMessage(err.data.message, 'error', 'Problem updating Application');
        });

    }
  }
})();
