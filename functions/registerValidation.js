var exports = module.exports = {};

/****** exports ******/

exports.validate = function(data){
    var errors = [];
    // all fields required, valid email?, username between 4 and 20 characters, password between 8 and 32 characters, passwords match
    for (var key in data) {
        if (data.hasOwnProperty(key) && data[key] === "") {
            errors.push("All sections are required")
        }
    }
    return errors;
};