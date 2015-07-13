var exports = module.exports = {};

/****** requires ******/

var mongoose = require('mongoose');

var mongoMain = require('./mongoMain.js');

/****** exports ******/

exports.connect = mongoose.connect("localhost", "games");

var joinGameSchema = mongoose.Schema({
    _id: Number,
    game: Number,
    player: Number,
});