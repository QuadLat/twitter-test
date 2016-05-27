var _ = require('underscore');

/*
An ideal structure for this problem would be an AVL Tree.  Each object going into that tree would be of the form {key:value}
Key is the banned word, and the value is the number of times that banned word has been found in tweets
With each search, as we update values of keys, or add new keys, the tree would rebalance itself
When comparing tweets against banned word lists, it would be helpful to go with more popular banned words first, so the filtering
process can end sooner
*/
var bannedWordsList = new Map();

this.list = function() {
	var jsonObjectToReturn = [];
	// There should be a way to convert this to an Array more efficiently, rather than O(n) every time
	// Maybe use tries
	for (var bannedWord of bannedWordsList.keys())
		jsonObjectToReturn.push(bannedWord);
	return jsonObjectToReturn;
}

this.addWord = function(wordArr) {
	var wordCount = 0;
	if (wordArr) {
		wordArr.forEach(function(word) {
			if (!bannedWordsList.has(word)) {
				bannedWordsList.set(word, 0);
				wordCount += 1;
			}
		});
		return wordCount;
	}
	else
		return 0;
}

this.process = function(feed) {
	var returnArray = [];
	if (feed) {
		var BreakException = {};
		// How can we parallelize this? 
		// Easier when results going to a Mongo
		// This could then be made into a function on AWS Lambda, or a part a microservice
		// and parts of the feed are being parallelized out to multiple threads each running this 
		// function
		returnArray = _.reject(feed.statuses, function(statusObject) {
			var found = false;
			try {
				bannedWordsList.forEach(function(numItems, bannedWord) {
					if (statusObject.text.indexOf(bannedWord) > -1) {
						numItems += 1;
						bannedWordsList.set(bannedWord, numItems);
						throw BreakException;
					}
				});
			}
			catch (ex) {
				if (ex === BreakException)
					return true;
			}
			return false;
		});
		return returnArray;
	}
	else
		return "Twitter Feed Not Specified";
}