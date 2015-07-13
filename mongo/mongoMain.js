var exports = module.exports = {};

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("yay!");
});

var joinGameSchema = mongoose.Schema({
    _id: Number,
    game: Number,
    player: Number,
});

var session = mongoose.Schema({
    _id: Number,
    pI: Number,
});