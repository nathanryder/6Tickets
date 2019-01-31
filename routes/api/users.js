var express = require('express');
var router = express.Router();
var User = require("../../models/users");
var jwt = require("jsonwebtoken");

/**
 * @api {post} /:username Create a user
 * @apiName AddUser
 * @apiGroup Comments
 * @apiParam {password} Users password
 * @apiParam {firstname} Users first name
 * @apiParam {lastname} Users last name
 *
 * @apiSuccessExample Example data on success:
 * {
 *     success: "account created"
 * }
 *
 * @apiError InvalidArguments incorrect arguments supplied
 */
router.post("/:username", function (req, res, next) {
    var username = req.params.username;
    var password = req.body.password;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.emailAddress;
    var phoneNo = req.body.phoneNo;
    var addressOne = req.body.addressOne;
    var addressTwo = req.body.addressTwo;
    var city = req.body.city;
    var country = req.body.country;

    if (!password || !firstname || !lastname || !email || !phoneNo || !addressOne || !addressTwo || !city || !country) {
        res.status(400).json({
            "error": "Invalid arguments"
        });
        return;
    }


    User.findOne({"username": username}, function (err, user) {

        if (err)
            res.send(err);

        if (user) {
            res.status(400).json({
                "error": "User already taken"
            });
        } else {
            var newUser = new User();
            newUser.username = username;
            newUser.password = newUser.generateHash(password);
            newUser.access_token = createJwt({"username":username});

            newUser.save(function(err, user) {
                if (err)
                    throw err;

                res.cookie("Authorization", "Bearer " + user.access_token);
                res.cookie("Username", username);
                res.status(201).json({
                    "success": "account created"
                })
            });
        }

    });
});

function createJwt(profile) {
    return jwt.sign(profile, "8ea73037538f45b4827845e3ec03a9cc", {
        expiresIn: "10d"
    });
}

module.exports = router;
