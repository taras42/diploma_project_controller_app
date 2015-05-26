define(function(require) {

	var Epoxy = require("epoxy");

	return {
        epoxifyView: function(){
            Epoxy.View.mixin(this);
        },

        applyEpoxyBindings: function(){
            this.applyBindings();
        },

        removeEpoxyBindings: function(){
            this.removeBindings();
        }
	};

});