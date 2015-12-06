angular.module('groups').controller('GroupsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Groups',
	function($scope, $stateParams, $location, Authentication, Groups) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var group = new Groups({
				name: this.group.name,
				email: this.group.email,
				sms: this.group.sms
			});
			group.$save(function(response) {
				$location.path('groups');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function() {
			$scope.group.$remove(function() {
				$location.path('groups');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.update = function() {
			var group = $scope.group;
			group.$update(function() {
				$location.path('groups');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.groups = Groups.query();
		};

		$scope.findOne = function() {
			$scope.group = Groups.get({
				groupId: $stateParams.groupId
			});
		};		
	}
]);