(function(){
    'use strict';
    angular
        .module('applicants')
        .factory('Applicant', Applicant);
    
    function Applicant ($resource, $state, $stateParams) {
        var Applicant = $resource('applicants/:applicantId', {applicantId: '@_id'}, {
            update: {
                method: 'PUT'
            }
        });
        
        var methods = {
            editThisApplicant: function () {
                $state.go('editApplicant', {applicantId: $stateParams.applicantId});
            },
            viewThisApplicant: function () {
                $state.go('viewApplicant', {applicantId: $stateParams.applicantId});
            },
            createApplicant: function () {
                $state.go('createApplicant');
            }
            
        };
        
        var itemMethods = {
            editApplicant: function (applicant) {
                $state.go('editApplicant', {applicantId: applicant._id});
            },
            viewApplicant: function (applicant) {
                $state.go('viewApplicant', {applicantId: applicant._id});
            }
        };
        angular.extend(Applicant.prototype, itemMethods);
        
        var modelMethods = {
            listApplicants: function () {
                $state.go('listApplicants');
            },
            getActions: function () {
                var modelActions = [
                    {title: 'Create a New Applicant', method: methods.createApplicant, type: 'button', style: 'btn-add'},
                    {title: 'View Applicant', method: methods.viewThisApplicant, type: 'button', style: 'btn-add'},
                    {title: 'Edit Applicant', method: methods.editThisApplicant, type: 'button', style: 'btn-add'}
                ];
                return angular.copy(modelActions);
            }
        };
        angular.extend(Applicant, modelMethods);
        
        return Applicant;
    }
})();
