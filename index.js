"use strict";
var app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	users = [];

app.get("/", function(req,res){
	res.sendFile(__dirname + "/index.html");
});

app.get("/*", function(req,res){
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
	//var user = getUserNameFromCookie(socket.handshake.headers.cookie);
	var user;
	socket.mychat = {};
	console.info('user connected: ' + user);

	socket.on('disconnect', function(){
		var user = socket.mychat.username;
		if (user){
			console.info("user " + user + " disconnected");
			removeUser(socket.mychat.username);
			broadcastUsers();
		}
	});

	socket.on('chat message', function(msg){
		chat(user, msg);
	});

	socket.on('authorization', function(name){
		console.info("authorizing " + name);
		user = name;
		socket.mychat = {username: name};
		socket.emit('authorization', socket.mychat);
		addUser(user)
		broadcastUsers();
	});
});

function removeUser(user){
	console.info("removing user " + user);
	var userIndex = users.indexOf(user);
	if (userIndex > -1){
		users.splice(userIndex,1);
	}
}

function addUser(user){
	users.push(user);
}

function broadcastUsers(){
	io.emit('users', users);
}

function getUserNameFromCookie(rawCookie){
	var cookie = {};
	rawCookie.split(/;\s?/).forEach(function(value,i,a){
		var temp = value.split(/=/);
		cookie[temp[0]] = temp[1];
	});
	return cookie.username;
}

function chat(user, msg){
	if (user){
		console.info("message: " + msg);
		io.emit('chat message', user + ": " + msg);
	} else {
		io.emit('authorization', 'Please log in.');
	}
}

