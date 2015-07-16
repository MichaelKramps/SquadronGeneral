var exports = module.exports = {};

/****** requires ******/

var mongoose = require('mongoose');

var mongoMain = require('./mongoMain.js');

/****** Schemas ******/

var joinGameSchema = mongoose.Schema({
    _id: Number,
    game: Number,
    player: Number,
});

var gameStateSchema = mongoose.Schema({
    _id: Number, // game id number
    pl: Number, // number of players who have joined the game
    p: Number, // which player has priority
    t: Number, // which player's turn it is
    ph: Number, // what game phase (0: start turn, 1: draw card, 2: main phase, 3: end of turn)
    i1: Number, // Integrity of player 1's mother ship
    i2: Number, // Integrity of player 2's mother ship
    s1: Number, // Shield on player 1's mother ship
    s2: Number, // Shield on player 2's mother ship
    e1: Number, // player 1's energy
    e2: Number, // player 2's energy
    d1: [Number], // cards in p1's deck
    d2: [Number], // cards in p2's deck
    h1: [{id: Number, c: Number}], // cards in p1's hand
    h2: [{id: Number, c: Number}], // cards in p2's hand
    g1: [Number], // cards in p1's graveyard
    g2: [Number], // cards in p2's graveyard
    r1: Number, // race id will determine mothership's ability (activates at "start of turn")
    r2: Number, // race id will determine mothership's ability (activates at "start of turn")
    b1: [{id: Number, t: Number, a: [Number], d: [Number], s: [Number]}],// player 1's board (battlefield) state, each card is an object with id, type, attack, defense and ability
    b2: [{id: Number, t: Number, a: [Number], d: [Number], s: [Number]}]// player 2's board (battlefield) state
});

/****** exports ******/

exports.connect = mongoMain.connect("localhost", "games");

exports.joinGame = function(){
    console.log("redirecting");
    res.redirect("/");
/*     var model = mongoMain.model("liveGames", gameStateSchema);
    model.findOne({"pl": 1}, "_id", function(err, game){
        if (err) {
            return err;
        } else {
            if(game._id){
                res.redirect("/game/" + game._id);
            } else {
                console.log("no available games");
            }
        }
    }); */
};

exports.createNewGame = function(){
    var hello = "hello";
};

