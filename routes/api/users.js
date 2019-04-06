var express = require('express');
var router = express.Router();
var User = require("../../models/users");
var History = require("../../models/history");
var Wishlist = require("../../models/wishlist");
var Cart = require("../../models/cart");
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
 * @api {get} /users/logout Logout a user
 * @apiName LogoutUser
 * @apiGroup Users
 */
router.get("/logout", function(req, res, next) {
    req.session.destroy();
    res.redirect("/");
});

/**
 * @api {get} /users/:username Get a users information
 * @apiName GetUser
 * @apiGroup Users
 *
 * @apiParam {String} username
 */
router.get("/:username", function (req, res, next) {
    User.find({"username": new RegExp("^" + req.params.username + "$", 'i')}, function (err, users) {
        if (err)
            res.send(err);

        res.json(users);
    });
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

        if (!user) {
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
    var adminLogin = req.body.adminPage === "1";

    if (!username || !password) {
        res.status(400).json({
            "error": "Invalid arguments"
        });
        return;
    }

    User.findOne({"username": new RegExp("^" + username + "$", 'i')}, function (err, user) {
        if (err)
            res.send(err);

        if (user) {

            if (user.validPassword(password)) {
                user.access_token = createJwt({"username": username});
                user.save();

                var isAdmin = user.admin === 1;
                if (adminLogin && isAdmin === false) {
                    res.status(401).send({
                        "status": "error",
                        "body": "Email or password does not match"
                    });
                    return;
                }

                req.session.username = username;
                req.session.email = user.emailAddress;
                req.session.admin = user.admin;
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
 * @api {put} /users/:username Create a user
 * @apiName UpdateUser
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
 */
router.put("/:username", function (req, res, next) {
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

    User.updateOne({"username": username}, {$set:{
            "password": password,
            "firstname": firstname,
            "lastname": lastname,
            "emailAddress": email,
            "phoneNo": phoneNo,
            "addressOne": addressOne,
            "addressTwo": addressTwo,
            "city": city,
            "country": country
        }}, function (err, update) {
        if (err)
            throw err;

        res.status(201).json({"success": "Updated user details"});
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
            newUser.emailAddress = email;
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

//HISTORY
/**
 * @api {post} /users/:username/history/ Add an item to a users history
 * @apiName AddHistory
 * @apiGroup Users
 *
 * @apiParam {String} ticketID
 */
router.post("/:username/history/", function(req, res, next) {
    var username = req.params.username;
    var ticket = req.body.ticketID;

    History.deleteOne({"username": username, "ticketID": ticket}, function (err, resp) {
        if (err)
            throw err;
    });

    var history = new History();
    history.username = username;
    history.ticketID = ticket;

    history.save(function (err, resp) {
        if (err)
            throw err;

        res.status(201).json({
            "success": "Added to history",
            "_id": resp._id
        });
    });
});

/**
 * @api {get} /users/:username/history Get a users history
 * @apiName GetHistory
 * @apiGroup Users
 *
 * @apiParam {Number} page
 */
router.get("/:username/history", function (req, res, next) {

    var HISTORY_PER_PAGE = 20;
    var username = req.params.username;
    var page = req.query.page ? req.query.page : 0;
    page = page * HISTORY_PER_PAGE;

    History.find({"username": username}, function (err, resp) {
        if (err)
            throw err;

        res.status(200).json(resp);
    }).sort({date: -1}).skip(page).limit(HISTORY_PER_PAGE);

});

//WISHLIST
/**
 * @api {post} /users/:username/wishlist/ Add an item to a users wishlist
 * @apiName AddWishlist
 * @apiGroup Users
 *
 * @apiParam {String} ticketID
 */
router.post("/:username/wishlist/", function(req, res, next) {
    var username = req.params.username;
    var ticket = req.body.ticketID;

    Wishlist.deleteOne({"username": username, "ticketID": ticket}, function (err, resp) {
        if (err)
            throw err;
    });

    var wishlist = new Wishlist();
    wishlist.username = username;
    wishlist.ticketID = ticket;

    wishlist.save(function (err, resp) {
        if (err)
            throw err;

        res.status(201).json({
            "success": "Added to wishlist",
            "_id": resp._id
        });
    });
});

/**
 * @api {get} /users/:username/wishlist Get a users wishlist
 * @apiName GetWishlist
 * @apiGroup Users
 */
router.get("/:username/wishlist", function (req, res, next) {

    var HISTORY_PER_PAGE = 20;
    var username = req.params.username;
    var page = req.query.page ? req.query.page : 0;
    page = page * HISTORY_PER_PAGE;

    Wishlist.find({"username": username}, function (err, resp) {
        if (err)
            throw err;

        res.status(200).json(resp);
    }).sort({date: -1}).skip(page).limit(HISTORY_PER_PAGE);

});

//CART
/**
 * @api {post} /users/:username/cart/ Add an item to a users shopping cart
 * @apiName AddToCart
 * @apiGroup Users
 *
 * @apiParam {String} ticketID
 * @apiParam {Number} quantity
 */
router.post("/:username/cart/", function(req, res, next) {
    var username = req.params.username;
    var ticket = req.body.ticketID;
    var quantity = req.body.quantity;

    Cart.deleteOne({"username": username, "ticketID": ticket}, function (err, r) {
        if (err)
            throw err;

        var cart = new Cart();
        cart.username = username;
        cart.ticketID = ticket;
        cart.quantity = quantity;

        cart.save(function (err, resp) {
            if (err)
                throw err;

            res.status(201).json({
                "success": "Added to cart",
                "_id": resp._id
            });
        });
    });


});

/**
 * @api {get} /users/:username/cart Get the items in a users shopping cart
 * @apiName GetCartItems
 * @apiGroup Cart
 */
router.get("/:username/cart", function (req, res, next) {
    var username = req.params.username;

    Cart.find({"username": new RegExp(username, 'i')}, function (err, resp) {
        if (err)
            throw err;

        res.status(200).json(resp);
    }).sort({date: -1});

});

/**
 * @api {delete} /users/:username/cart Delete all items in a users shopping cart
 * @apiName DeleteCartItems
 * @apiGroup Cart
 */
router.delete("/:username/cart", function (req, res, next) {
    var username = req.params.username;

    Cart.deleteMany({"username": new RegExp(username, 'i')}, function (err, resp) {
        if (err)
            throw err;

        res.status(200).json({"success": "Successfully cleared cart"})
    });

});

/**
 * @api {delete} /users/:username/cart/:ticketID Delete an item from a users cart
 * @apiName DeleteCartItem
 * @apiGroup Cart
 */
router.delete("/:username/cart/:ticketID", function (req, res, next) {
    var username = req.params.username;
    var ticket = req.params.ticketID;

    Cart.deleteOne({"username": username, "ticketID": ticket}, function (err, resp) {
        if (err)
            throw err;

        res.status(200).json({"success": "Successfully removed item"})
    });

});


function createJwt(profile) {
    return jwt.sign(profile, "8ea73037538f45b4827845e3ec03a9cc", {
        expiresIn: "10d"
    });
}

module.exports = router;
