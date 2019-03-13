var mongoose = require("mongoose");
var Schema = mongoose.Schema;
require("./database");

var usersSchema = new Schema({
    username: {type: String},
    stars: {type: Number},
    review: {type: String}
});

module.exports = mongoose.model("Review", usersSchema);