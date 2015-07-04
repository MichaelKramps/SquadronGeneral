var path = require('path');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var coreSet = require('./coreSet.js');

server.listen(8888);

// Configure App

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use Middleware



// Set Routes

app.get('/', function (req, res) {
  res.render("index");
});

io.on('connection', function (socket) {
  console.log("user connected")
  socket.on("disconnect", function() {
      console.log("user has disconnected");
  });
  socket.on("click", function(data){
      console.log(data.clicked);
  });
});

console.log("server is now running...");
var id = "1";
console.log(coreSet[id].c);