var exports = module.exports = {};

/****** requires ******/

var mongoose = require('mongoose');

/***** connect to db *****/

var dbGames = mongoose.createConnection('mongodb://localhost/games');

/****** schemas/models ******/

var gameStateSchema = mongoose.Schema({
    "pl": Number, // number of players who have joined the game
    "o": [Number], // Order of attackers for battle
    "ph": Number, // what game phase (0: start turn, 1: draw card, 2: main phase, 3: end of turn)
    "i1": Number, // Integrity of player 1's mother ship
    "i2": Number, // Integrity of player 2's mother ship
    "s1": Number, // Shield on player 1's mother ship
    "s2": Number, // Shield on player 2's mother ship
    "pr1": Number, // player 1's energy per turn
    "pr2": Number, // player 2's energy per turn
    "sp1": [Number], // special card(s) for p1
    "sp2": [Number], // special card(s) for p2
    "g1": [Number], // grid layout for player 2
    "g2": [Number], // grid layout for player 2
    "e1": [Number], // list of lit up grid tiles for p1
    "e2": [Number], // list of lit up grid tiles for p2
    "c1": [{id: Number, c: [Number], u: Number}], // controls setup for p1: id, array of panels that cards takes up, and # of uses for that card
    "c2": [{id: Number, c: [Number], u: Number}], // controls setup for p2
    "b1": [{id: Number, e:[{id: Number, v: Number}]}],// player 1's board (battlefield) state, each card is an object with id and an array of effects (objects)
    "b2": [{id: Number, e:[{id: Number, v: Number}]}]// player 2's board (battlefield) state
});

var demoGameModel = dbGames.model("games", gameStateSchema);

/****** exports ******/

exports.startNewDemo = function(callback){
    var newDemo = new demoGameModel({
        "pl": 1, // number of players who have joined the game
        "o": [], // Order of attackers for battle
        "ph": 0, // what game phase (0: pre-game, 1: start turn, 2: draw card, 3: main phase, 4: end of turn)
        "i1": 20, // Integrity of player 1's mother ship
        "i2": 20, // Integrity of player 2's mother ship
        "s1": 20, // Shield on player 1's mother ship
        "s2": 20, // Shield on player 2's mother ship
        "pr1": 2, // player 1's productivity (energy per turn)
        "pr2": 2, // player 2's productivity
        "sp1": [1], // special card(s) for p1
        "sp2": [2], // special card(s) for p2
        "g1": [2, 5], // grid layout for p1 (2x5)
        "g2": [3, 5], // grid layout for p2 (3x5)
        "e1": [], // list of lit up grid tiles for p1
        "e2": [], // list of lit up grid tiles for p2
        "c1": [{id: 1, c: [1], u: 0}, {id: 6, c: [2], u: 0}, {id: 2, c: [3], u: 0}, {id: 5, c: [4], u: 0}, {id: 4, c: [5], u: 0}, {id: 9, c: [6, 7], u: 0}, {id: 11, c: [8, 9, 10], u: 0}], // controls setup for p1: id and array of panels that cards takes up
        "c2": [{id: 1, c: [1], u: 0}, {id: 2, c: [2], u: 0}, {id: 3, c: [3], u: 0}, {id: 7, c: [4, 5], u: 0}, {id: 4, c: [6], u: 0}, {id: 16, c: [7], u: 0}, {id: 13, c: [8], u: 0}, {id: 15, c: [9, 10], u: 0}, {id: 8, c: [11, 12], u: 0}, {id: 10, c: [13, 14, 15], u: 0}], // controls setup for p2
        "b1": [],// player 1's board (battlefield) state, each card is an object with id, type, attack, defense and ability
        "b2": []// player 2's board (battlefield) state
    })
    newDemo.save(function(err, newDemo){
        callback(newDemo._id);
    });
};

exports.findOpenGame = function(callback){
    demoGameModel.findOne({"pl": 1}, "_id", function(err, game){
        if (err) {return err};
        if (game) {
            callback(game._id);
        } else {
            callback(0);
        }
    });
};

exports.updatePlayers = function(gameObject) {
    demoGameModel.update({_id: gameObject["id"]}, {$set: {"pl": gameObject["pl"]}}, function(){});
}

exports.getGameItem = function(id, itemKey, callback){
    gameId = mongoose.Types.ObjectId(id);
    demoGameModel.findOne({_id: gameId}, itemKey, function(err, gameObject){
        callback(gameObject[itemKey]);
    });
}

exports.getBattlefieldStates = function(id, callback){
    gameId = mongoose.Types.ObjectId(id);
    demoGameModel.findOne({_id: gameId}, "b1 b2", function(err, gameObject){
        callback(gameObject[itemKey]);
    });
}




