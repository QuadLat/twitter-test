(function() {
	angular
		.module('twittertest.app', [
			'ngRoute',
			'twittertest.searchresults',
			'app.core',
			'app.widgets'
		])
		.config(['$routeProvider', function($routeProvider) {
			$routeProvider.otherwise({redirectTo: '/'})
		}]);
});