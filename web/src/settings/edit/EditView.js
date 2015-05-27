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

			this.editPanel = new Panel({
				title: "Edit settings",
				contentTemplate: editPanelTemplate,
				aditionalCssClass: "form",
				buttons: [{
					title: "->",
					action: "edit"
				}],
				model: new SettingModel({login: "", password: ""})
			});

			this.initEvents();
		},

		initEvents: function() {
			this.listenTo(this.editPanel, "button:edit", _.bind(this._onEditButton, this));
		},

		_onEditButton: function() {

		},

		render: function() {
			this.$el.append(this.editPanel.render().$el);
			this.parentElement.append(this.$el);
			return this;
		}
	});

	return EditView;
});