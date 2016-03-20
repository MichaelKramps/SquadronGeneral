var solo = {
    
    controls: null,
    grid: null,
    attackOrder: null,
    stats: null,
    opponent: null,
    battlefield: null,
    //
    
    preload : function () {
        // join this game's socket room
        socket.emit("joinRoom", soloState.getCookie("gameId"));
        
        game.load.spritesheet("tiles", "pics/controlTiles.png", 60, 60, 6);
        game.load.image('energyPanel', 'pics/energyPanel.jpg');
        game.load.image('opponentShip', 'pics/x-wing.png');
        game.load.image('opponentShield', 'pics/opponent-shield.png');
        
        for (i = 1; i < 22; i++) {
            var num = i.toString();
            game.load.image(num, "pics/" + num + ".jpg");
        }
    },

    create: function () {  
        
        soloState.controls = game.add.group();
        soloState.grid = game.add.group();
        soloState.attackOrder = game.add.group();
        soloState.stats = game.add.group();
        soloState.opponent = game.add.group();
        soloState.battlefield = game.add.group();
        
        var dashboard = game.add.graphics(0, game.world._height * 0.75);
        dashboard.lineStyle(3, 0x1458b7);
        dashboard.lineTo(game.world._width, 0);
        
        // Get game object from Mongo and start game
        socket.emit("getGame", soloState.getCookie("gameId"));
        socket.on("sendGame", function(gameObject){
            socket.removeListener("sendGame", soloState.startGame(gameObject));
        });
        
        return;
    },
    
    getCookie: function (name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    },
    
    startGame: function (gameObject) {
        
        // draw the initial game state
        
        soloState.drawGrid(gameObject, false, soloState.shrinkGrid(gameObject));
        soloState.drawEnergy();
        soloState.drawOpponent();
        //soloState.drawSpecialCards();
        //soloState.drawStats();
        
        // check if both players are ready to start
        
        if (soloState.getCookie("playerNumber") == 2) {
            socket.emit("player2Ready", soloState.getCookie("gameId"));
        }
        socket.on("playersReady", function(){
            // start game when both players join
            socket.removeListener("playersReady", soloState.productionPhase());
        });
    },
    
    drawGrid: function (gameObject, input, callback) {
        
        var gameId = soloState.getCookie("gameId");
        var playerNumber = soloState.getCookie("playerNumber");
        
        // First thing is to clear previous grid
        soloState.grid.removeAll();
        
        var gridArray = gameObject["g" + playerNumber];
        var controls = gameObject["c" + playerNumber];
        var lightsArray = gameObject["e" + playerNumber];
        
        // variable to help with connecting cards on grid
        var cardPanelArray = [];
        
        var gridWidth = (gridArray[1] * 70) + 10;
        var gridHeight = (gridArray[0] * 70) + 10;
        
        soloState.grid.x = (game.world._width * 0.15);
        soloState.grid.y = (game.world._height * 0.75) - gridHeight;
                
        for (i = 1; i < (gridArray[0] * gridArray[1]) + 1; i++) {
            
            // determine x/y coordinates for grid panels
            var xCoordinate = 0;
            if (Math.ceil(i / gridArray[1]) % 2 != 0) {
                xCoordinate = 10 + (70 * ((i - 1) % gridArray[1]));
            } else {
                xCoordinate = gridWidth - (70 + (70 * ((i - 1) % gridArray[1])));
            }
            var yCoordinate = 10 + (70 * Math.floor((i - 1) / gridArray[1]));
            
            var tileFrame = 0;
            
            // determine which panel color to use
            for(j = 0; j < controls.length; j++) {
                var currentCard = controls[j];
                var cardCost = currentCard.c;
                for (l = 0; l < cardCost.length; l++) {
                    if (cardCost[l] == i) {
                        if (currentCard.u < 2) {
                            tileFrame = 0;
                        } else if (currentCard.u < 3) {
                            tileFrame = 2;
                        } else {
                            tileFrame = 4;
                        }
                    }
                }
            }
            
            for (k = 0; k < lightsArray.length; k++) {
                if (lightsArray[k] == i) {
                    tileFrame += 1;
                }
            }
            var tile = soloState.grid.create(xCoordinate, yCoordinate, "tiles");
            tile.frame = tileFrame;
            
            
            // put cards in the game
            for (m = 0; m < controls.length; m++) {
                var currentCard = controls[m];
                var currentCardPanels = currentCard.c;
                for (n = 0; n < currentCardPanels.length; n++) {
                    if (currentCardPanels[n] == i) {
                        var cardId = currentCard.id;
                        
                        cardPanelArray.push(cardId);
                        
                        if (cardPanelArray[i - 1] == cardPanelArray[i - 2]) {
                            
                            // if card takes up >1 panel, connect panels
                            if (i % gridArray[1] == 1) {
                                var panelConnect = game.add.graphics(xCoordinate + 30, yCoordinate);
                                soloState.grid.add(panelConnect);
                                panelConnect.lineStyle(60, 0xffffff);
                                panelConnect.lineTo(0, -10);
                            } else if (Math.ceil(i / gridArray[1]) % 2 != 0) {
                                var panelConnect = game.add.graphics(xCoordinate, yCoordinate + 30);
                                soloState.grid.add(panelConnect);
                                panelConnect.lineStyle(60, 0xffffff);
                                panelConnect.lineTo(-10, 0);
                            } else {
                                var panelConnect = game.add.graphics(xCoordinate + 60, yCoordinate + 30);
                                soloState.grid.add(panelConnect);
                                panelConnect.lineStyle(60, 0xffffff);
                                panelConnect.lineTo(10, 0);
                            }
                        }
                        var cardPicture = soloState.grid.create(xCoordinate + 10, yCoordinate, cardId.toString()); // 130 x 195 pixels
                        cardPicture.inputEnabled = true;
                        cardPicture.events.onInputOver.add(soloState.showCard, this);
                        cardPicture.events.onInputOut.add(soloState.unshowCard, this);
                        cardPicture.events.onInputUp.add(soloState.unshowCard, this);
                        if (input) {
                            // for phases where cards are playable
                            var cardKey = cardPicture.key;
                            cardPicture.events.onInputDown.add(soloState.attemptPlayCard, {key: cardKey, game: gameObject});
                        } else {
                            // for phases where cards are not playable
                            
                        }
                        cardPicture.scale.setTo(60 / 195, 60 / 195);
                    }
                }
            }
        }
        callback;
    },
    
    showCard: function (sprite) {
        var key = sprite.key;
        var cardPicture = soloState.controls.create(0, game.world._height * 0.75, key.toString());
        cardPicture.scale.setTo((game.world._height * 0.25) / 195, (game.world._height * 0.25) / 195)
    },
    
    unshowCard: function (sprite) {
        var controlsChildren = soloState.controls.children;
        var lastChildKey = controlsChildren.length - 1;
        var lastChild = controlsChildren[lastChildKey];
        soloState.controls.remove(lastChild);
    },
    
    shrinkGrid: function (gameObject) {
        var shrink = game.add.tween(soloState.grid.scale);
        var slideDown = game.add.tween(soloState.grid);
        
        var gridKey = "g" + soloState.getCookie("playerNumber");
        var gridArray = gameObject[gridKey];
        
        var gridWidth = (gridArray[1] * 70) + 10;
        var gridHeight = (gridArray[0] * 70) + 10;
        
        slideDown.to({y: game.world._height * 0.75}, 500, Phaser.Easing.Exponential.Out);
        shrink.to({x: (game.world._width * 0.15) / gridWidth, y: (game.world._height * 0.12) / gridHeight}, 500, Phaser.Easing.Exponential.Out);
        
        slideDown.start();
        shrink.start();
    },
    
    expandGrid: function (gameObject) {
        
        var expand = game.add.tween(soloState.grid.scale);
        var slideUp = game.add.tween(soloState.grid);
        
        var gridKey = "g" + soloState.getCookie("playerNumber");
        var gridArray = gameObject[gridKey];
        
        var gridWidth = (gridArray[1] * 70) + 10;
        var gridHeight = (gridArray[0] * 70) + 10;
        
        slideUp.to({y: (game.world._height * 0.75) - gridHeight}, 500, Phaser.Easing.Exponential.Out);
        expand.to({x: 1, y: 1}, 500, Phaser.Easing.Exponential.Out);
        
        slideUp.start();
        expand.start();
    },
    
    drawEnergy: function () {
        socket.emit("getShipProductivity", [soloState.getCookie("gameId"), "pr" + soloState.getCookie("playerNumber")]);
        socket.on("sendShipProductivity", function(productivity){
            var circle = game.add.graphics(0, 0);

            // graphics.lineStyle(2, 0xffd900, 1);

            circle.beginFill(0x1458b7, 1);
            circle.drawCircle(game.world._width * 0.225, game.world._height * 0.93, game.world._height * 0.10);
            soloState.controls.add(circle);
            
            var style = { font: game.world._height * 0.05 + "px Arial", fill: "#ff0044", align: "center" };
            var production = game.add.text((game.world._width * 0.225) - 10, game.world._height * 0.905, "2", style);
            socket.removeListener("sendShipProductivity", console.log("Productivity drawn"));
        });
    },
    
    drawSpecialCards: function () {
        //console.log("special");
    },
    
    drawOpponent: function () {
        socket.emit("getGame", soloState.getCookie("gameId"));
        socket.on("sendGame", function(gameObject){
            socket.removeListener("sendGame", soloState.drawOpponentShip(gameObject));
        });
    },
    
    drawOpponentShip: function (gameObject) {
        var opponentNumber = soloState.returnOpponentNumber();
        var opponentShield = gameObject["s" + opponentNumber];
        var opponentIntegrity = gameObject["i" + opponentNumber];
        var scale = (game.world._height * 0.2) / 208;
        
        if (opponentShield > 0) {
            var opponentShieldPicture = soloState.opponent.create((game.world._width * 0.5) - (300 * scale), 0, "opponentShield");
            opponentShieldPicture.scale.setTo(scale, scale);
            var styleShield = { font: game.world._height * 0.05 + "px Arial", fill: "#660033", align: "center"};
            var shield = game.add.text((game.world._width * 0.5) - 15, 156 * scale, opponentShield, styleShield);
        }
        
        var opponentPicture = soloState.opponent.create((game.world._width * 0.5) - (263 * scale), 0, "opponentShip");
        opponentPicture.scale.setTo(scale, scale);
        
        var styleIntegrity = { font: game.world._height * 0.05 + "px Arial", fill: "#ffff66", align: "center"};
        var integrity = game.add.text((game.world._width * 0.5) - 15, scale, opponentIntegrity, styleIntegrity);
    },
    
    startDrawBattlefield: function () {
        socket.emit("getGame", soloState.getCookie("gameId"));
        socket.on("sendGame", function(gameObject){
            socket.removeListener("sendGame", soloState.drawBattlefield(gameObject));
        });
    },
    
    drawBattlefield: function (gameObject) {
        // first clear the battlefield of all ships
        
        soloState.battlefield.removeAll();
        
        // set scaling variables (cards 130 x 195)
        
        var scale = (game.world._height * 0.2) / 195;
        var cardWidth = 130 * scale;
        
        // Then redraw battlefield
        // start with opponent's battlefield
        var opponentNumber = soloState.returnOpponentNumber();
        var opponentBattlefield = gameObject["b" + opponentNumber];
        var yCoordinateOpponent = game.world._height * 0.27;
        
        for (i = 0; i < opponentBattlefield.length; i++) {
            var xCoordinate = (((i + 1) / (opponentBattlefield.length + 1)) * game.world._width) - (cardWidth / 2);
            var currentSprite = soloState.battlefield.create(xCoordinate, yCoordinateOpponent, "1");
            currentSprite.scale.setTo(scale, scale);
            
            // draw stats for that card
            var textHeight = (195 * scale) * 0.2;
            var attackValue = currentCard.ap;
            var defenseValue = currentCard.dc;
            var attackX = xCoordinate;
            var defenseX = xCoordinate + (cardWidth * 0.8);
            var statsY = (yCoordinateOpponent + (195 * scale)) - textHeight;
            
            var styleStats = { font: textHeight + "px Arial", fill: "#0000ff", align: "center"};
            var attack = new Phaser.Text(game, attackX, statsY, attackValue, styleStats);
            soloState.battlefield.add(attack);
            
            var defense = new Phaser.Text(game, defenseX, statsY, defenseValue, styleStats);
            soloState.battlefield.add(defense);
        }
        
        // then draw my battlefield
        var playerNumber = soloState.returnPlayerNumber();
        var playerBattlefield = gameObject["b" + playerNumber];
        var yCoordinatePlayer = game.world._height * 0.52;
        
        for (j = 0; j < playerBattlefield.length; j++) {
            var currentCard = playerBattlefield[j];
            
            // draw card
            var xCoordinate = (((j + 1) / (playerBattlefield.length + 1)) * game.world._width) - (cardWidth / 2);
            var currentSprite = soloState.battlefield.create(xCoordinate, yCoordinatePlayer, "1");
            currentSprite.scale.setTo(scale, scale);
            
            // draw stats for that card
            var textHeight = (195 * scale) * 0.2;
            var attackValue = currentCard.ap;
            var defenseValue = currentCard.dc;
            var attackX = xCoordinate;
            var defenseX = xCoordinate + (cardWidth * 0.8);
            var statsY = (yCoordinatePlayer + (195 * scale)) - textHeight;
            
            var styleStats = { font: textHeight + "px Arial", fill: "#0000ff", align: "center"};
            var attack = new Phaser.Text(game, attackX, statsY, attackValue, styleStats);
            soloState.battlefield.add(attack);
            
            var defense = new Phaser.Text(game, defenseX, statsY, defenseValue, styleStats);
            soloState.battlefield.add(defense);
        }
        game.world.bringToTop(soloState.grid);
    },
    
    productionPhase: function () {
        socket.emit("getProduction", [soloState.getCookie("gameId"), soloState.returnPlayerNumber()]);
        socket.on("sendProduction", function (gameObject) {
            socket.removeListener("sendProduction", soloState.drawGrid(gameObject, true, soloState.expandGrid(gameObject)));
        });
    },
    
    attemptPlayCard: function () {
        var key = this.key;
        var gameObject = this.game;
        
        // ask if player is allowed to play card
        var playerNumber = soloState.getCookie("playerNumber");
        
        var controlsArray = gameObject["c" + playerNumber];
        var lightsArray = gameObject["e" + playerNumber];
        var battlefieldArray = gameObject["b" + playerNumber];
        
        // first check if card is already on battlefield
        var inPlay = false;
        for (k = 0; k < battlefieldArray; k++) {
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
                // check with database 
                socket.emit("cardPlayable", {gameId:soloState.getCookie("gameId"), cardKey: key, player: playerNumber});
                // If OK then change game state
                socket.on("sendCardPlayable", function(answer){
                    if (answer) {
                        soloState.startDrawBattlefield();
                    } else {
                        // do nothing / maybe a sound effect
                        console.log("Card already in play");
                    }
                    socket.removeListener("sendCardPlayable", soloState.blank());
                });
            } else {
                // do nothing / maybe a sound effect
                console.log("card not playable");
            }
        }
    },
    
    returnPlayerNumber: function () {
        return soloState.getCookie("playerNumber");
    },
    
    returnOpponentNumber: function () {
        if (soloState.returnPlayerNumber() == "1") {
            return "2";
        } else {
            return "1";
        }
    },
    
    blank: function () {
        // placeholder function for socket.removeListener callback
    }
    
};