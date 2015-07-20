var path = require('path');
var fs = require('fs');
var app = require('express')();
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
var coreSet = require('./cards/coreSet.js');

/**************** Configure App ****************/

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/************ Connect to Mongo Databases ************/

var dbGames = mongoose.createConnection('mongodb://localhost/games');
var dbPlayers = mongoose.createConnection('mongodb://localhost/players');

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
app.use(function(req, res, next){
    if(!req.cookies['session']) {
        res.cookie('session', Math.round(Math.random() * 1000), {httpOnly: true });
        console.log(req.cookies['session']);
    }
    next();
});

/**************** Set Routes ****************/


io.on('connection', function (socket) {
  socket.on("disconnect", function() {
      console.log("user has disconnected");
  });
  socket.on("login", function(data){
      //check data.token
      console.log(data);
  });
  socket.on("register", function(data){
      //check data.token
      console.log(data);
  });
});

app.get('/', function (req, res) {
    res.render("index");
});

app.get('/login', function (req, res) {
    var tokenGenerator = require("./mongo/token.js");
    res.render("login", {loginToken: tokenGenerator.token(32), registerToken: tokenGenerator.token(32)});
});

app.get('/quarters', function(req, res) {
    res.render("quarters");
});

app.get('/game', function(req, res) {
    var game = dbGames.model("games", mongoGame.gameStateSchema);
    game.findOne({"pl": 1}, "_id", function(err, openGame){
        if(openGame === null){
            var newGame = new game(mongoGame.newGame);
            newGame.save(function(err, newGame){
                console.log("made new game");
                res.redirect("/game/" + newGame._id);
            });
        } else {
            console.log(openGame._id);
            game.update({"_id": openGame._id}, {$set: {"pl": 2}}, function(err, data){
                console.log("ran")
            });
            res.redirect("/game/" + openGame._id);
        }
    });
});

app.get('/game/:id', function(req, res) {
    res.render("game");
});

console.log("server is now running...");
process.on('uncaughtException', function (err) {
    console.log(err);
}); 