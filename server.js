var path = require('path');
var app = require('express')();
var server = require('http').Server(app);
// var secure = require('https').Server({key: '', cert: ''}, app);
var io = require('socket.io')(server);
var coreSet = require('./coreSet.js');

server.listen(8888);
// secure.listen(9000);

// Configure App

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use Middleware (act on the res, req parameters automatically)



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

app.get('/game/:id', function(req, res) {
    res.render("game");
    io.on('connection', function(socket){
        console.log(req.path);
    })
});

console.log("server is now running...");
var id = "1";
console.log(coreSet[id].c);