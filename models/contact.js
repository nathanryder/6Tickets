var mongoose = require("mongoose");
var Schema = mongoose.Schema;
require("./database");

var contactSchema = new Schema({
    name: {type: String},
    email: {type: String},
    message: {type: String},
    date: {type: Date, default: new Date()}
});

module.exports = mongoose.model("Contact", contactSchema);