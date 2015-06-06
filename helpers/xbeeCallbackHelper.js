var Settings  = require('../models').Settings;
var settings = require('../config/settings');
var utils = require('../helpers/utils');
var request = require('request');

module.exports = function(frame) {
	Settings.findById(1).then(function(setting) {
		if (setting && setting.host) {

			var port = setting.port || settings.defaultPort;

			console.log("Send request to: " + setting.host + ":" + port +  '/io/trigger');

			request({
				url: utils.buildUrl(setting.host, port, '/io/trigger'),
				method: 'POST',
				json: {data: frame}
			}, function(error, response, body){
				if (error) {
					console.log(error);
				} else {
					console.log(response.statusCode, body);
				}
			});
		} else {
			console.log("Set up settings: host and port");
		}
	});
};