var express = require('express');
var router = express.Router();
var exec = require("child_process").exec;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/deploy", function(req, res, next) {
  exec("php deploy.php", function (error, stdout, stderr) {
    res.send(stdout);
  });
});


module.exports = router;
