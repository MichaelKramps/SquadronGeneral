var quarters = {

    preload : function() {
        
    },

    create: function () {
        var style = { font: "65px Arial", fill: "#ff0044", align: "center" };

        var text = game.add.text(game.world.centerX, game.world.centerY, player.username + "'s Quarters", style);

        text.anchor.set(0.5);
    }

};