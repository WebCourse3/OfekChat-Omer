var express = require("express");
var app     = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use("/modules" , express.static(__dirname + '/node_modules'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/html/index.html');
});

io.on('connection', function(socket){
	console.log('a user connected');
	var sessionColor = "black";
	var sessionIsBold = false;
	var sessionIsItallic = false;
	var border = "";

	socket.on('chat message', function(msg){
		switch(msg) {
			case String (msg.match(/^\/setColor.*/i)):
				sessionColor = msg.split(" ")[1];
				console.log("Session color changed to: " + sessionColor);
				break;

			case String(msg.match(/^\/setBold.*/i)):
				if (sessionIsBold === false ) {
					sessionIsBold = true;
				}
				else if (sessionIsBold === true){
					sessionIsBold = false;
				}
				break;

			case String(msg.match(/^\/setItallic.*/i)):
				if (sessionIsItallic === false) {
					sessionIsItallic = true;
				}
				else if (sessionIsItallic === true) {
					sessionIsItallic = false;
				}
				break;

			case String(msg.match(/^\/setBorder.*/i)):
				border = msg.split(" ").slice(1);
				console.log(border);
				break;
			default:
				console.log(msg);
				socket.broadcast.emit('chat message', msg,sessionColor,sessionIsBold,sessionIsItallic,border);
				break;
		}
	});

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});

http.listen(3000, function(){
	console.log('listening on port:3000');
});
