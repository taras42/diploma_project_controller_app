var Settings  = require('../models').Settings;
var settings = require('../config/settings');
var request = require('request');

module.exports = function(frame) {
	Settings.findById(1).then(function(setting) {
		if (setting) {
			var host = setting.host || settings.defaultHost;
			
			request({
				url: setting.host + '/io/trigger',
				method: 'POST',
				json: {data: frame}
			}, function(error, response, body){
				if(error) {
					console.log(error);
				} else {
					console.log(response.statusCode, body);
				}
			});
		}
	});
};