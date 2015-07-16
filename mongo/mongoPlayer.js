var exports = module.exports = {};

/****** requires ******/

var mongoose = require('mongoose');

/****** exports ******/

exports.sessionSchema = mongoose.Schema({
    _id: Number,
    pI: Number,
});