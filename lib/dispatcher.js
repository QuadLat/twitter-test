var fs = require('fs'),
	q = require('q');
var twitter_tweets = require('./tweets.js');
var banned_words = require('./banned-words.js');

var actions = {
  'tweets' : function(method, search) {
	  var deferred = q.defer();
	  if (method === "GET") {
	  	  var twitterPromise = twitter_tweets.feed(search)
		  .then(function(data) {
				deferred.resolve(data)
		  }, function(err) {
			  deferred.reject(err);
		  });
	  }
	  else
		  deferred.reject(req.method + ' method is not supported');
	  return deferred.promise;
  },
  'banned-words': function(method, word) {
	  if (method === "GET")
		  return banned_words.list();
	  else if (method === "PUT")
		  return banned_words.addWord(word);
	  return method + ' method is not supported';
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
	res.writeHead(200, {'Content-Type': content_type});
	res.end(content);
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
	var argument;
	if (parts.length === 3)
		argument = parts[2];
	
    if (typeof actions[action] == 'function') {
		if (argument) {
			actions[action](req.method, argument)
			.then(function(data) {
				renderHtml('application/json', data);
			}, function(error) {
				serverError(400, error.message);
			});
		}
		else {
			actions[action](req.method, '')
			.then(function(data) {
				renderHtml('application/json', data);
			}, function(error) {
				serverError(400, error.message);
			});
		}
    } else {
      	serverError(404, 'Request Not Found';
    }
  }
}