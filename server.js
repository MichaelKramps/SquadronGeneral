var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8888);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log("user connected")
  socket.on("disconnect", function() {
      console.log("user has disconnected");
  });
  socket.on("click", function(data){
      console.log(data);
  });
});

console.log("server is now running...");