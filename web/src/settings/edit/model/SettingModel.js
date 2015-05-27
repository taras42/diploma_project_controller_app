define(function(require) {

	var Backbone = require("backbone");

	var SettingModel = Backbone.Model.extend({
		defaults: {
			login: "",
			password: "",
			confirmPassword: "",
			host: "",
			port: ""
		}
	});

	return SettingModel;
});