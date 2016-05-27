var https = require('https'),
	q = require('q'),
	twitter = require('twitter');
var banned_words = require('./banned-words.js');

var twitterConsumerKey = encodeURIComponent("Ezu6WfMJrFjzP36hOc9U0Redo"); // this should come from a config file, or environment variables
var twitterConsumerSecret = encodeURIComponent("l9rEnEf3c2CXhiRg4GWsy491TBAS8WUOHS2c6G99OvWzo1q2XP"); // this should come from a config file, or environment variables
var twitterHostname = 'api.twitter.com'; // this should come from a config file, or environment variables
var twitterOAuthPath = '/oauth2/token';
var twitterSearchPath = 'search/tweets.json';
var twitterBearerKey = 'AAAAAAAAAAAAAAAAAAAAADZpvQAAAAAAk4SfQonk3agsVjmr0mVA3MyTxqk%3DUGeDH4wvFM2mB68C4DL8gB7FtPRUFHGF1bmR4iIPdnXQT8KXCs';
var sinceId = '';
var searchString = '';
var client;

this.feed = function(search) {
	searchString = search;
	var deferred = q.defer();
	var outputPromise = getNewBearerToken()
	.then(function(data) {
		client = new twitter({
		   	consumer_key: twitterConsumerKey,
		   	consumer_secret: twitterConsumerSecret,
		   	bearer_token: data
		});
		var promise = getSearchResults(data)
		.then(function(data) {
			var filteredFeed = banned_words.process(data);
			deferred.resolve(filteredFeed);
		});
	}, function(err) {
		deferred.reject(err);
	});
	return deferred.promise;
}

function getSearchResults(bearer) {
	var deferred = q.defer();
	var twitterSearchString = 'q=' + encodeURIComponent(searchString);
	client.get(twitterSearchPath + '?' + twitterSearchString, function(error, tweets, response) {
		if (error) deferred.reject(error);
		deferred.resolve(tweets);
	});
	return deferred.promise;
}

function getNewBearerToken() {
	var deferred = q.defer();
	var twitterPostData = "grant_type=client_credentials";
	var secretString = new Buffer(twitterConsumerKey + ':' + twitterConsumerSecret).toString('base64');
	var options = {
		hostname: twitterHostname,
		path: twitterOAuthPath,
		method: 'POST',
		headers: {
			'Authorization': 'Basic ' + secretString,
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': twitterPostData.length
		}
	};
	var req = https.request(options, (res) => {
		var data = '';
		if (parseInt(res.statusCode) !== 200)
			deferred.reject("error");
		res.on('data', (d) => {
			data += d;
		});
		res.on('end', () => {
			try {
				var tokenObject = JSON.parse(data.toString());
				if (tokenObject.token_type !== "bearer")
					deferred.reject("error");
				deferred.resolve(tokenObject.access_token);
			}
			catch (ex) {
				deferred.reject("error");
			}
		});
	});
	req.write(twitterPostData);
	req.end();
	return deferred.promise;
}