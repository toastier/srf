'use strict';

angular.module('applicants').controller('ApplicantsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Applicants',
	function($scope, $stateParams, $location, Authentication, Applicants) {
		$scope.authentication = Authentication;

		$scope.create = function() {

			var addressArray = [{address1:this.address1}];

			console.log(addressArray);

			var applicant = new Applicants({
				name: {
					firstName: this.firstName,
					lastName: this.lastName,
					middleName: this.middleName,
					honorific: this.honorific,
					suffix: this.suffix
				},
				//addresses: [
				//	{
				//		address1: this.address1
				//	}
				//]
				//	[{
				//	address1: this.address1
				//}]
				applicantPositions: [
					{
						//positionName: (this.position !== undefined ? this.position : 'TBD')
						positionName: this.position
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
				]
				//positions: this.positions,
				//focalAreas: this.focalAreas
			});
			applicant.$save(function(response) {
				alert(response._id);
				$location.path('applicants/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});


		};

		$scope.remove = function(applicant) {
			if (applicant) {
				applicant.$remove();

				for (var i in $scope.applicants) {
					if ($scope.applicants[i] === applicant) {
						$scope.applicants.splice(i, 1);
					}
				}
			} else {
				$scope.applicant.$remove(function() {
					$location.path('applicants');
				});
			}
		};

		$scope.update = function() {
			var applicant = $scope.applicant;

			applicant.$update(function() {
				$location.path('applicants/' + applicant._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.applicants = Applicants.query();
		};

		$scope.findOne = function() {
			$scope.applicant = Applicants.get({
				applicantId: $stateParams.applicantId
			});
		};

	}
]);
