var Settings  = require('../models').Settings;
var express = require('express');
var router  = express.Router();
var _ = require("underscore");

router.get('/', function(req, res) {
	if (req.session.setting) {
		if (req.accepts("html")) {
			res.render('settings', {title: 'Edit settings'});
		} else if (req.accepts("json")) {
			res.send(_.omit(req.session.setting, "password"));
		}
	} else {
		res.redirect('/');
	}
});

router.put('/', function(req, res) {
	var setting = req.body || {},
		sessionSetting = req.session.setting; 
	
	if (!sessionSetting) {
		res.status(401).send({error: "Authentication error"});
	} else {
		res.send("Saved");
	}
});

module.exports = router;