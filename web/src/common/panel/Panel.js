define(function(require) {

	var Backbone = require("backbone"),
		_ = require("underscore"),
		ItemCollection = require("common/itemCollection/ItemCollection"),
		panelTemplate = require("text!./template/panelTemplate.htm"),
		panelButtonTemplate = require("text!./template/panelButtonTemplate.htm"),
		epoxyViewMixin = require("common/mixin/epoxyViewMixin");

	require("css!common/panel/css/panel.css");

	var Panel = Backbone.View.extend({

		el: function() {
			return _.template(panelTemplate)({
				additionalCssClass: this.additionalCssClass,
				title: this.title
			});
		},

		constructor: function(options) {

			this.title = options.title || "";
			this.additionalCssClass = options.additionalCssClass || "";

			Backbone.View.apply(this, arguments);
		},

		initialize: function(options) {
			options = options || {};

			this.contentTemplate = options.contentTemplate;
			this.model = options.model;
			this.buttons = options.buttons && (new ItemCollection({
				eventPrefix: "button",
				items: options.buttons,
				itemTemplate: panelButtonTemplate
			}));

			this.epoxifyView();

			this.initEvents();
		},

		initEvents: function() {
			this.listenTo(this.buttons, "button:selected", _.bind(this._onButtonSelected, this));
		},

		_onButtonSelected: function(buttonView, buttonModel) {
			this.trigger("button:" + buttonModel.get("action"), this, buttonView, buttonModel);
		},

		_renderButtons: function() {
			this.buttons && this.$el.find(".footer").append(this.buttons.render().$el);
		},

		render: function() {
			this.$el.find(".content").append(_.template(this.contentTemplate)({model: this.model.toJSON()}));
			this._renderButtons();
			this.applyEpoxyBindings();
			return this;
		},

		remove: function() {
			this.removeEpoxyBindings();

            Backbone.View.prototype.remove.apply(this, arguments);
		}

	});

	_.extend(Panel.prototype, epoxyViewMixin);

	return Panel;
});