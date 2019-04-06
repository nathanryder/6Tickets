var express = require('express');
var router = express.Router();
var Order = require("../../models/order");

/**
 * @api {post} /orders/
 * @apiName CreateOrder
 * @apiGroup Orders
 *
 * @apiParam {String} username
 * @apiParam {Number} total
 */
router.post("/", function (req, res, next) {

    var username = req.body.username;
    var total = req.body.total;
    console.log(total + " " + username);
    if (!total || !username) {
        res.status(400).json({"error": "Invalid arguments"});
        return;
    }

    var order = new Order();
    order.username = username;
    order.total = total;

    order.save(function (err, saved) {
        if (err)
            throw err;

        res.status(201).json({
            "success": "Created order",
            "_id": saved._id
        });
    });

});

/**
 * @api {get} /orders/:username
 * @apiName GetOrders
 * @apiGroup Orders
 */
router.get("/:username", function (req, res, next) {

    var username = req.params.username;

    Order.find({"username": username}, function (err, resp) {
        if (err)
            throw err;

        res.status(200).json(resp);
    });

});

module.exports = router;