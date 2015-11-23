var quarters = {
    
    preload : function () {
        game.load.image('soloDemoButton','pics/soloDemoButton.png');
    },

    create: function () {
        var style = { font: game.world._height * 0.05 + "px Arial", fill: "#ff0044", align: "center" };
        
        // Player Info
        quartersHeader = game.add.text(game.world._width * 0.05, game.world._height * 0.1, player.username + "'s Quarters", style);
        quartersHeader.inputEnabled = true;
        quartersHeader.anchor.set(0);
        
        /* var rank = game.add.text(game.world._width * 0.05, game.world._height * 0.2, "Rank: ", style);
        rank.anchor.set(0);
        
        var tournamentPoints = game.add.text(game.world._width * 0.05, game.world._height * 0.3, "Tournament Points: ", style);
        tournamentPoints.anchor.set(0); */
        
        // Change Game States
        soloDemoButton = game.add.button(game.world._width * 0.5, game.world._height * 0.3, 'soloDemoButton', this.startNewDemo);
        
        collection = game.add.text(game.world._width * 0.5, game.world._height * 0.4, "collection", style);
        collection.inputEnabled = true;
        collection.anchor.set(0);
    },
    
    update: function () {
        this.changeStates(collection, "collection");
    },
    
    startNewDemo: function() {
        // give player a number 1 or 2 (assign in cookie)
        var playerNumber = Math.round(Math.random() + 1);
        document.cookie = "playerNumber=" + playerNumber.toString();
        // start a new game and get game id (assign in cookie)
        socket.emit("startNewDemo", playerNumber);
        socket.on("sendNewDemo", function(gameId){
            document.cookie = "gameId=" + gameId;
            //change game states to solo
            game.state.start("solo");
        });       
    },
    
    changeStates: function (text, state) {
        if(text.input.pointerOver()){
            text.alpha = 0.5;
        } else if (text.input.pointerOut()) {
            text.alpha = 1;
        }
        
        if (text.input.pointerDown()) {
            game.state.start(state);
        }
    }

};