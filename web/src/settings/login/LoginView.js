define(function(require) {

	var Backbone = require("backbone"),
		_ = require("underscore"),
		$ = require("jquery"),
		Panel = require("common/panel/Panel"),
		loginViewTemplate = require("text!settings/login/template/loginViewTemplate.htm"),
		loginPanelTemplate = require("text!settings/login/template/loginPanelTemplate.htm");

	var LoginView = Backbone.View.extend({

		el: loginViewTemplate,

		initialize: function(options) {
			options = options || {};

			this.parentElement = options.parentElement ? $(options.parentElement) : $("body");

			this.loginPanel = new Panel({
				contentTemplate: loginPanelTemplate,
				aditionalCssClass: "loginForm",
				buttons: [{
					title: "Login",
					action: "login"
				}],
				model: new Backbone.Model({login: "", password: ""})
			});

			this.initEvents();
		},

		initEvents: function() {
			this.listenTo(this.loginPanel, "button:login", _.bind(this._onLoginButton, this));
		},

		_onLoginButton: function() {
			console.log(arguments);
		},

		render: function() {
			this.$el.append(this.loginPanel.render().$el);
			this.parentElement.append(this.$el);
			return this;
		}

	});

	return LoginView;
});