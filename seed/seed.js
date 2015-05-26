var Settings  = require('../models').Settings;
var settings = require('../config/settings');
var deferred = require('deferred');

module.exports = {
	run: function() {
		var def = deferred();

		Settings.findById(1).then(function(setting) {
			if(!setting) {
				Settings.create({
					login: settings.defaultLogin,
					password: settings.defaultPassword,
					port: settings.defaultPort,
					host: ""
				}).then(function(newSetting) {
					def.resolve(newSetting);
				});
			} else {
				def.resolve(setting);
			}
		});

		return def.promise;
	}
}