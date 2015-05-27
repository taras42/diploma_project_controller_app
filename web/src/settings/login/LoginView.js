define(function(require) {

	var _ = require("underscore"),
		$ = require("jquery"),
		Backbone = require("backbone"),
		Panel = require("common/panel/Panel"),
		SessionModel = require("settings/model/SessionModel"),
		loginViewTemplate = require("text!settings/login/template/loginViewTemplate.htm"),
		loginPanelTemplate = require("text!settings/login/template/loginPanelTemplate.htm");

	require("css!settings/css/settings.css");

	var LoginView = Backbone.View.extend({

		el: loginViewTemplate,

		initialize: function(options) {
			options = options || {};

			this.parentElement = options.parentElement ? $(options.parentElement) : $("body");

			this.loginPanel = new Panel({
				title: "Settings",
				contentTemplate: loginPanelTemplate,
				aditionalCssClass: "form",
				buttons: [{
					title: "->",
					action: "login"
				}],
				model: new SessionModel({login: "", password: ""})
			});

			this.initEvents();
		},

		initEvents: function() {
			this.listenTo(this.loginPanel, "button:login", _.bind(this._onLoginButton, this));
		},

		_onLoginButton: function() {
			this.loginPanel.model.save().done(function(res) {
				res.location && (document.location.href = res.location);
			}).fail(function(res) {
				var resJSON = res.responseJSON;
				console.log(resJSON.error);
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