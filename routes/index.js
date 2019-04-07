var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require("path");
var requestify = require("requestify");

var emailjs = require("emailjs");
var server = emailjs.server.connect({
    user: "6tickets.noreply@gmail.com",
    password: "6T#0Zf2*",
    host: "smtp.gmail.com",
    ssl: true
});

var variables = {};
var authRequired = ["account-profile", "account-wishlist", "account-order", "account-address", "event-search", "event-add", "ticket-sell"];

// Check if authorization is required
router.get("*", function(req, res, next) {
    var data = req.url.split("/");
    var page = data[data.length-1];

    //TODO enable admin authorization
    // var test = new RegExp("admin_*");
    // if (test.test(page) && !req.session.admin && page !== "admin_login") {
    //     res.redirect("/admin_login");
    //     return;
    // } else if (test.test(page) && req.session.admin && page === "admin_login") {
    //     res.redirect("/admin_index");
    //     return;
    // }

    if (authRequired.includes(page) && !req.session.username) {
        res.redirect("/login");
        return;
    }

    if (data[1] !== "api") {
        variables.username = req.session.username;
        if (req.session.join_date)
            variables.join_date = req.session.join_date.toString().split("T")[0];

        requestify.get("http://" + req.get("host") + "/api/users/" + req.session.username + "/cart")
            .then(function (resp) {
                var data = resp.getBody();
                variables.cart = data;
                variables.cart.size = data.length;

                next();
            });

        return;
    }

    next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
    variables.title = "6Tickets";

    res.render('index', variables);
});

/* GET about page. */
router.get('/about', function(req, res, next) {
    variables.title = "About Us";
    res.render('about', variables);
});

/* GET 404 page. */
router.get('/404', function(req, res, next) {
    variables.title = "404";
    res.render('404', variables);
});

/* GET account-address page. */
router.get('/account-address', function(req, res, next) {
    variables.title = "Account";
    res.render('account-address', variables);
});

/* GET account-order page. */
router.get('/account-order', function(req, res, next) {
    variables.title = "Orders";

    requestify.get("http://" + req.get("host") + "/api/orders/" + variables.username)
        .then(function (resp) {

            variables.orders = resp.getBody();
            res.render('account-order', variables);
        });

});

/* GET account-profile page. */
router.get('/account-profile', function(req, res, next) {
    variables.title = "Profile";
    res.render('account-profile', variables);
});

/* GET account-wishlist page. */
router.get('/account-wishlist', function(req, res, next) {
    variables.title = "Wishlist";

    //???
    requestify.get("http://" + req.get("host") + "/api/users/" + variables.username + "/wishlist")
        .then(function (resp) {
            var wishlists = resp.getBody();
            var userlist = [];

            if (wishlists.length === 0) {
                res.render('account-wishlist', variables);
                return;
            }

            for (var i = 0; i < wishlists.length; i++) {

                if (wishlists[i].username !== variables.username)
                    continue;

                userlist.push(wishlists[i]);
            }

            variables.wishlist = userlist;
            res.render('account-wishlist', variables);
            variables.wishlist = {};
        });
});

/* GET account-sell page. */
router.get('/account-sell', function(req, res, next) {
    variables.title = "For Sale";

    requestify.get("http://" + req.get("host") + "/api/tickets/")
        .then(function (resp) {

            var data = resp.getBody();
            var tickets = [];

            for (var i = 0; i < data.length; i++) {
                if (data[i].seller === variables.username)
                    tickets.push(data[i]);
            }

            variables.selling = tickets;
            res.render('account-sell', variables);
        });

});

/* GET cart page. */
router.get('/cart', function(req, res, next) {
    variables.title = "Your Cart";
    res.render('cart', variables);
});

/* GET ticket and event setup page. */
router.get('/event-add', function(req, res, next) {
    variables.title = "Add Event";
    res.render('event-add', variables);
});

/* GET categories page. */
router.get('/categories', function(req, res, next) {
    variables.title = "6Tickets";
    res.render('categories', variables);
});

/* GET checkout page. */
router.get('/checkout', function(req, res, next) {
    variables.title = "Checkout";

    requestify.get("http://" + req.get("host") + "/api/users/" + variables.username)
        .then(function (resp) {

            var data = resp.getBody()[0];
            variables.firstname = data.firstname;
            variables.lastname = data.lastname;
            variables.phone = data.phoneNo;
            variables.addrOne = data.addressOne;
            variables.addrTwo = data.addressTwo;
            variables.city = data.city;
            variables.country = data.country;

            res.render('checkout', variables);
        });

});

/* POST checkout-2 page. */
router.post('/checkout-2', function(req, res, next) {
    variables.title = "Checkout";

    req.session.cart = {};
    req.session.cart.name = req.body.name;
    req.session.cart.addrOne = req.body.addrOne;
    req.session.cart.addrTwo = req.body.addrTwo;
    req.session.cart.city = req.body.city;
    req.session.cart.country = req.body.country;
    req.session.cart.phone = req.body.phone;
    req.session.cart.deliver = req.body.deliver;

    res.render('checkout-2', variables);
});

/* POST checkout-3 page. */
router.post('/checkout-3', function(req, res, next) {
    variables.title = "Checkout";

    //cardNo, name, expiry, cvc
    req.session.cart.cardNo = req.body.cardNo;
    req.session.cart.cardName = req.body.name;
    req.session.cart.expiry = req.body.expiry;
    req.session.cart.cvc = req.body.cvc;

    variables.cartData = req.session.cart;

    res.render('checkout-3', variables);
});

/* POST checkout-complete page. */
router.post('/checkout-complete', function(req, res, next) {
    variables.title = "Checkout";

    requestify.post("http://" + req.get("host") + "/api/orders/", {
        "username": variables.username,
        "total": req.body.amount.replace("€", "")
    }).then(function (resp) {
        var data = resp.getBody();

        variables.orderNo = data._id;
        variables.amount = req.body.amount;

        requestify.delete("http://" + req.get("host") + "/api/users/" + variables.username + "/cart/");

        server.send({
            text: "Hello " + variables.username + "\n\nThis is your confirmation email for order ID " +
                    variables.orderNo + "\n\nThank you for choosing us.",
            from: "6Tickets <6tickets.noreply@gmail.com>",
            to: "<" + req.session.email + ">",
            subject: "Confirmation email"
        }, function (err, msg) {
            console.log (err || msg);
        });

        res.render('checkout-complete', variables);
    });

});

/* GET compare page. */
router.get('/compare', function(req, res, next) {
    variables.title = "6Tickets";
    res.render('compare', variables);
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
    variables.title = "6Tickets";
    res.render('contact', variables);
});

/* GET detail page. */
router.get('/event-detail', function(req, res, next) {
    variables.title = "Event name";
    res.render('event-detail', variables);
});

/* GET detail-tab page. */
router.get('/detail-tab', function(req, res, next) {
    variables.title = "6Tickets";
    res.render('detail-tab', variables);
});

/* GET faq page. */
router.get('/faq', function(req, res, next) {
    variables.title = "FAQ";
    res.render('faq', variables);
});

/* GET grid page. */
router.get('/grid', function(req, res, next) {
    variables.title = "6Tickets";
    res.render('grid', variables);
});

/* GET list page. */
router.get('/list', function(req, res, next) {
    variables.title = "6Tickets";
    res.render('list', variables);
});

/* GET login page. */
router.get('/login', function(req, res, next) {
    variables.title = "Login";
    res.render('login', variables);
});

/* GET event-search */
router.get('/event-search', function(req, res, next) {
    variables.title = "Sell Tickets";
    res.render('event-search', variables);
});

/* GET ticket-sell */
router.get("/ticket-sell", function (req, res, next) {
    variables.title = "Sell Tickets";
    var id = req.query.eventId;

    requestify.get("http://" + req.get("host") + "/api/events/" + id)
        .then(function (resp) {
            var data = resp.getBody()[0];
            if (data.request === 1) {
                res.redirect("event-search");
                return;
            }

            data.startDate = data.startDate.split("T")[0];
            data.endDate = data.endDate.split("T")[0];

            variables.data = data;
            res.render("ticket-sell", variables);
        });

});

router.get("/uploads/:file", function(req, res, next) {
    var file = req.params.file;

    try {
        if (fs.existsSync("uploads/" + file)) {
            res.sendFile(path.resolve("uploads/" + file));
        } else {
            res.render("404");
        }
    } catch (err) {
        console.log(err);
    }

});

module.exports = router;
