var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");
require("./database");

var usersSchema = new Schema({
    username: {type: String},
    firstname: {type: String, default: null},
    lastname: {type: String, default: null},
    emailAddress: {type: String, default: null},
    phoneNo: {type: String, default: null},
    addressOne: {type: String, default: null},
    addressTwo: {type: String, default: null},
    city: {type: String, default: null},
    country: {type: String, default: null},
    password: {type: String, default: null},
    access_token: String
});

usersSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

usersSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", usersSchema);