define(function(require) {

	var _ = require("underscore"),
		Backbone = require("backbone"),
		Panel = require("common/panel/Panel"),
		SettingModel = require("settings/view/edit/model/SettingModel"),
		SessionModel = require("settings/model/SessionModel"),
		editPanelTemplate = require("text!settings/view/edit/template/editPanelTemplate.htm"),
		settingsContainerTemplate = require("text!settings/template/settingsContainerTemplate.htm");

	require("css!settings/css/settings.css");

	var defaults = {
		fadeOutTime: 2000
	}

	var EditView = Backbone.View.extend({
		el: function() {
			return _.template(settingsContainerTemplate)({
				additionalCssClass: "editView"
			});
		},

		initialize: function(options) {
			options = options || {};

			this.parentElement = options.parentElement ? $(options.parentElement) : $("body");

			this.model = new SettingModel();
			this.sessionModel = new SessionModel();

			this.editPanel = new Panel({
				title: "Edit settings",
				contentTemplate: editPanelTemplate,
				additionalCssClass: "form",
				buttons: [
					{
						title: "&#8615;",
						action: "logout"
					},
					{
						title: "->",
						action: "edit"
					}
				],
				model: this.model
			});

			this.initEvents();
		},

		initEvents: function() {
			this.listenTo(this.editPanel, "button:edit", _.bind(this._onEditButton, this));
			this.listenTo(this.editPanel, "button:logout", _.bind(this._onLogoutButton, this));
		},

		fetchModel: function() {
			return this.model.fetch({
				headers: {
					Accept: "application/json"
				}
			});
		},

		_onEditButton: function() {
			var self = this;

			this.model.save().done(function(res) {
				
				self.model.set({
					password: "",
					newPassword: "",
					confirmPassword: ""
				});

				self.sessionModel.set(res);
				self.$el.find(".validationMessage").text("");
				self.$el.find(".successMessage").show().text("Saved").fadeOut(defaults.fadeOutTime);

			}).fail(function(res) {
				var resJSON = res.responseJSON;
				self.$el.find(".validationMessage").show().text((resJSON && resJSON.error) 
					|| "Server error").fadeOut(defaults.fadeOutTime);
			});
		},

		_onLogoutButton: function() {
			this.sessionModel.destroy().done(function(res) {
				res.location && (document.location.href = res.location);
			});
		},

		render: function() {
			var self = this;
			
			this.fetchModel().done(function() {
				self.sessionModel.set(self.model.toJSON());
				self.$el.find(".body").append(self.editPanel.render().$el);
				self.parentElement.append(self.$el);
			});
		}
	});

	return EditView;
});