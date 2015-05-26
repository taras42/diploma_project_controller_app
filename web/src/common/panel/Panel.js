define(function(require) {

	var Backbone = require("backbone"),
		_ = require("underscore"),
		ItemCollection = require("common/itemCollection/ItemCollection"),
		panelTemplate = require("text!./template/panelTemplate"),
		panelButtonTemplate = require("text!./template/panelButtonTemplate"),
		epoxyViewMixin = require("common/mixin/epoxyViewMixin");

	var Panel = Backbone.View.extend({

		el: function() {
			return _.template(panelTemplate)({
				aditionalCssClass: this.aditionalCssClass,
				title: this.title
			});
		},

		initialize: function(options) {
			options = options || {};

			this.contentTemplate = options.contentTemplate;
			this.model = options.model;
			this.title = options.title || "";
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
			// TODO
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