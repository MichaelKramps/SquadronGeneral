var quarters = {

    preload : function() {
        
    },

    create: function () {
        var style = { font: game.world._height * 0.05 + "px Arial", fill: "#ff0044", align: "center" };
        
        // Player Info
        var quartersHeader = game.add.text(game.world._width * 0.05, game.world._height * 0.1, player.username + "'s Quarters", style);
        quartersHeader.anchor.set(0);
        
        var rank = game.add.text(game.world._width * 0.05, game.world._height * 0.2, "Rank: ", style);
        rank.anchor.set(0);
        
        var tournamentPoints = game.add.text(game.world._width * 0.05, game.world._height * 0.3, "Tournament Points: ", style);
        tournamentPoints.anchor.set(0);
        
        // Change Game States

    },

};