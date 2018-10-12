var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express is Awesome', color: 'deepskyblue' });
});

module.exports = router;
