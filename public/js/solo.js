var solo = {
    
    preload : function () {
        game.load.spritesheet("tiles", "pics/controlTiles.png", 60, 60, 6);
    },

    create: function () {  
        
        var dashboard = game.add.graphics(0, game.world._height * 0.75);
        dashboard.lineStyle(3, 0x1458b7);
        dashboard.lineTo(game.world._width, 0);
        
        soloState.drawGrid();
        
        
        var style = { font: game.world._height * 0.05 + "px Arial", fill: "#ff0044", align: "center" };
        this.startGame();
    },
    
    getCookie: function (name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    },
    
    startGame: function () {
        // while loop can go here
        
    },
    
    drawGrid: function () {
        
        var playerId = soloState.getCookie("gameId");
        var playerNumber = soloState.getCookie("playerNumber");
        
        socket.emit("getGridDimensions", [playerId, "g" + playerNumber]);
        socket.on("sendGridDimensions", function(gridArray){
            socket.emit("getControlGrid", [playerId, "c" + playerNumber]);
            socket.on("sendControlGrid", function(controls){
                socket.emit("getGridLights", [playerId, "e" + playerNumber]);
                socket.on("sendGridLights", function(lightsArray){
                    var tileWidth = (game.world._width * 0.5) / (2 * gridArray[1]);
                    var tileHeight = (game.world._width * 0.25) / (2 * gridArray[0]);
                    for (i = 1; i < (gridArray[0] * gridArray[1]) + 1; i++) {
                        
                        var xCoordinate = ((game.world._width * 0.5 * (i % gridArray[1])) / (gridArray[1] + 1)) - (tileWidth / 2);
                        var yCoordinate = (((game.world._height * 0.25 * (Math.ceil(i / gridArray[1]))) / (gridArray[0] + 1)) - (tileHeight / 2)) + (game.world._height * 0.75);
                        
                        if (xCoordinate < 0) {
                            xCoordinate = ((game.world._width * 0.5 * (gridArray[1])) / (gridArray[1] + 1)) - (tileWidth / 2);
                        }
                        
                        var tileFrame = 0;
                        
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
                        
                        var tile = game.add.sprite(xCoordinate, yCoordinate, "tiles");
                        tile.frame = tileFrame;
                    }
                });
            });
        });
        
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
    }
    
};