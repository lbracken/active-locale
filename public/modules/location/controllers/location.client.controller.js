angular.module('location').controller('LocationController', ['$scope', '$stateParams', '$location', 'Authentication', 'Socket',
	function($scope, $stateParams, $location, Authentication, Socket) {
		$scope.authentication = Authentication;
		$scope.username = Authentication.user? Authentication.user.username : 'anonymous user';
		$scope.locationSessionId = $stateParams.locationSessionId;		
		$scope.users = [];

		Socket.on('usersInRoomUpdated', function(usersInRoom){
			$scope.users = usersInRoom;
		});

		$scope.$on('$destroy', function(){
			Socket.removeListener('usersInRoomUpdated');
			Socket.emit('leaveRoom');
		});

		// Join the location sharing session (room)
		Socket.emit('joinRoom', {
			username: $scope.username,
			room: $scope.locationSessionId
		});
	}
]);