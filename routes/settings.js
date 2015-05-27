var Settings  = require('../models').Settings;
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
	req.session.uid ? res.render('settings', {title: 'Settings'}) : res.redirect('/');
});

router.post('/', function(req, res) {
	
});

module.exports = router;



