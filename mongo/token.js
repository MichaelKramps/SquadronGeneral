var exports = module.exports = {};

/****** requires ******/



/****** exports ******/

exports.token = function(length){
    var characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var chars = characters.split("");
    var token = "";
    for(i = 0; i < length; i++){
        var n = Math.floor(Math.random() * chars.length);
        token += chars[n];
        if (i == length - 1) {
            return token;
        }
    }
};