"use strict";
var app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http);

app.get("/", function(req,res){
	res.sendFile(__dirname + "/index.html");
});

app.get("/*", function(req,res){
	// console.info(req);
	res.sendFile(__dirname + req.url)
});

http.listen(3001, function(){
	console.info('lisitining on port 3001');
});

//io.configure(function() {
    // io.set('authorization', function(handshake, callback) {
    //     var cookie, token, authPair, parts;

    //     console.info("hey I am here!!!1");
    //     //console.info(handshake);

    //     // check for headers
    //     if (handshake.headers.cookie && 
    //         handshake.headers.cookie.split('=')[0]=='myapp') {}
    // });
//});

io.on('connection', function(socket){
	console.info('a user connected');
	//console.info(socket.handshake);
	socket.on('disconnect', function(){
		console.info("user disconnected");
	});

	socket.on('chat message', function(msg){
		console.info("message: " + msg);
		var user = (getUserNameFromCookie(socket.handshake.headers.cookie).username);
		io.emit('chat message', user + ": " + msg);
	});
});

function getUserNameFromCookie(rawCookie){
	var cookie = {};
	rawCookie.split(/;\s?/).forEach(function(value,i,a){
		var temp = value.split(/=/);
		cookie[temp[0]] = temp[1];
	});
	return cookie;
}

