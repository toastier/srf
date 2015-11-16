(function () {
  'use strict';
  angular
    .module('applications')
    .controller('ApplicationPhoneInterviewController', ApplicationPhoneInterviewController);

  function ApplicationPhoneInterviewController($stateParams, $state, resolvedAuth, Navigation, Application, Messages) {

    var vm = this;
    vm.user = resolvedAuth;

    activate();

    function activate() {
      Navigation.clear();
      Navigation.viewTitle.set('Phone Interview');
      Application.doPhoneInterview({applicationId: $stateParams.applicationId}).$promise
        .then(function (application) {
          prunePhoneInterviews(application);
          vm.application = application;
        })
        .catch(function (err) {
          Messages.addMessage(err.data.message, 'error');
          $state.go('main.dashboards');
        });
    }

    /**
     * removes reviews which are not assigned to the authenticated user
     * @param {Object} application
     */
    function prunePhoneInterviews(application) {
      var phoneInterviews = application.phoneInterviewPhase.phoneInterviews;
      angular.forEach(phoneInterviews, function(phoneInterview) {
        if (phoneInterview.interviewer._id !== vm.user._id) {
          phoneInterviews.splice(phoneInterviews.indexOf(phoneInterview), 1);
        }
      });
    }
  }
})();
