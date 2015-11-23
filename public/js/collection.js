var collection = {
    
    preload : function () {
        for (i = 1; i < 224; i++) {
            game.load.image(i.toString(), "/pics/" + i.toString() + ".jpg");
        }
        
        game.load.image("mercenariesButton", "/pics/mercenariesButton.jpg");
        game.load.image("earthlingsButton", "/pics/earthlingsButton.jpg");
        game.load.image("martiansButton", "/pics/martiansButton.jpg");
        game.load.image("shapeshiftersButton", "/pics/shapeshiftersButton.jpg");
        game.load.image("robotsButton", "/pics/robotsButton.jpg");
        game.load.image("smugglersButton", "/pics/smugglersButton.jpg");
        game.load.image("parasitesButton", "/pics/parasitesButton.jpg");
        game.load.image("brutesButton", "/pics/brutesButton.jpg");
        game.load.image("republicButton", "/pics/republicButton.jpg");
        
    },

    create: function () {
        
        this.typeButtons();
        
        
    },
    
    update: function () {
        
    },
    
    typeButtons: function () {
        buttonHeight = game.world._height/10;
        topBottomGap = buttonHeight/2;
        buttonWidth = game.world._width/5;
        
        var mercenariesButton = game.add.button(game.world._width * 0.05, topBottomGap, "mercenariesButton", this.mercenarySort, this);
        mercenariesButton.height = buttonHeight;
        mercenariesButton.width = buttonWidth;
        var earthlingsButton = game.add.button(game.world._width * 0.05, topBottomGap + buttonHeight, "earthlingsButton", this.earthlingSort, this);
        earthlingsButton.height = buttonHeight;
        earthlingsButton.width = buttonWidth;
        var martiansButton = game.add.button(game.world._width * 0.05, topBottomGap + (2 * buttonHeight), "martiansButton", this.martianSort, this);
        martiansButton.height = buttonHeight;
        martiansButton.width = buttonWidth;
        var shapeshiftersButton = game.add.button(game.world._width * 0.05, topBottomGap + (3 * buttonHeight), "shapeshiftersButton", this.shapeshifterSort, this);
        shapeshiftersButton.height = buttonHeight;
        shapeshiftersButton.width = buttonWidth;
        var robotsButton = game.add.button(game.world._width * 0.05, topBottomGap + (4 * buttonHeight), "robotsButton", this.robotSort, this);
        robotsButton.height = buttonHeight;
        robotsButton.width = buttonWidth;
        var smugglersButton = game.add.button(game.world._width * 0.05, topBottomGap + (5 * buttonHeight), "smugglersButton", this.smugglerSort, this);
        smugglersButton.height = buttonHeight;
        smugglersButton.width = buttonWidth;
        var parasitesButton = game.add.button(game.world._width * 0.05, topBottomGap + (6 * buttonHeight), "parasitesButton", this.parasiteSort, this);
        parasitesButton.height = buttonHeight;
        parasitesButton.width = buttonWidth;
        var brutesButton = game.add.button(game.world._width * 0.05, topBottomGap + (7 * buttonHeight), "brutesButton", this.bruteSort, this);
        brutesButton.height = buttonHeight;
        brutesButton.width = buttonWidth;
        var republicButton = game.add.button(game.world._width * 0.05, topBottomGap + (8 * buttonHeight), "republicButton", this.republicSort, this);
        republicButton.height = buttonHeight;
        republicButton.width = buttonWidth;
    },    
    
    sortCards: function (type) {
        //look through coreSet, push positive values into array
        cards = [];
        for (var id in coreSet) {
            if (coreSet[id].i.s == type) {
                cards.push(id);
            }
        }
        this.displayCards(cards);
    },
    
    mercenarySort: function () {
        this.sortCards(0);
    },
    
    earthlingSort: function () {
        this.sortCards(1);
    },
    
    martianSort: function () {
        this.sortCards(2);
    },
    
    shapeshifterSort: function () {
        this.sortCards(3);
    },
    
    robotSort: function () {
        this.sortCards(4);
    },
    
    smugglerSort: function () {
        this.sortCards(5);
    },
    
    parasiteSort: function () {
        this.sortCards(6);
    },
    
    bruteSort: function () {
        this.sortCards(7);
    },
    
    republicSort: function () {
        this.sortCards(8);
    },
    
    displayCards: function (idArray) {
        if (typeof cardResults != 'undefined') {cardResults.destroy()};
        
        cardResults = game.add.group();
        cardResults.height = game.world._height * 0.9;
        cardResults.width = game.world._width * 0.65;
        cardResults.x = game.world._width * 0.3;
        cardResults.y = game.world._height/20;
        
        for (i = 0; i < idArray.length; i++) {
            cardResults.create(0,0,idArray[i].toString());
        }
    },
    
};