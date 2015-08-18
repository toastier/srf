'use strict';

angular.module('applicants').controller('ApplicantsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Applicants',
	function($scope, $stateParams, $location, Authentication, Applicants) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var applicant = new Applicants({
				name: this.name,
				details: this.details,
				postDate: this.postDate,
				closeDate: this.closeDate,
				docLink: this.docLink
			});

			applicant.$save(function(response) {
				$location.path('applicants/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			this.name = '';
			this.details = '';
			this.postDate = '';
			this.closeDate = '';
			this.docLink = '';
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

		$scope.filtering = function() {
			$scope.statusCodes =
			[	{id:1, applicantStatus:'Pending Approval'},
				{id:2, applicantStatus:'Open'},
				{id:3, applicantStatus:'On Hold'}
			];
			console.log('statusCodes: ' + $scope.statusCodes);
			return statusCodes;
		};
	}
]);