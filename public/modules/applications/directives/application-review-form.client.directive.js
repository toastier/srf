(function () {
  'use strict';
  angular
    .module('applications')
    .directive('applicationReviewForm', applicationReviewForm);

  function applicationReviewForm() {
    return {
      restrict: 'E',
      templateUrl: 'modules/applications/directives/partials/application-review-form.client.partial.html',
      scope: true,
      controller: function (Users, Messages) {
        var reviewPhase = this;
        reviewPhase.options = {};

        activate();

        function activate() {
          Users.committeeMembersOptionList().$promise
            .then(function(result) {
              reviewPhase.options.committeeMembers = result;
            })
            .catch(function(err) {
              Messages.addMessage(err.data.message);
            });
        }
      },
      controllerAs: 'reviewPhase'
    };
  }
})();
