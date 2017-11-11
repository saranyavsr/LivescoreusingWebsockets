var express = require("express");
var app = express();
var http = require('http');
var server = require('http').createServer(app);
var fs = require('fs');
var tid;
var userCount = 0;

var port = process.env.PORT || 8080;

var runOption = [-1,0,1,2,3,4,5,6]; 
var comment = ["Good Shot", "Missed to field", "Classic Text Book Shot", "Hat trick", " Classical Sot", "Unbelievable miss"];
var Score = Math.floor(Math.random() * 50);
var Over =  Math.floor(Math.random() * 20);
var Ball = Math.floor((Math.random() * 6)+1);

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
     res.sendFile(__dirname + "/public/html/index.html");
})

app.get("/tuneIn", function(req, res) {
	tid = setInterval(beginUpdates, 5000);
})

app.get("/tuneOut", function(req, res) {
	endUpdates();
})

// Loading the index file . html displayed to the client
var server = http.createServer(app);

// Loading socket.io
var io = require('socket.io').listen(server);
//(server, {path: "/socket-io"});

// When a client connects, we note it in the console
io.sockets.on('connection', function (socket) {
	console.log("User Connected");
    
    socket.on('disconnect', function(data) {
		console.log("Some user disconnected");
	});
}); 


function beginUpdates() {
	var obj;
	
	if(Over == 20 && Ball == 6){
		//reset everything to 0
		Score = 0;
		Over = 0;
		Ball = 1;
		obj = {"score":Score, "over":Over, "ball":Ball, "comment":"Game Restarting"};
		console.log(JSON.stringify(obj));
	} else {
		var newRun = runOption[Math.floor(Math.random() * runOption.length)];
		
		if (newRun == -1){
			Ball++;
			if(Ball == 7){
				Ball =1;
				Over++;
			}
			var obj = {"score":Score, "over":Over, "ball":Ball, "comment":"Very good catch by mid-on player"};
	//		console.log(JSON.stringify(obj));
		} else if (newRun==0){
			Score+=newRun;
			Ball++;
			if(Ball == 7){
				Ball =1;
				Over++;
			}
			var obj = {"score":Score, "over":Over, "ball":Ball, "comment":"No Runs Added"};
	//		console.log(JSON.stringify(obj));
		} else {
			Score+=newRun;
			Ball++;
			if(Ball == 7){
				Ball =1;
				Over++;
			}
			if(newRun == 4 || newRun == 6){
				var obj = {"score":Score, "over":Over, "ball":Ball, "comment":comment[Math.floor(Math.random() * comment.length)]};
			}
			else{
				var temp = "Added "+newRun+" Runs";
				var obj = {"score":Score, "over":Over, "ball":Ball, "comment":temp};
			}
	//		console.log(JSON.stringify(obj));
		}
	}
	io.socket.broadcast.emit('score', JSON.stringify(obj));
}

function endUpdates() {
	console.log('ended score update')
	clearInterval(tid);
}

server.listen(port);