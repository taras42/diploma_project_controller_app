var Settings  = require('../models').Settings;
var express = require('express');
var router  = express.Router();

router.post('/session', function(req, res) {
  //req.session.uid
  res.redirect('/settings');
});

module.exports = router;