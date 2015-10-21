(function () {
  'use strict';
  angular
    .module('applications')
    .directive('applicationPhoneInterviewForm', applicationPhoneInterviewForm);

  function applicationPhoneInterviewForm() {
    return {
      restrict: 'E',
      templateUrl: 'modules/applications/directives/partials/application-phone-interview-form.client.partial.html',
      scope: true,
      controller: function (Users, Messages) {
        var phoneInterviewPhase = this;
        phoneInterviewPhase.options = {};

        activate();

        function activate() {
          Users.committeeMembersOptionList().$promise
            .then(function(result) {
              phoneInterviewPhase.options.committeeMembers = result;
            })
            .catch(function(err) {
              Messages.addMessage(err.data.message);
            });
        }
      },
      controllerAs: 'phoneInterviewPhase'
    };
  }
})();
