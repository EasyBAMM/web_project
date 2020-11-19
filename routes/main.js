var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main', { title: 'Express' });
});

router.get('/hello', function(req, res, next) {
    res.send("dsdsd");
  });

module.exports = router;
