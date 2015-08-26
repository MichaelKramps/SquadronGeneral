var game = new Phaser.Game("100", "100", Phaser.AUTO, '');

// Add game states

game.state.add('quarters', quarters);

// open web socket for player
var socket = io.connect();

socket.emit("getPlayerInfo");
socket.on("sendPlayerInfo", function(playerInfo){
    player = playerInfo;
    
    game.state.start('quarters');
});
