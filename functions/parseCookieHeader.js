var exports = module.exports = {};

/****** exports ******/

exports.parse = function(key, cookieString){
    var cookies = cookieString.split("; ");
    var value = "";
    for (i = 0; i < cookies.length; i ++) {
        var cookie = cookies[i].split("=");
        if (cookie[0] == key) {
            value = cookie[1];
        }
    }
    return value;
};