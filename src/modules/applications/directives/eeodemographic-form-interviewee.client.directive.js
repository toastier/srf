(function () {
    'use strict';
    angular
        .module('applications')
        .directive('eeodemographicFormInterviewee', eeodemographicFormInterviewee)
        //.directive('eeodemographicForm', eeodemographicForm)

    function eeodemographicFormInterviewee() {
        return {
            restrict: 'E',
            templateUrl: 'modules/applications/directives/partials/eeodemographic-form-interviewee.client.partial.html',
            controller: 'IntervieweeEeoController',
            controllerAs: 'vm',
            bindToController: true
        };
    }
    //
    //function eeodemographicForm() {
    //    return {
    //        restrict: 'E',
    //        templateUrl: 'modules/eeo/directives/partials/eeodemographic-form.client.partial.html'
    //    };
    //}

})();