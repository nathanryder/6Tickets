var express = require('express');
var router = express.Router();
var exec = require("child_process").exec;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: '6Tickets' });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
    res.render('about', { title: 'About Us' });
});

/* GET 404 page. */
router.get('/404', function(req, res, next) {
    res.render('404', { title: '404' });
});

/* GET account-address page. */
router.get('/account-address', function(req, res, next) {
    res.render('account-address', { title: 'Account' });
});

/* GET account-order page. */
router.get('/account-order', function(req, res, next) {
    res.render('account-order', { title: 'Orders' });
});

/* GET account-profile page. */
router.get('/account-profile', function(req, res, next) {
    res.render('account-profile', { title: 'Profile' });
});

/* GET account-wishlist page. */
router.get('/account-wishlist', function(req, res, next) {
    res.render('account-wishlist', { title: 'Wishlist' });
});

/* GET cart page. */
router.get('/cart', function(req, res, next) {
    res.render('cart', { title: 'Your Cart' });
});

/* GET categories page. */
router.get('/categories', function(req, res, next) {
    res.render('categories', { title: '6Tickets' });
});

/* GET checkout page. */
router.get('/checkout', function(req, res, next) {
    res.render('checkout', { title: 'Checkout' });
});

/* GET checkout-2 page. */
router.get('/checkout-2', function(req, res, next) {
    res.render('checkout-2', { title: 'Checkout' });
});

/* GET checkout-3 page. */
router.get('/checkout-3', function(req, res, next) {
    res.render('checkout-3', { title: 'Checkout' });
});

/* GET checkout-complete page. */
router.get('/checkout-complete', function(req, res, next) {
    res.render('checkout-complete', { title: 'Checkout' });
});

/* GET compare page. */
router.get('/compare', function(req, res, next) {
    res.render('compare', { title: '6Tickets' });
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
    res.render('contact', { title: 'Contact' });
});

/* GET detail page. */
router.get('/detail', function(req, res, next) {
    res.render('detail', { title: '6Tickets' });
});

/* GET detail-tab page. */
router.get('/detail-tab', function(req, res, next) {
    res.render('detail-tab', { title: '6Tickets' });
});

/* GET faq page. */
router.get('/faq', function(req, res, next) {
    res.render('faq', { title: 'FAQ' });
});

/* GET grid page. */
router.get('/grid', function(req, res, next) {
    res.render('grid', { title: '6Tickets' });
});

/* GET list page. */
router.get('/list', function(req, res, next) {
    res.render('list', { title: '6Tickets' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login' });
});

router.post("/deploy", function(req, res, next) {
    exec("php deploy.php", function (error, stdout, stderr) {
        res.send(stdout);
  });
});


module.exports = router;
