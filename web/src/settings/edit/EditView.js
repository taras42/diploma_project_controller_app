define(function(require) {

	var _ = require("underscore"),
		Backbone = require("backbone"),
		Panel = require("common/panel/Panel"),
		SettingModel = require("settings/edit/model/SettingModel"),
		editPanelTemplate = require("text!settings/edit/template/editPanelTemplate.htm"),
		editViewTemplate = require("text!settings/edit/template/editViewTemplate.htm");

	require("css!settings/css/settings.css");

	var EditView = Backbone.View.extend({
		el: editViewTemplate,

		initialize: function(options) {
			options = options || {};

			this.parentElement = options.parentElement ? $(options.parentElement) : $("body");

			this.model = new SettingModel();

			this.editPanel = new Panel({
				title: "Edit settings",
				contentTemplate: editPanelTemplate,
				aditionalCssClass: "form",
				buttons: [{
					title: "->",
					action: "edit"
				}],
				model: this.model
			});

			this.initEvents();
		},

		initEvents: function() {
			this.listenTo(this.editPanel, "button:edit", _.bind(this._onEditButton, this));
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
			}).fail(function(res) {
				var resJSON = res.responseJSON;
				console.log(resJSON.error);
			});
		},

		render: function() {
			var self = this;
			
			this.fetchModel().done(function() {
				self.$el.append(self.editPanel.render().$el);
				self.parentElement.append(self.$el);
			});
		}
	});

	return EditView;
});