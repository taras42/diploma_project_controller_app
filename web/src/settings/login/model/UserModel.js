define(function(require) {

	var Backbone = require("backbone");

	var UserModel = Backbone.Model.extend({
		url: "/session"
	});

	return UserModel;
});	