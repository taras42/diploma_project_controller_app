define(function(require) {

	var Backbone = require("backbone");

	var SettingModel = Backbone.Model.extend({
		defaults: {
			login: "",
			newPassword: "",
			confirmPassword: "",
			password: "",
			host: "",
			port: ""
		},

		url: "/settings"
	});

	return SettingModel;
});