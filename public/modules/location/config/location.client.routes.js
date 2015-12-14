// Setting up routes
angular.module('location').config(['$stateProvider',
	function($stateProvider) {

		// location state routing
		$stateProvider.
		state('location', {
			url: '/location/:locationSessionId',
			templateUrl: 'modules/location/views/location.client.view.html'
		});
	}
]);