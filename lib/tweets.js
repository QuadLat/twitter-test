var https = require('https');

var twitterConsumerKey = encodeURIComponent("Ezu6WfMJrFjzP36hOc9U0Redo"); // this should come from a config file, or environment variables
var twitterConsumerSecret = encodeURIComponent("l9rEnEf3c2CXhiRg4GWsy491TBAS8WUOHS2c6G99OvWzo1q2XP"); // this should come from a config file, or environment variables
var twitterHostname = 'api.twitter.com'; // this should come from a config file, or environment variables
var twitterOAuthPath = 'oauth2/token';
var twitterSearchPath = '1.1/search/tweets.json?';
var twitterBearerKey = '';
var sinceId = '';

this.feed = function(search) {
	if (twitterBearerKey === '')
		twitterBearerKey = getNewBearerToken();
	if (twitterBearerKey === 'error')
		return 'error';
	var twitterSearchString = encodeURIComponent(search) + '&' + sinceId===''?'':'since_id='+sinceId;
	var options = {
		hostname: twitterHostname,
		path: twitterSearchPath + twitterSearchString,
		method: 'GET',
		header: {
			'Authorization': 'Bearer ' + twitterBearerKey,
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	};
	var req = https.request(options, (res) => {
		var data = new Buffer('');
		res.on('data', (d) => {
			data.concat(d);
		});
		res.on('end', () => {
			var searchResults = JSON.parse(data);
			
		})
	});
	req.end();
	return 'twitter feed';
}

function getNewBearerToken() {
	var twitterPostData = "grant_type=client_credentials";
	var secretString = new Buffer(twitterConsumerKey + ':' twitterConsumerSecret).toString('base64');
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
		var data = new Buffer('');
		if (parseInt(res.statusCode) !== 200)
			return "error";
		res.on('data', (d) => {
			data.concat(d);
		});
		res.on('end', () => {
			try {
				var tokenObject = JSON.parse(data.toString());
				if (tokenObject.token_type !== "bearer")
					return "error";
				return tokenObject.access_token;
			}
			catch (Exception ex) {
				return "error";
			}
		});
	});
	req.write(twitterPostData);
	req.end();
}