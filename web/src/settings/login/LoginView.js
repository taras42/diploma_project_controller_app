define(function(require) {

	var Backbone = require("backbone"),
		_ = require("underscore"),
		$ = require("jquery"),
		Panel = require("common/panel/Panel"),
		UserModel = require("settings/login/model/UserModel"),
		loginViewTemplate = require("text!settings/login/template/loginViewTemplate.htm"),
		loginPanelTemplate = require("text!settings/login/template/loginPanelTemplate.htm");


	require("css!settings/login/css/loginView.css");

	var LoginView = Backbone.View.extend({

		el: loginViewTemplate,

		initialize: function(options) {
			options = options || {};

			this.parentElement = options.parentElement ? $(options.parentElement) : $("body");

			this.loginPanel = new Panel({
				title: "Settings",
				contentTemplate: loginPanelTemplate,
				aditionalCssClass: "loginForm",
				buttons: [{
					title: "->",
					action: "login"
				}],
				model: new UserModel({login: "", password: ""})
			});

			this.initEvents();
		},

		initEvents: function() {
			this.listenTo(this.loginPanel, "button:login", _.bind(this._onLoginButton, this));
		},

		_onLoginButton: function() {
			this.loginPanel.model.save().done(function(response) {
				console.log("logged in");
			});
		},

		render: function() {
			this.$el.append(this.loginPanel.render().$el);
			this.parentElement.append(this.$el);
			return this;
		}

	});

	return LoginView;
});