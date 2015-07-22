var exports = module.exports = {};

/****** requires ******/

var mongoose = require('mongoose');
var passwordHash = require('password-hash');

/***** connect to db *****/

var dbPlayers = mongoose.createConnection('mongodb://localhost/players');

/****** schemas/models ******/

var guestSchema = mongoose.Schema({
    "tutorial" : Number
});

var playerSchema = mongoose.Schema({
    "email": String,
    "username": String,
    "password": String,
});

var playerModel = dbPlayers.model("players", playerSchema);

/****** exports ******/

exports.sessionSchema = mongoose.Schema({
    _id: Number,
    pI: Number,
});

exports.checkEmail = function(email, callback){
    playerModel.findOne({"email": email}, function(err, obj){
        if (obj !== null) {
            callback(true);
        } else {
            callback(false);
        }
    })
}

exports.createNewAccount = function(data){
    var newPlayer = new playerModel({
        "email": data.email,
        "username": data.username,
        "password": passwordHash.generate(data.password, {saltLength: 16}),
    });
    newPlayer.save(function(err, newPlayer){});
}

exports.checkLogin = function(data, callback){
    playerModel.findOne({"email": data.email}, function(err, player){
        if (player !== null) {
            if (passwordHash.verify(data.password, player.password)) {
                callback("process login");
            } else {
                callback("Bad password");
            }
        } else {
            callback("Email not found");
        }
    });
}

