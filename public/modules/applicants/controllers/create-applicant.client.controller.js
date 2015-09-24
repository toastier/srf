(function(){
	'use strict';
	angular
		.module('applicants')
		.controller('CreateApplicantController', CreateApplicantController);
		
	function CreateApplicantController($stateParams, $location, Authentication, Applicant, Messages) {
		var vm = this;
		vm.authentication = Authentication.init();
		
		activate();
		
		function activate () {
			Applicant.query().$promise
				.then(function (result) {
					vm.applicants = result;
					Messages.addMessage('Applicants Loaded', 'success');
				})
				.catch(function (error) {
					Messages.addMessage(error.data.message, 'error');
				});
		}
		
		vm.create = function() {
		
			var addressArray = [{address1:this.address1}];
		
			var applicant = new Applicant({
				name: {
					firstName: this.firstName,
					lastName: this.lastName,
					middleName: this.middleName,
					honorific: this.honorific,
					suffix: this.suffix
				},
				applicantPositions: [
					{
						//positionName: (this.position !== undefined ? this.position : 'TBD')
						positionName: this.positionName,
						institution: {
							institutionName: this.institutionName
						},
						dateExpectedCompletion: this.dateExpectedCompletion
					}
				],
				emailAddresses: [
					{
						emailAddress: this.emailAddress
					}
				],
				phoneNumbers: [
					{
						phoneNumber: this.phoneNumber
					}
				],
				addresses: [
					{
						address1: this.address1,
						address2: this.address2,
						city: this.city,
						state: this.state,
						country: this.country,
						postalCode: this.postalCode,
						primary: this.primary
					}
				],
				credentials: [
					{
						credential: this.credential,
						year:	this.year,
						institution: this.institution,
						note: this.note
					}
				],
				focalAreas: [
					{
						focalArea: this.focalArea
					}
				],
				source:
					{
						primary: this.primary,
						specific: this.specific
					}
			});

			applicant.$save(function(response) {
				alert(response._id);
				$location.path('applicants/' + response._id);
			}, function(errorResponse) {
				vm.error = errorResponse.data.message;
			});
		};
		
		vm.remove = function(applicant) {
			if (applicant) {
				applicant.$remove();
		
				for (var i in vm.applicants) {
					if (vm.applicants[i] === applicant) {
						vm.applicants.splice(i, 1);
					}
				}
			} else {
				vm.applicant.$remove(function() {
					$location.path('applicants');
				});
			}
		};
		
		vm.update = function() {
			var applicant = vm.applicant;
		
			applicant.$update(function() {
				$location.path('applicants/' + applicant._id);
			}, function(errorResponse) {
				vm.error = errorResponse.data.message;
			});
		};
		
		vm.find = function() {
			vm.applicants = Applicant.query();
		};
		
		vm.findOne = function() {
			vm.applicant = Applicant.get({
				applicantId: $stateParams.applicantId
			});
		};
	
	}
})();