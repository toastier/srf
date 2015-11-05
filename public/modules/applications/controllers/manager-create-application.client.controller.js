(function () {
  'use strict';
  angular
    .module('applications')
    .controller('ManagerCreateApplicationController', ManagerCreateApplicationController);

  function ManagerCreateApplicationController($scope, $stateParams, _, resolvedAuth, Application, Applicant, Opening, Messages, Navigation, utility) {

    var vm = this;
    vm.user = resolvedAuth;
    vm.application = new Application();
    vm.options = {};
    vm.opening = {};
    vm.cancel = cancel;
    vm.managerCreateApplication = managerCreateApplication;
    vm.setApplicant = setApplicant;
    vm.setOpening = setOpening;
    vm.removeFile = removeFile;
    vm.uploadFile = uploadFile;
    vm.submitApplication = submitApplication;

    activate();

    function activate() {
      getValueLists();
      setupNavigation();
    }

    function cancel() {
      Application.listApplications();
    }

    function getValueLists() {
      Opening.query().$promise
        .then(function(result) {
          vm.options.openings = result;
          if($stateParams.openingId) {
            vm.application.opening = $stateParams.openingId;
            setOpening();
          }
        })
        .catch(function(error) {
          Messages.addMessage(error.data.message, 'error');
        });
      Applicant.query().$promise
        .then(function(result) {
          vm.options.applicants = result;
          if($stateParams.applicantId) {
            vm.application.applicant = $stateParams.applicantId;
            setApplicant();
          }
        })
        .catch(function(error) {
          Messages.addMessage(error.data.message, 'error');
        });
    }

    function getOpeningProperty(property) {
      var openings = vm.options.openings;
      var matched = false;
      _.forEach(openings, function (opening) {
        if(!matched && vm.application.opening === opening._id) {
          matched = utility.getIndex(opening, property);
        }
      });
      return matched;
    }

    function getApplicantProperty(property) {
      var applicants = vm.options.applicants;
      var matched = false;
      _.forEach(applicants, function (applicant) {
        if(!matched && vm.application.applicant === applicant._id) {
          matched = utility.getIndex(applicant, property);
        }
      });
      return matched;
    }

    function managerCreateApplication() {
      Application.save(vm.application).$promise
        .then(function (application) {
          Messages.addMessage('Details Saved for ' + application.firstName + ' ' + application.lastName);
          vm.application = application;
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

    function setApplicant() {
      vm.application.user = getApplicantProperty('user');
      vm.application.honorific = getApplicantProperty('name.honorific');
      vm.application.firstName = getApplicantProperty('name.firstName');
      vm.application.middleName = getApplicantProperty('name.middleName');
      vm.application.lastName = getApplicantProperty('name.lastName');

    }

    function setOpening() {
      vm.opening.name = getOpeningProperty('name');
      vm.opening.dateStart = getOpeningProperty('dateStart');
      vm.opening.dateClose = getOpeningProperty('dateClose');
    }

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation
      Navigation.breadcrumbs.add('Applications', '#!/applications', '#!/applications'); // add a breadcrumb
      /** @type Array Actions we wish to add to the Navigation that we define locally **/
      var controllerActions = [
        {title: 'Cancel', method: vm.cancel, type: 'button', style: 'btn-cancel'}
      ];

      var actions = Application.getActions(); // get the actions from the Model
      actions.splice(0, 3); // splice out the ones we don't want (were taking them all out here)
      actions = _.union(actions, controllerActions); // merge together actions defined in the controller with those from the Model
      Navigation.actions.addMany(actions); // add the actions to the Navigation service


      Navigation.viewTitle.set('Create Application'); // set the page title
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

    function uploadFile(file, type) {
      if (type !== 'coverLetter' && type !== 'cv') {
        type = 'additionalFiles';
      }
      if (type === 'coverLetter') {
        vm.application.coverLetter = file;
      } else if(type === 'cv') {
        vm.application.cv = file;
      }
      vm.application.uploadFile(file, type, vm.application._id)
        .then(function (response) {
          if(type === 'coverLetter') {
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
