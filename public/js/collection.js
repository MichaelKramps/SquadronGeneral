var collection = {
    
    preload : function () {
        for (i = 1; i < 224; i++) {
            game.load.image(i.toString(), "/pics/" + i.toString() + ".jpg");
        }
        game.load.image("backArrow", "/pics/quartersBackArrow.png");
        game.load.image("forwardArrow", "/pics/deckForwardArrow.png");
    },

    create: function () {
        console.log(coreSet["45"].c);
        
        var backArrow = game.add.sprite(200,200,"backArrow");
        backArrow.width = 100;
        //backArrow.scale.setTo(0.2,0.2);
        game.add.sprite(200,400,"forwardArrow");
    },
    
    update: function () {
        
    }
    
};