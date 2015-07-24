var exports = module.exports = {};

/****** requires ******/

var emailValidator = require('email-validator');

/****** exports ******/

exports.registerValidate = function(data){
    var errors = [];
    // all fields required
    for (var key in data) {
        if (data.hasOwnProperty(key) && data[key] === "") {
            errors.push("All sections are required")
            break;
        }
    }
    // validate email
    if (!emailValidator.validate(data.email)) {
        errors.push("That is not a valid email address");
    }
    // username between 4 and 20 characters
    if (data.username.length < 4) {
        errors.push("Username must be at least 4 characters");
    } else if (data.username.length > 20) {
        errors.push("Username must be fewer than 21 characters");
    }
    // password between 8 and 32 characters
    if (data.password.length < 8) {
        errors.push("Password must be at least 8 characters");
    } else if (data.password.length > 32) {
        errors.push("Password must be fewer than 33 characters");
    }
    // passwords match
    if (data.password !== data.verify) {
        errors.push("Passwords must match");
    }
    return errors;
};

exports.loginValidate = function(data){
    var errors = [];
    // all fields required
    for (var key in data) {
        if (data.hasOwnProperty(key) && data[key] === "") {
            errors.push("All sections are required")
            break;
        }
    }
    
    return errors;
}