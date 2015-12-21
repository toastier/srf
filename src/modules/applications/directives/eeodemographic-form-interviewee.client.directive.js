(function () {
    'use strict';
    angular
        .module('application')
        .directive('eeodemographicFormInterviewee', eeodemographicFormInterviewee)

function eeodemographicFormInterviewee() {
    return {
        restrict: 'E',
        templateUrl: 'modules/applications/directives/partials/eeodemographic-form-interviewee.client.partial.html',
        controller: 'IntervieweeEeoController',
        controllerAs: 'vm',
        bindToController: true
    };
}

})();