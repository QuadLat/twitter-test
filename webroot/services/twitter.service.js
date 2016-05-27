(function() {
'use strict';

angular
	.module('twittertest.app')
	.factory('twitterservice', twitterservice);
	
twitterservice.$inject = ['$http'];

function twitterservice($http) {
	return {
		getFeedForSearch: getFeedForSearch
	};
	
	function getFeedForSearch(search) {
		return $http.get('/tweets/' + search)
				.then(getFeedComplete)
				.catch(getFeedError)
		
		function getFeedComplete(response) {
			return response.data;
		}
		
		function getFeedError(error) {
			console.log(error.data);
		}
	}
	
	
}

})();