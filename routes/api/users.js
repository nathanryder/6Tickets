var express = require('express');
var router = express.Router();
var User = require("../../models/users");
var jwt = require("jsonwebtoken");

/**
 * @api {get} /users/ Get the list of users
 * @apiName GetUsers
 * @apiGroup Users
 *
 * @apiParam {Number} page Page number (optional)
 */
router.get("/", function (req, res, next) {
    var page = req.query.page*10;

    User.find({}, function (err, comments) {
        if (err)
            res.send(err);

        res.json(comments);
    }).sort({"username":1}).skip(page).limit(10);
});

/**
 * @api {post} /users/verify Set a users verified status
 * @apiName VerifyUser
 * @apiGroup Users
 * @apiParam {String} username
 * @apiParam {number} verified
 */
router.post("/verify", function(req, res, next) {
    var username = req.body.username;
    var verified = req.body.verified;

    User.updateOne({"username": username}, {$set:{"verified": verified}}, function(err, update) {
        if (err)
            throw err;

        res.status(201).json({"success": "user verified status changed"});
    });
});

/**
 * @api {delete} /users/:username Delete a user
 * @apiName DeleteUser
 * @apiGroup Users
 *
 * @apiSuccessExample Example data on success:
 * {
 *     success: "account deleted"
 * }
 *
 * @apiError UserNotFound Username does not exist
 *
 */
router.delete("/:username", function(req, res, next) {
    var username = req.params.username;
    var notFound = false;

    User.findOne({"username": username}, function (err, user) {

        if (err)
            res.send(err);

        console.log(user);
        if (!user) {
            // res.status(400).json({
            //     "error": "user not found"
            // });
            notFound = true;

        }
    });

    if (notFound) {
	    res.status(400).json({
            "error": "user not found"
        });
        return;
    }

    User.deleteOne({"username": username}, function(err, rem) {
        if (err)
            throw err;

        res.status(200).json({"success": "account deleted"});
    });
});

/**
 * @api {get} /users/logout Logout a user
 * @apiName LogoutUser
 * @apiGroup Users
 */
router.get("/logout", function(req, res, next) {
    req.session.destroy();
    res.redirect("/");
});

/**
 * @api {post} /users/login Login a user
 * @apiName AuthenticateUser
 * @apiGroup Users
 * @apiParam {String} username Users username.
 * @apiParam {String} password Users password.
 *
 * @apiSuccessExample Example data on success:
 * {
 *     success: "account created"
 * }
 *
 */
router.post("/login", function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
        res.status(400).json({
            "error": "Invalid arguments"
        });
        return;
    }

    User.findOne({"username": username}, function (err, user) {
        if (err)
            res.send(err);

        if (user) {

            if (user.validPassword(password)) {
                user.access_token = createJwt({"username": username});
                user.save();

                req.session.username = username;
                res.status(200).json({"success": "loggedIn"});
            } else {
                res.status(401).send({
                    "status": "error",
                    "body": "Email or password does not match"
                });
            }

        } else {
            res.status(401).send({
                "status": "error",
                "body": "Username not found"
            });
        }

    });


});

/**
 * @api {post} /users/:username Create a user
 * @apiName AddUser
 * @apiGroup Users
 * @apiParam {String} password Users password.
 * @apiParam {String} firstname Users firstname.
 * @apiParam {String} lastname Users lastname.
 * @apiParam {String} emailAddress Users email address.
 * @apiParam {String} phoneNo Users phone number.
 * @apiParam {String} addressOne Users first address line.
 * @apiParam {String} addressTwo Users second address line (optional).
 * @apiParam {String} city Users city.
 * @apiParam {String} country Users country.
 *
 * @apiSuccessExample Example data on success:
 * {
 *     success: "loggedIn"
 * }
 *
 * @apiError InvalidArguments incorrect arguments supplied
 *
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

    if (!password || !firstname || !lastname || !email || !addressOne || !city || !country) {
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
            newUser.firstname = firstname;
            newUser.lastname = lastname;
            newUser.email = email;
            newUser.phoneNo = phoneNo;
            newUser.addressOne = addressOne;
            newUser.addressTwo = addressTwo;
            newUser.city = city;
            newUser.country = country;
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
