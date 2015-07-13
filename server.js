var path = require('path');
var fs = require('fs');
var app = require('express')();

var server = require('http').Server(app);;
var secureOptions = {
    key: fs.readFileSync(path.join(__dirname, 'ssl/superSecret.key')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl/superSecret.cert'))
};
var secure = require('https').Server(secureOptions, app);
server.listen(80);
secure.listen(443);

var io = require('socket.io')(secure);
var cookieParser = require('cookie-parser');

/******** Require game specific modules ********/

var mongoGame = require('./mongo/mongoGame.js');
var coreSet = require('./cards/coreSet.js');

/**************** Configure App ****************/

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/***** Use Middleware (act on the res, req parameters automatically) *****/

app.use(function (req, res, next) {
	if (req.secure) {
        console.log("secure");
		// request was via https, so do no special handling
		next();
	} else {
		// request was via http, so redirect to https
        console.log("not secure");
		res.redirect('https://' + req.hostname + req.originalUrl);
	}
});
app.use(cookieParser());

/**************** Set Routes ****************/


io.on('connection', function (socket) {
  console.log("user connected")
  socket.on("disconnect", function() {
      console.log("user has disconnected");
  });
  socket.on("click", function(data){
      console.log(data.clicked);
  });
});

app.get('/', function (req, res) {
    res.render("index");
});

app.get('/quarters', function(req, res) {
    res.render("quarters");
});

app.get('/game/:id', function(req, res) {
    mongoGame.connect;
    res.render("game");
    io.on('connection', function(socket){
        console.log("user connected to game");
        console.log(req.params);
    })
});

console.log("server is now running...");