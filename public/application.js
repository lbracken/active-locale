// Define the main module and add the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

// Run some logic each item Angular refreshes the view
angular.module(ApplicationConfiguration.applicationModuleName).run(function ($rootScope, $timeout) {
	$rootScope.$on('$viewContentLoaded', ()=> {
		$timeout(() => {
			// Register dynamically created DOM elements with Material Design Lite
			componentHandler.upgradeAllRegistered();
		})
	})
});

angular.element(document).ready(function(){
	// Init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});