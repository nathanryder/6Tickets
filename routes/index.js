var express = require('express');
var router = express.Router();
var exec = require("child_process").exec;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/test", function(req, res, next) {
	res.send("hello world test");
});

module.exports = router;
