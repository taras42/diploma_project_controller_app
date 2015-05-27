var Settings  = require('../models').Settings;
var express = require('express');
var router  = express.Router();

router.get('/settings', function(req, res) {
	if(req.session.uid){
		res.redirect('/');
	}else{
		res.render('settings', {title: 'Settings'});
	}
});

router.post('/settings', function(req, res) {
	
});

module.exports = router;



