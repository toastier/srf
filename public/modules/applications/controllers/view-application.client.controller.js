(function () {
  'use strict';
  angular
    .module('applications')
    .controller('ViewApplicationController', ViewApplicationController);

  function ViewApplicationController($stateParams, resolvedAuth, Application, Navigation, Messages) {

    var vm = this;

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
    }
  }
})();
