var mongoose = require("mongoose");
var Schema = mongoose.Schema;
require("./database");

var historySchema = new Schema({
    username: {type: String},
    ticketID: {type: String},
    date: {type: Date, default: new Date()}
});

module.exports = mongoose.model("History", historySchema);