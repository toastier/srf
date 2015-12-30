/* EEO classification details sources:
 - http://www.eeoc.gov/employers/eeo1survey/2007instructions.cfm
 - http://www.dol.gov/vets/contractor/main.htm
 */

(function () {
    'use strict';
    angular
        .module('eeo')
        .controller('IntervieweeEeoController', IntervieweeEeoController);


    /* @ngInject */
    function IntervieweeEeoController(Eeo, Application, Messages, $scope) {
        var vm = this;
        var parent = $scope.$parent.vm.application;
        var existingEeo = !!parent.onSiteVisitPhase.eeoDemographic;
        //vm.eeo = new Eeo( {
        //    "gender" : existingEeo ? parent.onSiteVisitPhase.eeoDemographic.gender : null,
        //    "ethnicity" : existingEeo ? parent.onSiteVisitPhase.eeoDemographic.ethnicity : null,
        //    "race" : existingEeo ? parent.onSiteVisitPhase.eeoDemographic.race : null,
        //    "_id" : existingEeo ? parent.onSiteVisitPhase.eeoDemographic._id : null
        //});
        vm.eeo = existingEeo ? new Eeo(parent.onSiteVisitPhase.eeoDemographic) : new Eeo();
        vm.options = Eeo.getOptions();
        vm.applicationId = parent._id;
        vm.declineOff = declineOff;
        vm.flagOff = flagOff;
        vm.declineAnswer = declineAnswer;
        vm.setSelection = setSelection;
        $scope.$parent.vm.intervieweeEeo = vm.eeo;

        function declineOff() {
            for(var race in vm.options.races) {
                var code = vm.options.races[race].code;
                if (vm.eeo.race[code] === true) {
                    vm.eeo.race.declined = false;
                }
            }
        }

        function setSelection($event, key, value) {
            var checkbox = $event.target;
            if (checkbox.checked) {
                key = value;
            }
        }

        // Set flag to FALSE if any of the options are true,
        // i.e, set Decline To Answer to false if any preceding options are true
        function flagOff(flag, options) {
            if (flag === 'true') {
                for(var option in options) {
                    if (options[option] === true) {
                        flag = false;
                    }
                }
            }
        }

        // Set all options to false TODO pass an array of values to ignore instead of hardcoded 'declined'
        function declineAnswer(options) {
            for(var option in options) {
                if (option !== 'declined') {
                    options[option] = false;
                }
            }
        }
    }
})();
