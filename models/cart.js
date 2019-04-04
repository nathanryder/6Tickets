var mongoose = require("mongoose");
var Schema = mongoose.Schema;
require("./database");

var cartSchema = new Schema({
    username: {type: String},
    ticketID: {type: String},
    quantity: {type: Number},
    date: {type: Date, default: new Date()}
});

module.exports = mongoose.model("Cart", cartSchema);