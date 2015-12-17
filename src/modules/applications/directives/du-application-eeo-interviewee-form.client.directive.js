(function () {
    'use strict';

    angular
        .module('applications')
        .directive('duApplicationEeoIntervieweeForm', duApplicationEeoIntervieweeForm);

    /* @ngInject */
    function duApplicationEeoIntervieweeForm() {
        return {
            restrict: 'E',
            templateUrl: 'modules/applications/directives/partials/du-application-eeo-interviewee-form.client.partial.html'
        };
    }
})();

