define(function(require){

	var _ = require("underscore"),
		$ = require('jquery'),
		itemCollectionTemplate = require("text!components/common/itemCollection/template/itemCollectionTemplate.htm"),
		Item = require("components/common/item/Item"),
		Backbone = require('backbone');

	var defaults = {
		eventPrefix: "item",
		eventSufix: "selected",
		clickEvent: "click"
	};

	var ItemCollection = Backbone.View.extend({

		events: {
			"click .item": "_onItemEvent",
			"dblclick .item": "_onItemEvent",
			"mouseenter .item": "_onItemEvent",
			"mouseleave .item": "_onItemEvent"
		},

		el: function(){
			var self = this;
			return	_.template(itemCollectionTemplate)({
				additionalCssClass: self.additionalCssClass
			});
		},

		constructor: function(options){
			this.model = options.model || Backbone.Model;
			this.items = options.items || {};
			this.eventPrefix = options.eventPrefix || defaults.eventPrefix;
			this.itemTemplate = options.itemTemplate;
			this.additionalCssClass = options.additionalCssClass || ""
			this.itemAdditionalCssClass = options.itemAdditionalCssClass || ""

			this.itemsCollectionView = [];

			this.initialize();
		},

		initialize: function(){
			var self = this;

			this.itemsCollectionView = _.map(this.items, function(item){

				var model = new self.model(item); 

				var itemView = new Item({
					model: model,
					itemTemplate: self.itemTemplate,
					additionalCssClass: self.itemAdditionalCssClass		
				});

				return itemView;
			});

			this.setElement(this.el());
		},

		addItem: function(model){
			var self = this;

			var itemView = new Item({
				model: model,
				itemTemplate: self.itemTemplate,
				additionalCssClass: self.itemAdditionalCssClass		
			});

			this.itemsCollectionView.push(itemView);

			this.trigger("add:item", this, itemView);

			return itemView;
		},

		getItems: function(){
			return this.itemsCollectionView;
		},

		findBy: function(criteria){
			var criteriaKeys = _.pairs(criteria),
				criteriaKeysLength  = criteriaKeys.length;

			return _.find(this.itemsCollectionView, function(itemView){
				var isEqual;

				for(var i = 0; i < criteriaKeysLength; i++){
					if(itemView.model.get(criteriaKeys[i][0]) === criteriaKeys[i][1]){
						isEqual = true;
					}else{
						break;
					}
				}

				return isEqual && itemView;
			});
		},

		removeItem: function(){
			// TODO		
		},

		resetCollection: function(items){
			var self = this;

			_.each(this.itemsCollectionView, function(itemView){
				itemView.remove();
			});

			this.itemsCollectionView = [];

			if(items){
				_.each(items, function(item){
					var model = new self.model(item); 
					self.addItem(model);
				});
			}
		},

		renderItem: function(itemView){
			this.$el.append(itemView.render().$el);
		},

		_onItemEvent: function(e){
			var itemId = this._getItemId(e),
				itemView = this._getItemByCID(itemId);

			var eventSufix = e.type === defaults.clickEvent ? defaults.eventSufix : e.type;

			itemView && this.trigger(this.eventPrefix + ":" + eventSufix, itemView, itemView.model);
		},

		_getItemByCID: function(cid){
			return _.find(this.itemsCollectionView, function(itemView){
				return itemView.model.cid === cid;
			});
		},

		_getItemId: function(e){
			var target = $(e.target);
			var itemId = target.parent("div[item-id]").attr("item-id") || target.attr("item-id");

			return itemId;
		},

		render: function(){
			var self = this;

			_.each(this.itemsCollectionView, function(item){
				self.renderItem(item);
			});

			return this;
		},

		remove: function(){
			this.resetCollection();

			Backbone.View.prototype.remove.apply(this, arguments);
		}

	});

	return ItemCollection;

});