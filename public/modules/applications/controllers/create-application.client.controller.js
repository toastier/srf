(function () {
  'use strict';
  angular
    .module('applications')
    .controller('CreateApplicationController', CreateApplicationController);
  
  function CreateApplicationController($scope, $state, $stateParams, resolvedAuth, Messages, Application, Applicant, Opening, Navigation, _ ) {
    var vm = this;
    vm.user = resolvedAuth;
    vm.application = new Application();
    vm.options = {};
    vm.createApplication = createApplication;
    vm.saveApplication = saveApplication;
    vm.submitApplication = submitApplication;
    vm.uploadFile = uploadFile;
    vm.previousApplicationSubmitted = null;
    vm.removeCoverLetter = removeCoverLetter;
    vm.removeCv = removeCv;

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

        $scope.$watch('vm.user', function(newVal) {
          if(vm.user._id) {
            processUser(newVal);
          }
        }, true);

        return true;
      }

      setupNavigation();
      getValueLists();
    }

    /**
     * Check to see if the User already has an Application for this Opening
     * @param user
     */
    function processUser(user) {
      Application.checkForExistingUserApplication({openingId: $stateParams.openingId}).$promise
        .then(function(application) {
          if(application._id) {
            if(application.submitted) {
              //@todo make this message stick around longer
              Messages.addMessage('Our records indicate that you have already applied for this Opening.  You may only ' +
                'apply once for any given Opening.');
              vm.previousApplicationSubmitted = true;
              $state.go('main.listOpenings');
            } else {
              //@todo make this message stick around longer
              Messages.addMessage('Looks like you had previously started an Application for this Opening. ' +
                'we have loaded that Application so that you can complete and submit it.');
              vm.previousApplicationSubmitted = false;
              vm.application = application;
            }
          } else {
            updateApplicationUserInfo(user);
          }
        })
        .catch(function (err) {
          Messages.addMessage(err.data.message, 'error');
        });
    }

    function updateApplicationUserInfo(user) {
      vm.application.firstName = user.firstName;
      vm.application.lastName = user.lastName;
      vm.application.honorific = user.honorific;
      vm.application.middleName = user.middleName;
      vm.application.user = user._id;
    }

    function uploadFile(file, type) {
      if (type === 'coverLetter') {
        vm.coverLetterFile = file;
      } else {
        vm.cvFile = file;
      }
      vm.application.uploadFile(file)
        .then(function (response) {
          if(type === 'coverLetter') {
            vm.application.coverLetter = response.data.fileId;
          } else {
            vm.application.cv = response.data.fileId;
          }
        });
    }

    function removeCoverLetter() {
      vm.coverLetterFile = null;
      vm.application.coverLetter = null;
      //@todo delete the file from Mongo
    }

    function removeCv() {
      vm.cvFile = null;
      vm.application.cv = null;
      //@todo delete teh file from Mongo
    }

    function submitApplication() {
      vm.application.submitted = true;
      Application.update(vm.application).$promise
        .then(function (saveResponse) {
          Messages.addMessage('The Application for ' + saveResponse.firstName + ' ' + saveResponse.lastName + ' was Submitted.');
          Opening.listCurrentOpenings();
        })
        .catch(function (err) {
          vm.application.submitted = false;
          Messages.addMessage(err.data.message, 'error');
        });
    }

    function createApplication() {
      vm.application.user = vm.user._id;
      Application.create(vm.application).$promise
        .then(function (application) {
          Messages.addMessage('Details Saved for ' + application.firstName + ' ' + application.lastName);
          vm.application = application;
        })
        .catch(function (err) {
          Messages.addMessage(err.data.message, 'error');
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
