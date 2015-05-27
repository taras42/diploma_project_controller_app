define(function(require) {

	var _ = require("underscore"),
		$ = require("jquery"),
		Backbone = require("backbone"),
		Panel = require("common/panel/Panel"),
		SessionModel = require("settings/model/SessionModel"),
		loginPanelTemplate = require("text!settings/view/login/template/loginPanelTemplate.htm"),
		settingsContainerTemplate = require("text!settings/template/settingsContainerTemplate.htm");

	require("css!settings/css/settings.css");

	var LoginView = Backbone.View.extend({

		el: function() {
			return _.template(settingsContainerTemplate)({
				additionalCssClass: "loginView"
			});
		},

		initialize: function(options) {
			options = options || {};

			this.parentElement = options.parentElement ? $(options.parentElement) : $("body");

			this.loginPanel = new Panel({
				title: "Settings",
				contentTemplate: loginPanelTemplate,
				additionalCssClass: "form",
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
			var self = this;

			this.loginPanel.model.save().done(function(res) {
				res.location && (document.location.href = res.location);
			}).fail(function(res) {
				var resJSON = res.responseJSON;
				self.$el.find(".validationMessage").text(resJSON.error);
			});
		},

		render: function() {
			this.$el.find(".body").append(this.loginPanel.render().$el);
			this.parentElement.append(this.$el);
			return this;
		}

	});

	return LoginView;
});