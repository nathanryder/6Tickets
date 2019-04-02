var express = require('express');
var router = express.Router();
var requestify = require("requestify");

router.get("/admin/", function (req, res, next) {
    res.redirect("admin_index",);
});

router.get("/admin_login", function (req, res, next) {
    res.render("admin/login.hbs", {title: "Admin Login"});
});

router.get("/admin_categories", function (req, res, next) {
    requestify.get("http://" + req.get("host") + "/api/categories/")
        .then(function (resp) {
            var data = resp.getBody();

            res.render("admin/category.hbs", {title: "Admin dashboard", data});
        });

});

router.get("/admin_index", function (req, res, next) {
    requestify.get("http://" + req.get("host") + "/api/events/search?approved=false")
        .then(function (resp) {
            var data = resp.getBody();
            for (var i = 0; i < data.length; i++) {
                data[i].startDate = data[i].startDate.split("T")[0];
                data[i].endDate = data[i].endDate.split("T")[0];
            }

            res.render("admin/index.hbs", {title: "Admin dashboard", data});
        });

});

router.get("/admin_eventRequest", function (req, res, next) {
    var id = req.query.eventId;
    requestify.get("http://" + req.get("host") + "/api/events/" + id)
        .then(function (resp) {
            var data = resp.getBody()[0];
            if (data.request === 0) {
                res.redirect("admin_index");
                return;
            }

            data.startDate = data.startDate.split("T")[0];
            data.endDate = data.endDate.split("T")[0];

            res.render("admin/eventRequest.hbs", {title: "Admin | Event Request", data});
        });


});

module.exports = router;