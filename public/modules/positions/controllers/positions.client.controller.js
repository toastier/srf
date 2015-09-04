'use strict';

angular.module('positions').controller('PositionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Positions',
	function($scope, $stateParams, $location, Authentication, Positions) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var position = new Positions({
				name: this.name,
				details: this.details,
				postDate: this.postDate,
				closeDate: this.closeDate,
				docLink: this.docLink
			});

			position.$save(function(response) {
				$location.path('positions/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			this.name = '';
			this.details = '';
			this.postDate = '';
			this.closeDate = '';
			this.docLink = '';
		};

		$scope.remove = function(position) {
			if (position) {
				position.$remove();

				for (var i in $scope.positions) {
					if ($scope.positions[i] === position) {
						$scope.positions.splice(i, 1);
					}
				}
			} else {
				$scope.position.$remove(function() {
					$location.path('positions');
				});
			}
		};

		$scope.update = function() {
			var position = $scope.position;

			position.$update(function() {
				$location.path('positions/' + position._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.positions = Positions.query();
		};

		$scope.findOne = function() {
			$scope.position = Positions.get({
				positionId: $stateParams.positionId
			});
		};

		$scope.filtering = function() {
			$scope.statusCodes =
			[	{id:1, positionStatus:'Pending Approval'},
				{id:2, positionStatus:'Open'},
				{id:3, positionStatus:'On Hold'}
			];
			console.log('statusCodes: ' + $scope.statusCodes);
			return statusCodes;
		};
	}
]);