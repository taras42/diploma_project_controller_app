define(function(require) {

	var Backbone = require("backbone"),
		_ = require("underscore"),
		epoxyViewMixin = require("common/mixin/epoxyViewMixin");

	var Panel = Backbone.View.extend({

		el: function() {
			return _.template(this.template)({
				aditionalCssClass: this.aditionalCssClass
			});
		},

		initialize: function(options) {
			options = options || {};

			this.contentTemplate = options.contentTemplate;
			this.model = options.model;

			this.epoxifyView();
		},

		render: function() {
			this.$el.append(_.template(this.contentTemplate)({model: this.model}));
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