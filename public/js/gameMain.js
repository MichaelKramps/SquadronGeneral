var game = new Phaser.Game("100", "100", Phaser.AUTO, '');

// open web socket for player
var socket = io.connect();

game.state.add('quarters', quarters);
game.state.start('quarters');
