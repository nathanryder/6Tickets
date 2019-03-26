var express = require('express');
var router = express.Router();

var authRequired = ["account-profile", "account-wishlist", "account-order", "account-address", "sell-tickets"];

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

    next();
});



/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { username: req.session.username, title: '6Tickets' });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
    res.render('about', { username: req.session.username, title: 'About Us' });
});

/* GET 404 page. */
router.get('/404', function(req, res, next) {
    res.render('404', { username: req.session.username, title: '404' });
});

/* GET account-address page. */
router.get('/account-address', function(req, res, next) {
    res.render('account-address', { username: req.session.username, title: 'Account' });
});

/* GET account-order page. */
router.get('/account-order', function(req, res, next) {
    res.render('account-order', { username: req.session.username, title: 'Orders' });
});

/* GET account-profile page. */
router.get('/account-profile', function(req, res, next) {
    res.render('account-profile', { username: req.session.username, title: 'Profile' });
});

/* GET account-wishlist page. */
router.get('/account-wishlist', function(req, res, next) {
    res.render('account-wishlist', { username: req.session.username, title: 'Wishlist' });
});

/* GET account-sell page. */
router.get('/account-sell', function(req, res, next) {
    res.render('account-sell', { username: req.session.username, title: 'For Sale' });
});

/* GET cart page. */
router.get('/cart', function(req, res, next) {
    res.render('cart', { username: req.session.username, title: 'Your Cart' });
});

/* GET ticket and event setup page. */
router.get('/add-ticket', function(req, res, next) {
    res.render('add-ticket', { username: req.session.username, title: 'Add Event' });
});

/* GET categories page. */
router.get('/categories', function(req, res, next) {
    res.render('categories', { username: req.session.username, title: '6Tickets' });
});

/* GET checkout page. */
router.get('/checkout', function(req, res, next) {
    res.render('checkout', { username: req.session.username, title: 'Checkout' });
});

/* GET checkout-2 page. */
router.get('/checkout-2', function(req, res, next) {
    res.render('checkout-2', { username: req.session.username, title: 'Checkout' });
});

/* GET checkout-3 page. */
router.get('/checkout-3', function(req, res, next) {
    res.render('checkout-3', { username: req.session.username, title: 'Checkout' });
});

/* GET checkout-complete page. */
router.get('/checkout-complete', function(req, res, next) {
    res.render('checkout-complete', { username: req.session.username, title: 'Checkout' });
});

/* GET compare page. */
router.get('/compare', function(req, res, next) {
    res.render('compare', { username: req.session.username, title: '6Tickets' });
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
    res.render('contact', { username: req.session.username, title: 'Contact' });
});

/* GET detail page. */
router.get('/detail', function(req, res, next) {
    res.render('detail', { username: req.session.username, title: '6Tickets' });
});

/* GET detail-tab page. */
router.get('/detail-tab', function(req, res, next) {
    res.render('detail-tab', { username: req.session.username, title: '6Tickets' });
});

/* GET faq page. */
router.get('/faq', function(req, res, next) {
    res.render('faq', { username: req.session.username, title: 'FAQ' });
});

/* GET grid page. */
router.get('/grid', function(req, res, next) {
    res.render('grid', { username: req.session.username, title: '6Tickets' });
});

/* GET list page. */
router.get('/list', function(req, res, next) {
    res.render('list', { username: req.session.username, title: '6Tickets' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
    res.render('login', { username: req.session.username, title: 'Login' });
});

/* GET login page. */
router.get('/sell-tickets', function(req, res, next) {
    res.render('sell-tickets', { username: req.session.username, title: 'Sell Tickets' });
});

module.exports = router;
