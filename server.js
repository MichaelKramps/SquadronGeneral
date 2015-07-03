var fs = require('fs');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);

// 404 Response


// Handle User Request
app.get("/", function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log("a user connected");
});

app.listen(8888);

console.log("Server is now running...");