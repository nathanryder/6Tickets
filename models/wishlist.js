var mongoose = require("mongoose");
var Schema = mongoose.Schema;
require("./database");

var wishlistSchema = new Schema({
    username: {type: String},
    ticketID: {type: String},
    date: {type: Date, default: new Date()}
});

module.exports = mongoose.model("Wishlist", wishlistSchema);