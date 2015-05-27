define(function(require) {

	var _ = require("underscore"),
		Backbone = require("backbone"),
		Panel = require("common/panel/Panel"),
		SettingModel = require("settings/edit/model/SettingModel"),
		SessionModel = require("settings/model/SessionModel"),
		editPanelTemplate = require("text!settings/edit/template/editPanelTemplate.htm"),
		editViewTemplate = require("text!settings/edit/template/editViewTemplate.htm");

	require("css!settings/css/settings.css");

	var EditView = Backbone.View.extend({
		el: editViewTemplate,

		initialize: function(options) {
			options = options || {};

			this.parentElement = options.parentElement ? $(options.parentElement) : $("body");

			this.model = new SettingModel();
			this.sessionModel = new SessionModel();

			this.editPanel = new Panel({
				title: "Edit settings",
				contentTemplate: editPanelTemplate,
				aditionalCssClass: "form",
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

			}).fail(function(res) {
				var resJSON = res.responseJSON;
				self.$el.find(".validationMessage").text(resJSON.error);
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