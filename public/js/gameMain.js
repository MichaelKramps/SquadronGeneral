var game = new Phaser.Game("100", "100", Phaser.AUTO, '');

// Add game states

var quartersState = game.state.add('quarters', quarters);
var soloState = game.state.add('solo', solo);
var collectionState = game.state.add('collection', collection);

// open web socket for player
var socket = io.connect();

socket.emit("getPlayerInfo");
socket.on("sendPlayerInfo", function(playerInfo){
    player = playerInfo;
    socket.emit("getCardSetInfo");
    socket.on("sendCardSetInfo", function(cardSet) {
        coreSet = cardSet;
        game.state.start('quarters');
    })
});
