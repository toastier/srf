'use strict';

angular.module('applications').controller('ApplicationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Applications',
	function($scope, $stateParams, $location, Authentication, Applications) {
		$scope.authentication = Authentication;

		$scope.create = function() {

			var application = new Applications({
				applicant: this.applicantId,
				position: this.positionID
			});
			application.$save(function(response) {
				alert(response._id);
				$location.path('applications/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(application) {
			if (application) {
				application.$remove();

				for (var i in $scope.applications) {
					if ($scope.applications[i] === application) {
						$scope.applications.splice(i, 1);
					}
				}
			} else {
				$scope.application.$remove(function() {
					$location.path('applications');
				});
			}
		};

		$scope.update = function() {
			var application = $scope.application;

			application.$update(function() {
				$location.path('applications/' + application._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.applications = Applications.query();
		};

		$scope.findOne = function() {
			$scope.application = Applications.get({
				applicationId: $stateParams.applicationId
			});
		};

	}
]);
