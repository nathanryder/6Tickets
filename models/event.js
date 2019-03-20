var mongoose = require("mongoose");
var Schema = mongoose.Schema;
require("./database");

var eventSchema = new Schema({
    name: {type: String},
    category: {type: String},
    startDate: {type: Date},
    endDate: {type: Date}
});

module.exports = mongoose.model("Event", eventSchema);