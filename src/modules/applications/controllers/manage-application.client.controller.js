(function () {
  'use strict';
  angular
    .module('applications')
    .controller('ManageApplicationController', ManageApplicationController);

  function ManageApplicationController($stateParams, $modal, $q, resolvedAuth, Messages, Application, Navigation, Eeo, _) {
    var vm = this;
    vm.user = resolvedAuth;
    vm.cancel = Application.listApplications;
    vm.changeOpening = changeOpening;
    vm.remove = remove;
    vm.removeFile = removeFile;
    vm.submitApplication = submitApplication;
    vm.update = update;
    vm.uploadFile = uploadFile;
    vm.view = view;
    vm.editReferenceChecks = false;
    vm.editReviewPhaseCollectiveComments = false;
    vm.editPhoneInterviewPhaseCollectiveComments = false;
    vm.intervieweeEeo = {};
    vm.submitEeo = submitEeo;
    vm.parseNote = Application.parseNote;
    vm.insertLineBreaks = Application.insertLineBreaks;
    activate();

    function activate() {
      getApplication();
    }

    function addSubmitApplicationToActions() {
      Navigation.actions.add({title: 'Submit', method: vm.submitApplication, type: 'button', style: 'btn-workflow'});
    }

    function changeOpening() {
      var modalInstance = $modal.open({
        animate: true,
        templateUrl: 'modules/openings/partials/change-opening.client.partial.html',
        controller: 'ChangeOpeningModalController',
        controllerAs: 'vm',
        size: 'md',
        resolve: {
          currentOpening: function () {
            return angular.copy(vm.application.opening);
          }
        }
      });

      modalInstance.result.then(function (result) {
        vm.application.opening = result;
      });

    }

    function getApplication() {
      Application.get({
        applicationId: $stateParams.applicationId
      }).$promise
        .then(function (result) {
          vm.application = result;
          if (!vm.application.submitted) {
            addSubmitApplicationToActions();
          }
          //if (!!vm.application.proceedToReview && !!vm.application.reviewPhase.proceedToPhoneInterview && !!vm.application.phoneInterviewPhase.proceedToOnSite) {
          //  getEeo();
          //}
        })
        .catch(function (err) {
          Messages.addMessage(err.data.message, 'error');
        });
      setupNavigation();
    }

    function uploadFile(file, type) {
      if (type !== 'coverLetter' && type !== 'cv') {
        type = 'additionalFiles';
      }
      vm.application.uploadFile(file, type)
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

    function removeFile(fileId) {
      Application.removeFile({
        applicationId: $stateParams.applicationId,
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

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation
      Navigation.breadcrumbs.add('Applications', '#!/applications', '#!/applications'); // add a breadcrumb
      /** @type Array Actions we wish to add to the Navigation that we define locally **/
      var controllerActions = [
        {title: 'Save Changes', method: vm.update, type: 'button', style: 'btn-save', disableIf: vm.disableSaveButton},
        {title: 'View', method: vm.view, type: 'button', style: 'btn-view'},
        {title: 'Cancel', method: vm.cancel, type: 'button', style: 'btn-cancel'},
        {title: 'Delete', method: vm.remove, type: 'button', style: 'btn-delete'},
        {title: 'Change Opening', method: vm.changeOpening, type: 'button', style: 'btn-change'}
      ];

      var actions = Application.getActions(); // get the actions from the Model
      actions.splice(0, 3); // splice out the ones we don't want (were taking them all out here)
      actions = _.union(actions, controllerActions); // merge together actions defined in the controller with those from the Model
      Navigation.actions.addMany(actions, true); // add the actions to the Navigation service
      Navigation.viewTitle.set('Manage Application'); // set the page title
    }

    function remove() {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'modules/core/partials/yes-no-modal.client.partial.html',
        controller: 'YesNoModalController',
        controllerAs: 'vm',
        size: 'sm',
        resolve: {
          modalTitle: function () {
            return 'Delete Application';
          },
          modalMessage: function () {
            return 'Deleting the Application will permanently remove the application and file(s) associated with it.  Are you sure you want to do this?';
          }
        }
      });

      modalInstance.result.then(function (result) {
        if (result) {
          vm.application.$remove()
            .then(function () {
              Messages.addMessage('The Application was permanently deleted.', 'info');
              Application.listApplications();
            })
            .catch(function (err) {
              Messages.addMessage(err.data.message, 'error', 'Problem deleting Application');
            });
        }
      });
    }

    function submitApplication() {
      vm.application.submitted = true;
      Application.update(vm.application).$promise
        .then(function (saveResponse) {
          Messages.addMessage('The Application for ' + saveResponse.firstName + ' ' + saveResponse.lastName + ' was Submitted.');
          vm.application = saveResponse;
          setupNavigation();
        })
        .catch(function (err) {
          vm.application.submitted = false;
          Messages.addMessage(err.data.message, 'error');
        });
    }

    function view() {
      Application.viewApplication(vm.application);
    }

    function update() {
      vm.application.isNewApplication = false;

      if (!_.isEmpty(vm.intervieweeEeo)) {
        if (!vm.application.onSiteVisitPhase.eeoDemographic) {
          vm.submitEeo()
              .then(function () {
                manage();
              });
        }
        else {
          vm.application.onSiteVisitPhase.eeoDemographic = vm.intervieweeEeo;
          manage();
        }
      }
      else {
        manage();
      }

      function manage() {
        vm.application.$manage()
            .then(function () {
              Messages.addMessage('The Application has been updated', 'success');
              vm.editPhoneInterviewPhaseCollectiveComments = false;
              vm.editReviewPhaseCollectiveComments = false;
              vm.editReferenceChecks = false;
            })
            .catch(function (err) {
              Messages.addMessage(err.data.message, 'error', 'Problem updating Application');
              getApplication();
            });
      }

    }

    function submitEeo() {
      var deferred = $q.defer();
      vm.intervieweeEeo.applicationId = vm.application._id;
      vm.intervieweeEeo.reportType = 'interview';
      Eeo.create(vm.intervieweeEeo)
          .$promise
          .then(function (result) {
            console.log(result._doc._id);
            vm.application.onSiteVisitPhase.eeoDemographic = result._doc._id;
            deferred.resolve(result);
          })
          .catch(function (error) {
            deferred.reject('Cannot create EEO data');
            Messages.addMessage('There was a problem saving the Eeo ' + error.data.message, 'error');
          });
      return deferred.promise;
    }

  }
})();
