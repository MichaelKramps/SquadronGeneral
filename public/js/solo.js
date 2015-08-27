var solo = {
    
    preload : function () {
        
    },

    create: function () {
        var style = { font: game.world._height * 0.05 + "px Arial", fill: "#ff0044", align: "center" };
        
        var rank = game.add.text(game.world._width * 0.05, game.world._height * 0.2, "Rank: ", style);
        rank.anchor.set(0);

    },
    
    update: function () {
        
    }
    
};