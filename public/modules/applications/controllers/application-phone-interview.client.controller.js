(function () {
  'use strict';
  angular
    .module('applications')
    .controller('ApplicationPhoneInterviewController', ApplicationPhoneInterviewController);

  function ApplicationPhoneInterviewController($stateParams, $state, resolvedAuth, Navigation, Application, Messages) {

    var vm = this;

    activate();

    ////////////////

    function activate() {
      Navigation.clear();
      Navigation.viewTitle.set('Phone Interview');
      Application.doPhoneInterview({applicationId: $stateParams.applicationId}).$promise
        .then(function (application) {
          vm.application = application;
        })
        .catch(function (err) {
          Messages.addMessage(err.data.message, 'error');
          $state.go('main.dashboards');
        });
    }
  }
})();
