var quarters = {

    preload : function() {
        socket.emit("gameStart");
    },

    create: function () {
        var style = { font: "65px Arial", fill: "#ff0044", align: "center" };

        var text = game.add.text(game.world.centerX, game.world.centerY, "- phaser -\nwith a sprinkle of\npixi dust", style);

        text.anchor.set(0.5);
    }

};