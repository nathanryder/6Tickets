var express = require('express');
var router = express.Router();
var Ticket = require("../../models/ticket");

/**
 * @api {get} /tickets/ Get all tickets
 * @apiName GetTickets
 * @apiGroup Tickets
 */
router.get("/", function(req, res, next) {

    Ticket.find({}, function (err, resp) {
        if (err)
            throw err;

        res.status(200).json(resp);
    })
});

/**
 * @api {get} /tickets/search Search for tickets
 * @apiName SearchTickets
 * @apiGroup Tickets
 *
 * @apiParam {String} e [eventID]
 * @apiParam {String} seat (optional)
 * @apiParam {String} page (optional)
 */
router.get("/search", function (req, res, next) {
    var TICKETS_PER_PAGE = 20;
    var e = req.query.e;
    var seat = req.query.seat;
    var page = req.query.page ? req.query.page : 0;

    if (!e) {
        res.status(400).json({"error": "Invalid arguments"});
        return;
    }

    var searchQuery = {};
    searchQuery.eventID = e;
    if (seat)
        searchQuery.seatNo = seat;

    Ticket.find(searchQuery, function (err, found) {
        if (err)
            throw err;

        res.status(200).json(found);
    }).sort({price: 1}).skip(page*TICKETS_PER_PAGE).limit(TICKETS_PER_PAGE);

});

/**
 * @api {get} /tickets/:ticketID Get a ticket
 * @apiName GetTicket
 * @apiGroup Tickets
 */
router.get("/:ticketID", function (req, res, next) {
    var id = req.params.ticketID;

    Ticket.findOne({"_id": id}, function (err, resp) {
        if (err)
            throw err;

        res.status(200).json(resp);
    });
});

/**
 * @api {delete} /tickets/:ticketID Delete a ticket
 * @apiName DeleteTicket
 * @apiGroup Tickets
 */
router.delete("/:ticketID", function (req, res, next) {
   var id = req.params.ticketID;

   Ticket.deleteOne({"_id": id}, function (err, resp) {
       if (err)
           throw err;

       res.status(200).json({"success": "Event deleted"});
   });
});

/**
 * @api {put} /tickets/:ticketID Update a ticket
 * @apiName UpdateTicket
 * @apiGroup Tickets
 *
 * @apiParam {String} sellerUsername
 * @apiParam {String} eventID
 * @apiParam {Number} deliveryMethod
 * @apiParam {Number} price
 * @apiParam {String} seatNo
 * @apiParam {String} info
 */
router.put("/:ticketID", function(req, res, next) {
    var id = req.params.ticketID;
    var seller = req.body.sellerUsername;
    var event = req.body.eventID;
    var delivery = req.body.deliveryMethod;
    var price = req.body.price;
    var seat = req.body.seatNo;
    var info = req.body.info;

    if (!seller || !event || !delivery || !price || !seat || !info) {
        res.status(400).json({"error": "Invalid arguments"});
        return;
    }

    Ticket.updateOne({"_id": id}, {$set:{
            "seller": seller,
            "eventID": event,
            "deliveryMethod": delivery,
            "price": price,
            "seat": seat,
            "info": info
        }}, function (err, update) {
            if (err)
                throw err;

            res.status(201).json({"success": "Updated ticket details"});
        }
    );
});

/**
 * @api {post} /tickets/ Create a new ticket
 * @apiName CreateTicket
 * @apiGroup Tickets
 *
 * @apiParam {String} sellerUsername
 * @apiParam {String} eventID
 * @apiParam {Number} deliveryMethod
 * @apiParam {Number} price
 * @apiParam {String} seatNo (optional)
 * @apiParam {String} info (optional)
 */
router.post("/", function(req, res, next) {

    var seller = req.body.sellerUsername;
    var event = req.body.eventID;
    var delivery = req.body.deliveryMethod;
    var price = req.body.price;
    var seat = req.body.seatNo;
    var info = req.body.info;

    if (!seller || !event || !delivery || !price) {
        res.status(400).json({"error": "Invalid arguments"});
        return;
    }

    var ticket = new Ticket();
    ticket.seller = seller;
    ticket.eventID = event;
    ticket.deliveryMethod = delivery;
    ticket.price = price;
    ticket.seatNo = seat;
    ticket.info = info;

    ticket.save(function(err, save) {
        if (err)
            throw err;

        res.status(201).json({
            "success": "ticket created",
            "_id": ticket._id
        });
    });

});

module.exports = router;