var mongoose = require("mongoose");
var Schema = mongoose.Schema;
require("./database");

var orderSchema = new Schema({
    date: {type: Date, default: new Date()},
    username: {type: String},
    total: {type: Number}
});

module.exports = mongoose.model("Order", orderSchema);