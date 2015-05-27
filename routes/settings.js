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
	var body = req.body || {},
		sessionSetting = req.session.setting,
		fieldsToOmit = ["newPassword", "confirmPassword", "id"];
	
	if (!sessionSetting) {
		res.status(401).send({error: "Authentication error"});
	} else {
		if ((body.password !== sessionSetting.password) || (body.newPassword !== body.confirmPassword)) {
			res.status(401).send({error: "Wrong password or new password doesn't match to confirm password field"});	
		} else {
			var password = body.newPassword || sessionSetting.password;

			Settings.findById(sessionSetting.id).then(function(setting) {
				setting.updateAttributes(_.extend({}, _.omit(body, fieldsToOmit), {password: password})).then(function() {
					req.session.setting = setting.toJSON();
					res.send(setting.toJSON());
				});
			});
		}
	}
});

module.exports = router;