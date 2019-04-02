var mongoose = require("mongoose");
var Schema = mongoose.Schema;
require("./database");

var eventSchema = new Schema({
    name: {type: String},
    description: {type: String},
    venue: {type: String},
    address: {type: String},
    country: {type: String},
    category: {type: String},
    startDate: {type: Date},
    endDate: {type: Date},
    header: {type: String},
    logo: {type: String},
    request: {type: Number}
});

module.exports = mongoose.model("Event", eventSchema);