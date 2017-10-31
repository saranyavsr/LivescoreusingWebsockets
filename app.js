var express = require("express");
var app = express();
var http = require('http');
var fs = require('fs');
var tid;

app.use(express.static(__dirname + "/public"));

app.get("/", function(httpRequest, httpResponse, next){
     httpResponse.sendFile(__dirname + "/public/html/index.html");
})

app.get("/tuneIn", function(httpRequest, httpResponse, next) {
	tid = setInterval(beginUpdates, 5000);
	httpResponse.emit("Begin updates");
})

app.get("/tuneOut", function(httpRequest, httpResponse, next) {
	endUpdates();
    httpResponse.emit("End updates");
})

// Loading the index file . html displayed to the client
var server = http.createServer(app);

// Loading socket.io
var io = require('socket.io').listen(server);
//(server, {path: "/socket-io"});

// When a client connects, we note it in the console
io.sockets.on('connection', function (socket) {
    console.log('A client is connected!');

    socket.on('disconnect', function(){
    console.log('user disconnected');
  	});

});

function beginUpdates() {
	let data = scoresArray();
	var random = data[Math.floor(Math.random() * data.length)];
	io.emit('chat message', random);
	console.log('score sent')
}

function endUpdates() {
	console.log('ended score update')
	clearInterval(tid);
}

function scoresArray() {
	return [ "Current Score: 20 runs - 3rd Over<break> Very Good catch by mid-on player",
	"Current Score: 30 runs - 9th Over<break> Run rate is very low",
	"Current Score: 10 runs - 2nd Over<break> Nice stop by the keeper",
	"Current Score: 5 runs - 3rd Over<break> Well played",
	"Current Score: 12 runs - 3rd Over<break> Good shot",
	"Current Score: 1 run - 1st Over<break> Well palyed",
	"Current Score: 9 runs - 2nd Over<break> End of over"
	]
}

server.listen(8080);