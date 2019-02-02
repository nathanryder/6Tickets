var config = require("./config.js");
var mongoose = require("mongoose");
var connection;

const DB_URI = "mongodb://" + config.username + ":" + config.password + "@" + config.host + ":" + config.port + "/" + config.database;

if (process.env.NODE_ENV === "test") {
    var Mockgoose = require("mockgoose").Mockgoose;
    var mockgoose = new Mockgoose(mongoose);

    mockgoose.prepareStorage()
        .then(() => {
            connection = mongoose.connect(DB_URI);
        });
} else {
    connection = mongoose.connect(DB_URI);
}


exports.connection = connection;