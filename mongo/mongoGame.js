var exports = module.exports = {};

/****** requires ******/

var mongoose = require('mongoose');
var coreSet = require('../cards/coreSet.js');

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
    "b1": [{id: Number, s: Number, dm: Number, dc: Number, ap: Number, at: Number, t: Number, e:[{id: Number, v: Number}]}],// player 1's board (battlefield) state, each card is an object with id, speed, defenseCurrent, attackPower, attackType, target(for battle phase) and an array of effects (objects)
    "b2": [{id: Number, s: Number, dm: Number, dc: Number, ap: Number, at: Number, t: Number, e:[{id: Number, v: Number}]}]// player 2's board (battlefield) state
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

exports.setPlayersZero = function(gameId) {
    var id = mongoose.Types.ObjectId(gameId);
    demoGameModel.findOneAndUpdate({_id: id}, {$set: {"pl": 0}}, function(){});
}

exports.getGameItem = function(id, itemKey, callback){
    var gameId = mongoose.Types.ObjectId(id);
    demoGameModel.findOne({_id: gameId}, itemKey, function(err, gameObject){
        callback(gameObject[itemKey]);
    });
}

exports.getBattlefieldStates = function(id, callback){
    var gameId = mongoose.Types.ObjectId(id);
    demoGameModel.findOne({_id: gameId}, "b1 b2", function(err, gameObject){
        callback(gameObject);
    });
}

exports.getGame = function(id, callback){
    var gameId = mongoose.Types.ObjectId(id);
    demoGameModel.findOne({_id: gameId}, function(err, gameObject){
        callback(gameObject);
    });
}

// production phase

exports.shuffleArray = function shuffle(array) {
    
    var currentIndex = array.length;
    var temporaryValue;
    var randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

  return array;
}

exports.addEnergy = function(lightsArray, numLights, energyProduction){
    // make array with all panel #'s
    var allLightsArray = [];
    for (i = 0; i < numLights; i++) {
        allLightsArray.push(i + 1);
    }
    // randomize the panels
    var allLightsRandom = exports.shuffleArray(allLightsArray);
    
    // light up energyProduction # of panels
    var energyUsed = 0;
    var currentIndex = 0;
    energyProductionFix = numLights - lightsArray.length < energyProduction ? numLights - lightsArray.length : energyProduction;
    while (energyUsed < energyProductionFix) {
        var panelNumber = allLightsRandom[currentIndex];
        if (lightsArray.indexOf(panelNumber) == -1) {
            lightsArray.push(panelNumber);
            energyUsed += 1;
        }
        currentIndex += 1;
    }
    return lightsArray;
}

exports.getProduction = function(id, playerNumber, callback){
    exports.getGame(id, function(gameObject){
        // set up variables
        var lightsKey = "e" + playerNumber;
        var lightsArray = gameObject[lightsKey];
        var gridArray = gameObject["g" + playerNumber];
        var numLights = gridArray[0] * gridArray[1];
        var energyProduction = gameObject["pr" + playerNumber];
        
        // add energy to array
        var newLightsArray = exports.addEnergy(lightsArray, numLights, energyProduction);
        
        // set up $set object
        var set = {$set: {}};
        set.$set[lightsKey] = newLightsArray;
        demoGameModel.findOneAndUpdate({_id: gameObject["id"]}, set, {new: true}, function(err, newGameObject){
            callback(newGameObject);
        });
    });
    
}

exports.playCard = function(infoObject, callback){
    exports.getGame(infoObject.gameId, function(gameObject){
        var playerNumber = infoObject.player;
        var key = infoObject.cardKey;
        
        
        var controlsArray = gameObject["c" + playerNumber];
        var lightsArray = gameObject["e" + playerNumber];
        var battlefieldArray = gameObject["b" + playerNumber];
        
        // first check if card is already on battlefield
        var inPlay = false;
        for (k = 0; k < battlefieldArray.length; k++) {
            var currentCard = battlefieldArray[k]
            if (currentCard.id == key) {
                inPlay = true;
            }
        }
        
        if (!inPlay) {
            var thisCard = {};
            
            for (i = 0; i < controlsArray.length; i++) {
                var currentCard = controlsArray[i];
                if (currentCard.id == key) {
                    thisCard = currentCard;
                }
            }
            
            for (j = 0; j < lightsArray.length; j++) {
                for (k = 0; k < thisCard.c.length; k++) {
                    if (lightsArray[j] == thisCard.c[k]) {
                        thisCard.c.splice(k, 1);
                    }
                }
            }
            
            if (thisCard.c.length == 0) {
                // Prepare to update the game state
                var cardCoreSet = coreSet[key];
                var cardObject = {id: key, s: cardCoreSet.s, dm: cardCoreSet.d.m, dc: cardCoreSet.d.c, ap: cardCoreSet.a.p, at: cardCoreSet.a.t, t: -2, e: []};
                battlefieldArray.push(cardObject);
                // build the set object
                var battlefieldId = "b" + playerNumber;
                var set = {$set: {}};
                set.$set[battlefieldId] = battlefieldArray;
                // update game state
                demoGameModel.findOneAndUpdate({_id: infoObject.gameId}, set, {new: true}, function(err, newGameObject){
                    // Then put card in to play
                    callback(true);
                });
            } else {
                // do nothing / maybe a sound effect
                callback(false);
            }
            
        } else {
            callback(false);
        }
    });
}

exports.targetResolve = function (gameId, playerNumber, commandKey, targetKey, targetArray, callback) {
    // checks
    
    exports.getGame(gameId, function(gameObject){    
        
        var controlsId = "c" + playerNumber;
        var controlsArray = gameObject[controlsId];
        var lightsId = "e" + playerNumber;
        var lightsArray = gameObject[lightsId];
        var battlefieldId = "b" + playerNumber;
        var battlefieldArray = gameObject[battlefieldId];
        
        // can the card be played (check lights)
        var thisCommandCard = {};
        var thisCommandCardCost = [];
        
        // get the card object from the control grid array
        for (i = 0; i < controlsArray.length; i++) {
            var currentCard = controlsArray[i];
            if (currentCard.id == commandKey) {
                thisCommandCard = currentCard;
            }
        }
        
        // check if the all the lights are lit
        for (j = 0; j < lightsArray.length; j++) {
            for (k = 0; k < thisCommandCard.c.length; k++) {
                if (lightsArray[j] == thisCommandCard.c[k]) {
                    thisCommandCardCost.push(thisCommandCard.c[k]);
                    thisCommandCard.c.splice(k, 1);
                }
            }
        }
        
        // if the card is playable, change the game state
        if (thisCommandCard.c.length == 0) {
            // Put the cost back in thisCommandCard
            thisCommandCard.c = thisCommandCardCost;
            
            // remove lights from lightsArray
            for (l = 0; l < lightsArray.length; l++) {
                for (m = 0; m < thisCommandCard.c.length; m++) {
                    if (lightsArray[l] == thisCommandCard.c[m]) {
                        lightsArray.splice(l, 1);
                    }
                }
            }
            
            // add 1 to # of uses
            thisCommandCard.u += 1;
            
            // create new battlefield state
            for (n = 0; n < battlefieldArray.length; n++) {
                thisShip = battlefieldArray[n];
                if (thisShip.id == targetKey) {
                    for (p = 0; p < targetArray.length; p++) {
                        var thisChange = targetArray[p];
                        var destinationKey = thisChange.k;
                        // pinpoint attribute to be changed and update
                        thisShip[destinationKey] += thisChange.u;
                    }
                }
            }
            // build the set object
            var battlefieldId = "b" + playerNumber;
            var set = {$set: {}};
            set.$set[battlefieldId] = battlefieldArray;
            set.$set[lightsId] = lightsArray;
            set.$set[controlsId] = controlsArray;
            // update game state
            demoGameModel.findOneAndUpdate({_id: gameId}, set, {new: true}, function(err, newGameObject){
                // Then put card in to play
                callback(newGameObject);
            });
        } else {
            // do nothing / maybe a sound effect
            callback(false);
        }
    }); 
}

exports.mainPhaseCompleted = function (id, callback) {
    var gameId = mongoose.Types.ObjectId(id);
    demoGameModel.findOneAndUpdate({_id: gameId}, {$inc: {"pl": 1}}, {new: true}, function(err, newGameObject){
        callback(newGameObject["pl"]);
    });
}

exports.battleOrder = function (gameId, callback) {
    exports.getGame(gameId, function(gameObject){
        var newBattleOrder = [];
        var orderArray = [];
        var battlefield1 = gameObject["b1"];
        var battlefield2 = gameObject["b2"];
        
        // put both battlefields into one array
        for (i = 0; i < battlefield1.length; i++) {
            var currentCard = battlefield1[i];
            var cardObject = {};
            var cardSpeed = currentCard.s;
            var roundSpeed = Math.random() * cardSpeed;
            cardObject.key = currentCard.id + "1";
            cardObject.s = roundSpeed;
            orderArray.push(cardObject);
        }
        
        for (j = 0; j < battlefield2.length; j++) {
            var currentCard = battlefield2[j];
            var cardObject = {};
            var cardSpeed = currentCard.s;
            var roundSpeed = Math.random() * cardSpeed;
            cardObject.key = currentCard.id + "2";
            cardObject.s = roundSpeed;
            orderArray.push(cardObject);
        }
        
        // order cards by speed
        orderArray.sort(function(a,b){return b.s - a.s});
        
        // create game order array
        for (l = 0; l < orderArray.length; l++) {
            var card = orderArray[l];
            newBattleOrder.push(card.key);
        }
        
        // update game state
        var set = {$set: {}};
        set.$set["o"] = newBattleOrder;
        set.$set["pl"] = 0;
        // update game state
        demoGameModel.findOneAndUpdate({_id: gameId}, set, {new: true}, function(err, newGameObject){
            // Then put card in to play
            callback(newGameObject);
        });
    });
}

exports.declareAttackTarget = function (attackerKey, targetKey, playerNumber, gameId, callback) {
    // {id: Number, s: Number, dm: Number, dc: Number, ap: Number, at: Number, t: Number, e:[{id: Number, v: Number}]}
    exports.getGame(gameId, function(gameObject){
        var newBattlefield = [];;
        var attKey = Math.floor(attackerKey / 10);
        var battlefield = gameObject["b" + playerNumber];
        for(i = 0; i < battlefield.length; i++) {
            currentCard = battlefield[i];
            if (currentCard.id == attKey) {
                currentCard.t = targetKey;
                newBattlefield.push(currentCard);
            } else {
                newBattlefield.push(currentCard);
            }
        }
        
        var set = {$set: {}};
        set.$set["b" + playerNumber] = newBattlefield;
        
        demoGameModel.findOneAndUpdate({_id: gameId}, set, {new: true}, function(err, newGameObject){
            // Then put card in to play
            callback(newGameObject);
        });
    });
}

exports.attackPhaseCompleted = function (gameId, callback) {
    var id = mongoose.Types.ObjectId(gameId);
    demoGameModel.findOneAndUpdate({_id: id}, {$inc: {"pl": 1}}, {new: true}, function(err, newGameObject){
        callback(newGameObject["pl"]);
    });
}

exports.dealDamagePhase = function (gameId, callback) {
    
    exports.getGame(gameId, function(gameObject){
        callback(gameObject);
        var battlefield1 = gameObject["b1"];
        var battlefield2 = gameObject["b2"];
        var battleOrder = gameObject["o"];
    });
}

exports.shipFires = function (gameId, callback) {
    var id = mongoose.Types.ObjectId(gameId); 
    exports.getGame(gameId, function(gameObject) {
        // set current states
        var attackOrder = gameObject["o"];
        var attackerKey = attackOrder[0];
        var attackerPlayer = attackerKey % 10;
        var targetPlayer = attackerPlayer == 1 ? 2 : 1;
        var attackerId = Math.floor(attackerKey / 10);
        var attacker = {};
        var attackBattlefield = attackerPlayer == 1 ? gameObject["b1"] : gameObject["b2"];
        for (j = 0; j < attackBattlefield.length; j++) {
            var currentCard = attackBattlefield[j];
            if (attackerId == currentCard.id) {
                attacker = currentCard;
            }
        }
        
        var targetBattlefield = attackerPlayer == 1 ? gameObject["b2"] : gameObject["b1"];
        var newTargetBattlefield = [];
        var destroyedShipOrderId = 0;
        
        var primeShield = gameObject["s" + targetPlayer];
        var primeIntegrity = gameObject["i" + targetPlayer];
        var newPrimeShield = primeShield;
        var newPrimeIntegrity = primeIntegrity;
        
        var lightsExtinguish = [];
        
        if (attacker.t > -1) {
            for (k = 0; k < targetBattlefield.length; k++) {
                var currentCard = targetBattlefield[k];
                if (attacker.t == k) {
                    var newCard = currentCard;
                    var newDefense = currentCard.dc - attacker.ap;
                    newCard.dc = newDefense;
                    if (newDefense < 1) {
                        destroyedShipOrderId = "" + currentCard.id + targetPlayer;
                        destroyedPlayerControls = gameObject["c" + targetPlayer];
                        for (m = 0; m < destroyedPlayerControls.length; m++) {
                            var currentControl = destroyedPlayerControls[m];
                            if (currentControl.id == currentCard.id) {
                                lightsExtinguish = currentControl.c;
                            }
                        }
                    }
                    newTargetBattlefield.push(newCard);
                } else {
                    newTargetBattlefield.push(currentCard);
                }
            }
        } else if (attacker.t == -1) {
            // fire on prime ship
            if (primeShield > 0) {
                newPrimeShield = primeShield - attacker.ap;
            } else {
                newPrimeIntegrity = primeIntegrity - attacker.ap;
            }
            
            if (newPrimeShield < 0) {
                newPrimeIntegrity = primeIntegrity + newPrimeShield;
            }
        } else { 
            // no target set
            
        }
        
        
        var newAttackOrder = [];
        
        for (i = 1; i < attackOrder.length; i++) {
            var currentId = attackOrder[i];
            // i starts at 1 so we don't push first element in array
            var orderId = parseInt(destroyedShipOrderId);
            if (orderId != currentId) {
                newAttackOrder.push(attackOrder[i]);
            }
        }
        
        var newLightsArray = [];
        var lightsArray = gameObject["e" + targetPlayer];
        for (n = 0; n < lightsArray.length; n++) {
            newLightsArray.push(lightsArray[n]);
        }
        for(o = 0; o < lightsExtinguish.length; o++){
            newLightsArray.splice(newLightsArray.indexOf(lightsExtinguish[o]), 1);
        }
        
        // assess damages
        
        var set = {$set: {}};
        set.$set["o"] = newAttackOrder;
        set.$set["pl"] = 0;
        if (attacker.t > -1) {
            set.$set["b" + targetPlayer] = newTargetBattlefield;
        } else if (attacker.t == -1) {
            set.$set["i" + targetPlayer] = newPrimeIntegrity;
            set.$set["s" + targetPlayer] = newPrimeShield;
        }
        if (lightsExtinguish.length > 0) {
            set.$set["e" + targetPlayer] = newLightsArray;
        }
        demoGameModel.findOneAndUpdate({_id: id}, set, {new: true}, function(err, newGameObject){
            callback(newGameObject);
        });
    });
}

exports.endOfTurn = function (gameId, callback) {
    id = mongoose.Types.ObjectId(gameId);
    exports.getGame(gameId, function(gameObject) {
        // reset targets
        var battlefield1 = gameObject["b1"];
        var battlefield2 = gameObject["b2"];
        var newBattlefield1 = [];
        var newBattlefield2 = [];
        for (i = 0; i < battlefield1.length; i++) {
            var currentCard = battlefield1[i];
            if (currentCard.dc > 0) {
                newBattlefield1.push(currentCard);
            }
        }
        for (j = 0; j < battlefield2.length; j++) {
            var currentCard = battlefield2[j];
            if (currentCard.dc > 0) {
                newBattlefield2.push(currentCard);
            }
        }
        
        var set = {$set: {}};
        set.$set["b1"] = newBattlefield1;
        set.$set["b2"] = newBattlefield2;
        demoGameModel.findOneAndUpdate({_id: id}, set, {new: true}, function(err, newGameObject){
            callback();
        });
    });
}






