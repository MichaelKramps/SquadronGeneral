var game = new Phaser.Game("100", "100", Phaser.AUTO, '');

// open web socket for player
var socket = io.connect();

socket.emit("getPlayerInfo");
socket.on("sendPlayerInfo", function(playerInfo){
    player = playerInfo;
    game.state.add('quarters', quarters);
    game.state.start('quarters');
});
