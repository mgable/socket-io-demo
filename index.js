"use strict";
var app = require('express')(),
	http = require('http').Server(app);

app.get("/", function(req,res){
	res.send("<h1>hello world</h1>");
});

http.listen(3001, function(){
	console.info('lisitining on port 3001');
});