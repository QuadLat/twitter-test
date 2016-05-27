var	morgan = require('morgan'),
	http = require('http'),
	finalhandler = require('finalhandler'),
	fs = require('fs');

//create access log stream for writing to file
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})
//add stream to morgan, and morgan to connect
var logger = morgan('combined', {stream:accessLogStream});

var dispatcher = require(__dirname + '/lib/dispatcher.js');

var server = http.createServer(function(req, res) {
	var done = finalhandler(req, res)
	logger(req, res, function(err) {
		if (err) return done(err);
		dispatcher.dispatch(req, res)
	});
});

server.listen(3030, function() {
	console.log('Server listening on port 3030');
});