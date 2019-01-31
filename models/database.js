var config = require("./config.js");
var mongoose = require("mongoose");
var connection = mongoose.connect("mongodb://" + config.username + ":" + config.password + "@" + config.host + ":" + config.port + "/" + config.database);

exports.connection = connection;