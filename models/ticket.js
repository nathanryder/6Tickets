var mongoose = require("mongoose");
var Schema = mongoose.Schema;
require("./database");

var ticketSchema = new Schema({
    seller: {type: String},
    eventID: {type: String},
    eventName: {type: String},
    deliveryMethod: {type: Number},
    price: {type: Number},
    seatNo: {type: String},
    info: {type: String}
});

module.exports = mongoose.model("Ticket", ticketSchema);