var solo = {
    
    preload : function () {
        
    },

    create: function () {
        var style = { font: game.world._height * 0.05 + "px Arial", fill: "#ff0044", align: "center" };
        
        socket.emit("getGameInfo");

    },
    
    update: function () {
        
    }
    
};