var fs = require('fs'),
	q = require('q'),
	heap = require('heap');
var twitter_tweets = require('./tweets.js');
var banned_words = require('./banned-words.js');

var actions = {
  'tweets' : function(method, search) {
	  if (method === "GET")
		  return twitter_tweets.feed(search);
	  else
		  return method + ' method is not supported';
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

  //some private methods
  var serverError = function(code, content) {
    res.writeHead(code, {'Content-Type': 'text/plain'});
    res.end(content);
  });

  var renderHtml = function(content) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(content, 'utf-8');
  });

  var parts = req.url.split('/');

  if (req.url === "/" || req.url === "") {
    fs.readFile(__dirname + '/../webroot/index.html', function(error, content) {
      if (error) {
        serverError(500, error.message);
      } else {
        renderHtml(content);
      }
    });

  } else {
    var action = parts[1];
	var argument;
	if (parts.length === 3)
		argument = parts[2];
	
    if (typeof actions[action] == 'function') {
		var content;
		if (argument)
			content = actions[action](req.method, argument);
		else
			content = actions[action](req.method, '');
		content.then(renderHTML, serverError);
    } else {
      	serverError(404, '404 Bad Request');
    }
  }
}