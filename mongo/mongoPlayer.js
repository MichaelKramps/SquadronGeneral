var exports = module.exports = {};

/****** requires ******/

var mongoose = require('mongoose');

/***** connect to db *****/

var dbPlayers = mongoose.createConnection('mongodb://localhost/players');

/****** schemas/models ******/

var playerSchema = mongoose.Schema({
    "email": String,
    "username": String,
    "password": String,
    "salt": String,
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
        "password": data.password,
        "salt": "salt",
    });
    newPlayer.save(function(err, newPlayer){});
}