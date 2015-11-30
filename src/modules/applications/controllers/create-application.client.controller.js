(function () {
  'use strict';
  angular
    .module('applications')
    .controller('CreateApplicationController', CreateApplicationController);

  function CreateApplicationController($scope, $state, $stateParams, $location, resolvedAuth, Messages, Application, Opening, Navigation) {
    var vm = this;
    vm.user = resolvedAuth;
    vm.application = new Application();
    vm.options = {};
    vm.createApplication = createApplication;
    vm.saveApplication = saveApplication;
    vm.submitApplication = submitApplication;
    vm.uploadFile = uploadFile;
    vm.previousApplicationSubmitted = null;
    vm.removeFile = removeFile;

    activate();

    function activate() {
      if (!vm.user.hasRole(['admin', 'manager'])) {

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

        $scope.$watch('vm.user', function (newVal) {
          if (vm.user._id) {
            processUser(newVal);
          }
        }, true);

        //return true;
      }
    }

    function createApplication() {
      vm.application.user = vm.user._id;
      Application.createByUser(vm.application).$promise
        .then(function (application) {
          Messages.addMessage('Details Saved for ' + application.firstName + ' ' + application.lastName);
          vm.application = application;
        })
        .catch(function (err) {
          Messages.addMessage(err.data.message, 'error');
        });
    }

    /**
     * Check to see if the User already has an Application for this Opening
     * @param {Object} user
     */
    function processUser(user) {
      Application.checkForExistingUserApplication({openingId: $stateParams.openingId}).$promise
        .then(function (application) {
          if (application._id) {
            if (application.submitted) {
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

    function removeFile(fileId) {
      Application.removeFile({
        applicationId: vm.application._id,
        fileId: fileId
      }).$promise
        .then(function () {
          if (vm.application.cv === fileId) {
            vm.application.cv = null;
            vm.application.cvFileMeta = null;
          }
          if (vm.application.coverLetter === fileId) {
            vm.application.coverLetter = null;
            vm.application.coverLetterFileMeta = null;
          }
        })
        .catch(function (err) {
          Messages.addMessage(err.data.message, 'error');
        });
    }

    function saveApplication() {
      vm.application.$save()
        .then(function () {
          Messages.addMessage('The Application was saved.', 'success');
          Application.listApplications();
        })
        .catch(function (error) {
          Messages.addMessage('There was a problem saving the Application ' + error.data.message, 'error');
        });
    }

    function setupPublicNavigation() {
      Navigation.clear();
      Navigation.breadcrumbs.add('Openings', '#!/openings', '#!/openings');
      Navigation.breadcrumbs.add(vm.opening.name, '#!/openings/' + $stateParams.openingId, '#!/openings/' + $stateParams.openingId);
      Navigation.viewTitle.set('Apply for Opening');
    }

    function submitApplication() {
      vm.application.submitted = true;
      Application.update(vm.application).$promise
        .then(function (saveResponse) {
          Messages.addMessage('The Application for ' + saveResponse.firstName + ' ' + saveResponse.lastName + ' was Submitted.');
          //TODO convert this to an EEO method
          Application.emailConfirmationApplicant(vm.application);
          $location.path('/eeo/' + saveResponse._id);
        })
        .catch(function (err) {
          vm.application.submitted = false;
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
      if (type !== 'coverLetter' && type !== 'cv') {
        type = 'additionalFiles';
      }
      if (type === 'coverLetter') {
        vm.application.coverLetter = file;
      } else if (type === 'cv') {
        vm.application.cv = file;
      }
      vm.application.uploadFile(file, type, vm.application._id)
        .then(function (response) {
          if (type === 'coverLetter') {
            vm.application.coverLetter = response.data.coverLetter;
            vm.application.coverLetterFileMeta = response.data.coverLetterFileMeta;
          } else {
            vm.application.cv = response.data.cv;
            vm.application.cvFileMeta = response.data.cvFileMeta;
          }
        });
    }
  }
})();
