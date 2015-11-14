"use strict";
var app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http);

app.get("/", function(req,res){
	res.sendFile(__dirname + "/index.html");
});

app.get("/*", function(req,res){
	console.info("XXXXXX");
	// console.info(req);
	res.sendFile(__dirname + req.url)
});


http.listen(3001, function(){
	console.info('lisitining on port 3001');
});

io.on('connection', function(socket){
	console.info('a user connected');
	socket.on('disconnect', function(){
		console.info("user disconnected");
	});

	socket.on('chat message', function(msg){
		console.info("message: " + msg);
	});
});

