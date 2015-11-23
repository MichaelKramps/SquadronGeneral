var path = require('path');
var fs = require('fs');
var express = require('express');
var app = express();
var mongoose = require('mongoose');

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
var mongoPlayer = require("./mongo/mongoPlayer.js");
var coreSet = require('./cards/coreSet.js');
var tokenGenerator = require("./mongo/token.js");
var parseCookieHeader = require("./functions/parseCookieHeader.js");
var validation = require("./functions/validation.js");

/**************** Configure App ****************/

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/************ Connect to Mongo Databases ************/

var dbGames = mongoose.createConnection('mongodb://localhost/games');
var dbPlayers = mongoose.createConnection('mongodb://localhost/players');

/***** Use Middleware (act on the res, req parameters automatically) *****/

app.use(express.static(path.join(__dirname, 'public')));
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
// check whether player is logged in or not
app.use(function(req, res, next){
    if (req.cookies.player){
        res.locals.player = req.cookies.player
    } else if (req.cookies.guest) {
        res.locals.guest = req.cookies.guest
    }
    next();
});


/**************** IO functions ****************/


io.on('connection', function (socket) {
  socket.on("disconnect", function() {
      console.log("user has disconnected");
  });
  socket.on("login", function(data){
      // check for csrf
      var cookieHeader = socket.handshake.headers.cookie;
      var tokenCookie = parseCookieHeader.parse("token", cookieHeader);
      if (tokenCookie && tokenCookie == data.token) {
          // validate input
          var errors = validation.loginValidate(data);
          if (errors.length == 0){
              mongoPlayer.checkLogin(data, function(result){
                  if (typeof result !== "string") {
                      socket.emit("loginSuccess", result[0]);
                  } else {
                      socket.emit("loginMessage", [result]);
                  }
              });
          } else {
              socket.emit("loginMessage", errors);;
          }
      };
  });
  socket.on("register", function(data){
      // check for csrf
      var cookieHeader = socket.handshake.headers.cookie;
      var tokenCookie = parseCookieHeader.parse("token", cookieHeader);
      if (tokenCookie && tokenCookie == data.token) {
          // validate input
          var errors = validation.registerValidate(data);
          if (errors.length == 0){
              mongoPlayer.checkEmail(data.email, function(found){
                  if(found){
                      socket.emit("registerMessage", ["An account already exists with that email"]);
                  } else {
                      mongoPlayer.createNewAccount(data);
                      socket.emit("registerMessage", ["You registered successfully, you may now log in."]);
                      socket.emit("registerSuccess")
                  }
              });
          } else {
              socket.emit("registerMessage", errors);
          }
      };
  });
  socket.on("logout", function(){
      socket.emit("logout");
  });
  socket.on("getPlayerInfo", function(){
      var cookieHeader = socket.handshake.headers.cookie;
      var playerCookie = parseCookieHeader.parse("player", cookieHeader);
      mongoPlayer.getPlayerInfo(playerCookie, function(playerInfo){
          socket.emit("sendPlayerInfo", playerInfo);
      });
  });
  // get card set info
  socket.on("getCardSetInfo", function() {
      socket.emit("sendCardSetInfo", coreSet);
  });
  // socket game functions
    socket.on("startNewDemo", function(playerNumber){
      mongoGame.startNewDemo(function(gameId){
          socket.emit("sendNewDemo", gameId);
      });
  });
});


/**************** Set Routes ****************/


app.get('/', function (req, res) {
    res.render("index");
});

app.get('/login', function (req, res) {
    // give user token cookie here
    var token = tokenGenerator.token(32);
    res.cookie("token", token, {httpOnly: true});
    res.render("login", {loginToken: token, registerToken: token, loggedIn: res.locals.player});
});

app.get('/quarters', function(req, res) {
    mongoPlayer.getPlayerInfo(res.locals.player, function(playerInfo){
        if (playerInfo) {
            res.render("game", {player: playerInfo});
        } else {
            console.log("player not found");
        }
    });
});

console.log("server is now running...");
process.on('uncaughtException', function (err) {
    console.log(err);
}); 