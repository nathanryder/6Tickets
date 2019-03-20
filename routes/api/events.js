var express = require('express');
var router = express.Router();
var Event = require("../../models/event");

/**
 * @api {post} /events/ Create an event
 * @apiName CreateEvent
 * @apiGroup Events
 *
 * @apiParam {String} eventName
 * @apiParam {String} category
 * @apiParam {Date} startDate
 * @apiParam {Date} endDate
 */
router.post("/", function(req, res, next) {

    var name = req.body.eventName;
    var category = req.body.category;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;

    if (!name || !category || !startDate || !endDate) {
        res.status(400).json({"error": "Invalid arguments"});
        return;
    }

    var event = new Event();
    event.name = name;
    event.category = category;
    event.startDate = startDate;
    event.endDate = endDate;

    event.save(function(err, event) {
        if (err)
            throw err;

        res.status(201).json({
            "success": "review created",
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
 * @apiParam {String} category
 * @apiParam {String} startDate
 * @apiParam {String} endDate
 */
router.put("/:id", function(req, res, next) {

    var id = req.params.id;
    var name = req.body.name;
    var category = req.body.category;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;

    if (!name || !category || !startDate || !endDate) {
        res.status(400).json({"error": "Invalid arguments"});
        return;
    }

    Event.updateOne({"_id": id}, {$set:{
            "name": name,
            "category": category,
            "startDate": startDate,
            "endDate": endDate
        }}, function(err, update) {
        if (err)
            throw err;

        res.status(201).json({"success": "Updated event details"});
    })

});

module.exports = router;