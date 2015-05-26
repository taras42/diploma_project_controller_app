define(function(require){

	var Backbone = require('backbone'),
		_ = require('underscore'),
		itemTemplate = require("text!components/common/item/template/itemTemplate.htm"),
		$ = require('jquery');

	var Item = Backbone.View.extend({

		el: function(){
			var self = this;
			return	_.template(itemTemplate)({
				additionalCssClass: self.additionalCssClass,
				model: self.model
			});
		},

		events: {
			"click": "select",
			"mouseenter": "_onMouseEnter",
			"mouseleave": "_onMouseLeave"
		},

		constructor: function(options){
			if(!options){
				throw 'itemTemplate option is required';
			}

			this.itemTemplate = options.itemTemplate;
			this.additionalCssClass = options.additionalCssClass || ""; 
			this.model = options.model || new Backbone.Model();

			this.initialize();
		},

		initialize: function(){
			this.setElement(this.el());
		},

		render: function(){
			this.$el.html(_.template(this.itemTemplate)({model: this.modelToJSON()}));
			return this;
		},

		modelToJSON: function(){
			var cid = this.model.cid,
				attrs = this.model.toJSON();

			return _.extend({}, attrs, {cid: cid});
		},

		select: function(event){
			this.trigger("select", this, event);
		},

		_onMouseEnter: function(){
			this.trigger("mouseenter", this, event);
		},
		
		_onMouseLeave: function(){
			this.trigger("mouseleave", this, event);
		}

	});

	return Item;

});