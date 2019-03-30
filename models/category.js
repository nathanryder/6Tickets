var mongoose = require("mongoose");
var Schema = mongoose.Schema;
require("./database");

var catSchema = new Schema({
    name: {type: String},
});

module.exports = mongoose.model("Category", catSchema);