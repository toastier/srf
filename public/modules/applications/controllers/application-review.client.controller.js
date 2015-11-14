(function () {
  'use strict';
  angular
    .module('applications')
    .controller('ApplicationReviewController', ApplicationReviewController);

  function ApplicationReviewController($state, $stateParams, resolvedAuth, Application, Messages, Navigation) {

    var vm = this;
    vm.user = resolvedAuth;

    activate();

    function activate() {
      Navigation.clear();
      Navigation.viewTitle.set('Conduct Review');
      Application.doReview({applicationId: $stateParams.applicationId}).$promise
        .then(function (application) {
          pruneReviews(application);
          vm.application = application;
        })
        .catch(function (err) {
          Messages.addMessage(err.data.message, 'error');
          $state.go('main.dashboards');
        });
    }

    /**
     * removes phoneInterviews which are not assigned to the authenticated user
     * @param {Object} application
     */
    function pruneReviews(application) {
      var reviews = application.reviewPhase.reviews;
      angular.forEach(reviews, function (review) {
        if (review.reviewer._id !== vm.user._id) {
          reviews.splice(reviews.indexOf(review), 1);
        }
      });
    }
  }
})();
