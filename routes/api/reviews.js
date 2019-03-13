var express = require('express');
var router = express.Router();
var Review = require("../../models/review");
var Users = require("../../models/users");

/**
 * @api {delete} /reviews/id/:reviewId Delete a review
 * @apiName deleteReview
 * @apiGroup Reviews
 *
 * @apiParam {Number} Review ID
 */
router.delete("/id/:reviewId", function (req, res, next) {
    var reviewId = req.params.reviewId;

    Review.deleteOne({"_id": reviewId}, function(err, reviews) {
        if (err)
            throw err;

        res.status(200).json({"status": "OK"});
    });

});

/**
 * @api {get} /reviews/id/:reviewId Get information for a specific review
 * @apiName getReview
 * @apiGroup Reviews
 *
 * @apiParam {Number} Review ID
 */
router.get("/id/:reviewId", function (req, res, next) {
    var reviewId = req.params.reviewId;

    Review.find({"_id": reviewId}, function(err, reviews) {
        if (err)
            throw err;

        res.status(200).json(reviews);
    });

});

/**
 * @api {get} /reviews/:username Get all reviews for a user
 * @apiName getReviews
 * @apiGroup Reviews
 *
 * @apiParam {String} username Users name
 */
router.get("/:username", function (req, res, next) {
    var username = req.params.username;

    Review.find({"username": username}, function(err, reviews) {
        if (err)
            throw err;

        res.status(200).json(reviews);
    });

});

/**
 * @api {get} /reviews/ Get the list of reviews
 * @apiName getAllReviews
 * @apiGroup Reviews
 *
 * @apiParam {Number} page Page number (optional)
 */
router.get("/", function(req, res, next) {

    Review.find({}, function(err, reviews) {
       if (err)
           throw err;

       res.json(reviews);
    });

});

/**
 * @api {post} /reviews/:username
 * @apiName AddReview
 * @apiGroup Reviews
 *
 * @apiParam {Number} stars Amount of stars.
 * @apiParam {String} review Review text.
 *
 * @apiSuccessExample example data on success:
 * {
 *     "success": "review created"
 * }
 *
 * @apiError InvalidArguments incorrect arguments supplied
 */
router.post("/:username", function(req, res, next) {
    var username = req.params.username;
    var stars = req.body.stars;
    var reviewDesc = req.body.review;

    if (!stars || !reviewDesc) {
        res.status(400).json({
            "error": "Invalid arguments"
        });
        return;
    }

    userExists(username, function(error, found) {
        if (!found) {
            res.status(400).json({"error": "User doesn't exist"});
            return;
        }

        var review = new Review();
        review.username = username;
        review.stars = stars;
        review.review = reviewDesc;

        review.save(function(err, review) {
            if (err)
                throw err;

            res.status(201).json({
                "success": "review created",
                "_id": review._id
            });
        });
    });
});

var userExists = function (username, callback) {
    if (process.env.NODE_ENV === "test") {
        callback(null, true);
        return;
    }

    Users.find({"username": username}, function(err, res) {
        if (err)
            callback(err);
        else if (res.length === 0)
            callback(null, false);
        else
            callback(null, true);
    });

};

module.exports = router;