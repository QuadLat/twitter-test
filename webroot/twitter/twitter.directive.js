(function() {
'use strict';

angular
.module('app.widgets')
.directive('twitterCard', twitterCard)
	
function twitterCard() {
	var directive = {
		templateUrl: './twitter.directive.html',
		restrict: 'EA',
		scope: {
			twitterID: '=tweetId'
		},
	};
	
	return directive;
}

})();