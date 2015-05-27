var Settings  = require('../models').Settings;
var express = require('express');
var router  = express.Router();

router.post('/', function(req, res) {
	var body = req.body || {};

	Settings.findOne({ where: {login: body.login} }).then(function(setting) {
  		if (setting && (setting.password === body.password)) {
  			req.session.uid = setting.id;
  			res.send({location: '/settings'});
  		} else {
  			res.status(401).send({error: "Wrong login or password"});
  		}
	});
});

module.exports = router;