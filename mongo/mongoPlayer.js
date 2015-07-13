var exports = module.exports = {};

/****** requires ******/

var mongoose = require('mongoose');

var mongoMain = require('./mongoMain.js');

/****** exports ******/

exports.connect = mongoMain.connect("localhost", "players");

var session = mongoose.Schema({
    _id: Number,
    pI: Number,
});