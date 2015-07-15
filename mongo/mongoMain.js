var exports = module.exports = {};

var mongoose = require('mongoose');

exports.connect = function(domain, dbName){
    mongoose.createConnection('mongodb://' + domain + '/' + dbName);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        console.log("connected to " + dbName);
    });
};

exports.model = function(tableName, Schema) {
    mongoose.model(tableName, Schema);
};

exports.save = function(model){
    model.save();
};

exports.find = function(){
    
};