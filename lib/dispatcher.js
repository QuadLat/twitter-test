var fs = require('fs'),
	q = require('q');
var twitter_tweets = require('./tweets.js');
var banned_words = require('./banned-words.js');

var actions = {
  'tweets' : function(method, searchArr) {
	  // user can send multiple search parameters, but we only take the first one
	  var deferred = q.defer();
	  if (method === "GET") {
		  if (searchArr && searchArr.length > 0) {
		  	  var twitterPromise = twitter_tweets.feed(searchArr[0])
			  .then(function(data) {
				  deferred.resolve(data);
			  }, function(err) {
				  deferred.reject(err);
			  });
		  }
		  else
			  deferred.reject("Search Parameters Not Correct")
	  }
	  else
		  deferred.reject(req.method + ' method is not supported');
	  return deferred.promise;
  },
  'banned-words': function(method, wordArr) {
	  // user can send multiple words, separated by a '/', and all are added to the list
	  var deferred = q.defer();
	  if (method === "GET" && (!wordArr || wordArr.length === 0)) {
		  var bannedWordsList = banned_words.list();
		  deferred.resolve(bannedWordsList);
	  }
	  //else if (method === "PUT") {
	  else if (method === "GET" && wordArr) {
		  var bannedWordsAdded = banned_words.addWord(wordArr);
		  deferred.resolve(bannedWordsAdded);
	  }
	  else
		  deferred.reject(method + ' method is not supported');
	  return deferred.promise;
  }
}

this.dispatch = function(req, res) {
  var parts = req.url.split('/');

	//some private methods for writing data back to client
  var serverError = function(code, content) {
	  res.writeHead(code, {'Content-Type': 'text/plain'});
	  res.end(content);
  };
  
  var renderHtml = function(content_type, content) {
	  try {
	  	res.writeHead(200, {'Content-Type': content_type});
	  	res.end(content);
	  }
	  catch (ex) {
		  serverError(400, ex.message);
	  }
  };

  if (req.url === "/" || req.url === "") {
    fs.readFile(__dirname + '/../webroot/index.html', function(error, content) {
      if (error) {
        serverError(400, error.message)
      } else {
		  renderHtml('text/html', content);
      }
    });

  } else {
    var action = parts[1];
	var argument = [];
	if (parts.length === 3)
		argument.push(parts[2]);
	else if (parts.length > 3) {
		parts.forEach(function(val, index) {
			if (index > 1)
				argument.push(val);
		});
	}
		
	
    if (typeof actions[action] == 'function') {
		if (argument) {
			actions[action](req.method, argument)
			.then(function(data) {
				renderHtml('application/json', JSON.stringify(data));
			}, function(error) {
				serverError(400, error.message);
			});
		}
		else {
			actions[action](req.method)
			.then(function(data) {
				renderHtml('application/json', JSON.stringify(data));
			}, function(error) {
				serverError(400, error.message);
			});
		}
    } else {
      	serverError(404, 'Request Not Found');
    }
  }
}