var exports = module.exports = {};

/****** requires ******/

var mongoose = require('mongoose');

/***** connect to db *****/

var dbGames = mongoose.createConnection('mongodb://localhost/games');

/****** schemas/models ******/

var gameStateSchema = mongoose.Schema({
    "pl": Number, // number of players who have joined the game
    "p": Number, // which player has priority
    "t": Number, // which player's turn it is
    "ph": Number, // what game phase (0: start turn, 1: draw card, 2: main phase, 3: end of turn)
    "i1": Number, // Integrity of player 1's mother ship
    "i2": Number, // Integrity of player 2's mother ship
    "s1": Number, // Shield on player 1's mother ship
    "s2": Number, // Shield on player 2's mother ship
    "e1": Number, // player 1's energy
    "e2": Number, // player 2's energy
    "d1": [Number], // cards in p1's deck
    "d2": [Number], // cards in p2's deck
    "h1": [{id: Number, c: Number}], // cards in p1's hand
    "h2": [{id: Number, c: Number}], // cards in p2's hand
    "g1": [Number], // cards in p1's graveyard
    "g2": [Number], // cards in p2's graveyard
    "r1": Number, // race id will determine mothership's ability (activates at "start of turn")
    "r2": Number, // race id will determine mothership's ability (activates at "start of turn")
    "b1": [{id: Number, t: Number, a: [Number], d: [Number], s: [Number]}],// player 1's board (battlefield) state, each card is an object with id, type, attack, defense and ability
    "b2": [{id: Number, t: Number, a: [Number], d: [Number], s: [Number]}]// player 2's board (battlefield) state
});

var demoGameModel = dbGames.model("games", gameStateSchema);

/****** exports ******/

exports.startNewDemo = function(callback){
    var newDemo = new demoGameModel({
        "pl": 2, // number of players who have joined the game
        "p": 1, // which player has priority
        "t": 1, // which player's turn it is
        "ph": 0, // what game phase (0: pre-game, 1: start turn, 2: draw card, 3: main phase, 4: end of turn)
        "i1": 20, // Integrity of player 1's mother ship
        "i2": 20, // Integrity of player 2's mother ship
        "s1": 10, // Shield on player 1's mother ship
        "s2": 10, // Shield on player 2's mother ship
        "e1": 0, // player 1's energy
        "e2": 0, // player 2's energy
        "d1": [2, 2, 2, 3, 3, 3, 4, 4, 8, 8, 8, 51, 51, 51, 52, 52, 52, 37, 23, 23, 23, 26, 26, 26, 28, 28, 22, 22, 13, 13, 13, 46, 46, 49, 49, 7, 7, 11, 11, 11], // cards in p1's deck
        "d2": [1, 1, 1, 5, 5, 10, 10, 10, 6, 6, 6, 52, 52, 52, 54, 54, 39, 31, 31, 24, 30, 30, 30, 21, 21, 21, 20, 20, 15, 15, 15, 12, 12, 12, 42, 47, 47, 48, 48, 48], // cards in p2's deck
        "h1": [], // cards in p1's hand
        "h2": [], // cards in p2's hand
        "g1": [], // cards in p1's graveyard
        "g2": [], // cards in p2's graveyard
        "r1": 0, // race id will determine mothership's ability (activates at "start of turn")
        "r2": 0, // race id will determine mothership's ability (activates at "start of turn")
        "b1": [],// player 1's board (battlefield) state, each card is an object with id, type, attack, defense and ability
        "b2": []// player 2's board (battlefield) state
    })
    newDemo.save(function(err, newDemo){
        callback(newDemo._id);
    });
}




