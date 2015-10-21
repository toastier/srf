(function () {
  'use strict';
  angular
    .module('applications')
    .controller('ApplicationReviewController', ApplicationReviewController);

  function ApplicationReviewController($state, $stateParams, resolvedAuth, Application, Messages, Navigation) {

    var vm = this;
    vm.user = resolvedAuth;

    activate();

    ////////////////

    function activate() {
      Navigation.clear();
      Navigation.viewTitle.set('Review');
      Application.doReview({applicationId: $stateParams.applicationId}).$promise
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
