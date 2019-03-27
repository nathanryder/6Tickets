var express = require('express');
var router = express.Router();
var crypto = require("crypto");
var Event = require("../../models/event");

/**
 * @api {post} /events/ Create an event
 * @apiName CreateEvent
 * @apiGroup Events
 *
 * @apiParam {String} eventName
 * @apiParam {String} description
 * @apiParam {String} venue
 * @apiParam {String} address
 * @apiParam {String} category
 * @apiParam {Date} startDate
 * @apiParam {Date} endDate
 * @apiParam {File} logo (Optional)
 * @apiParam {File} header (Optional)
 * @apiParam {Number} isRequest (Optional)
 */
router.post("/", function(req, res, next) {

    var name = req.body.eventName;
    var desc = req.body.description;
    var venue = req.body.venue;
    var addr = req.body.address;
    var category = req.body.category;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var header = req.body.header;
    var logo = req.body.logo;
    var request = req.body.isRequest ? req.body.isRequest : 0;

    if (!name || !category || !startDate || !endDate || !desc || !venue || (process.env.NODE_ENV !== "test" && req.files === null)) {
        res.status(400).json({"error": "Invalid arguments"});
        return;
    }

    var event = new Event();
    event.name = name;
    event.description = desc;
    event.venue = venue;
    event.address = addr;
    event.category = category;
    event.startDate = startDate;
    event.endDate = endDate;
    event.request = request;

    if (process.env.NODE_ENV !== "test") {
        for (var i = 0; i < req.files.file.length; i++) {
            var file = req.files.file[i];
            var data = file.name.split("\.");

            var extension = data[data.length - 1];
            var fileName = crypto.randomBytes(20).toString("hex") + "." + extension;

            file.mv("uploads/" + fileName, function (err) {
                if (err) {
                    console.log(err);
                    return res.status(500).send(err);
                }
            });

            if (i === 0)
                event.header = fileName;
            else
                event.logo = fileName;
        }
    }

    event.save(function(err, event) {
        if (err)
            throw err;

        res.status(201).json({
            "success": "event created",
            "_id": event._id
        });
    });

});

/**
 * @api {get} /events/ Get all events
 * @apiName GetEvents
 * @apiGroup Events
 */
router.get("/", function(req, res, next) {

    Event.find({}, function(err, events) {
        res.status(200).json(events);
    })

});

/**
 * @api {get} /events/search Search for events
 * @apiName SearchEvents
 * @apiGroup Events
 *
 * @apiParam {String} query (optional)
 * @apiParam {String} category (optional)
 */
router.get("/search", function(req, res, next) {

    var query = req.query.q;
    var category = req.query.category;

    var searchQuery = {};
    if (query && category) {
        query = query.replace("+", " ");
        searchQuery = {"category": category, "name": new RegExp(query, 'i')};
    } else if (query) {
        query = query.replace("+", " ");
        searchQuery = {"name": new RegExp(query, 'i')};
    } else if (category) {
        searchQuery = {"category": category}
    }
    searchQuery.request = req.query.approved === "false" ? 1 : 0;

    Event.find(searchQuery, function(err, events) {
        if (err)
            throw err;

        res.status(200).json(events);
    }).sort({startDate: -1})

});

/**
 * @api {get} Get event information
 * @apiName GetEvent
 * @apiGroup Events
 *
 * @apiParam {String} eventId
 */
router.get("/:eventId", function(req, res, next) {
    var id = req.params.eventId;

    Event.find({"_id": id}, function(err, event) {
        if (err)
            throw err;

        res.status(200).json(event);
    })

});

/**
 * @api {get} Approve an event
 * @apiName ApproveEvent
 * @apiGroup Events
 *
 * @apiParam {String} id
 */
router.get("/approve/:id", function(req, res, next) {
    var id = req.params.id;

    Event.updateOne({"_id": id}, {$set:{
            "request": 0,
        }}, function(err, update) {
        if (err)
            throw err;

        res.status(201).json({"success": "Updated event details"});
    })

});

/**
 * @api {delete} Delete an event
 * @apiName DeleteEvent
 * @apiGroup Events
 *
 * @apiParam {String} id
 */
router.delete("/:id", function(req, res, next) {
    var id = req.params.id;

    Event.deleteOne({"_id": id}, function(err, event) {
        if (err)
            throw err;

        res.status(200).json({"success": "Event deleted"});
    });

});

/**
 * @api {put} Update details for an event
 * @apiName UpdateEvent
 * @apiGroup Events
 *
 * @apiParam {String} id
 * @apiParam {String} name
 * @apiParam {String} description
 * @apiParam {String} venue
 * @apiParam {String} address
 * @apiParam {String} category
 * @apiParam {String} startDate
 * @apiParam {String} endDate
 * @apiParam {File} header (optional)
 * @apiParam {File} logo (optional)
 */
router.put("/:id", function(req, res, next) {
    var id = req.params.id;
    var name = req.body.name;
    var description = req.body.description;
    var venue = req.body.venue;
    var address = req.body.address;
    var category = req.body.category;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;

    if (!name || !category || !startDate || !endDate) {
        res.status(400).json({"error": "Invalid arguments"});
        return;
    }

    var update = {
        "name": name,
        "category": category,
        "description": description,
        "venue": venue,
        "address": address,
        "startDate": startDate,
        "endDate": endDate
    };

    if (process.env.NODE_ENV !== "test") {
        if (req.files.file.length === 2) {

            for (var i = 0; i < req.files.file.length; i++) {
                var file = req.files.file[i];
                var data = file.name.split("\.");

                var extension = data[data.length - 1];
                var fileName = crypto.randomBytes(20).toString("hex") + "." + extension;

                file.mv("uploads/" + fileName, function (err) {
                    if (err) {
                        console.log(err);
                        return res.status(500).send(err);
                    }
                });

                if (i === 0)
                    update.header = fileName;
                else
                    update.logo = fileName;
            }
        }
    }

    Event.updateOne({"_id": id}, {$set:update}, function(err, update) {
        if (err)
            throw err;

        res.status(201).json({"success": "Updated event details"});
    })

});

module.exports = router;