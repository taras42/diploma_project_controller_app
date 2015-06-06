var settings = require('../config/settings');

module.exports = {
	buildUrl: function(host, port, endpoint, protocol) {
		port = (port && (":" + port)) || "";
		protocol = protocol || "http://";

		return protocol + host + port + endpoint;
	}
}