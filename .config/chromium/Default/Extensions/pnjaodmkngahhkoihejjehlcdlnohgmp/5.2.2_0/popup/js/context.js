var Context = ViewController.extend({
	initialize: function(el) {
		this.history = new ActionHistory();

		var container = document.createElement('div');
		container.className = "context-container";
		
		var attrs = el.getAllAttributes();
		for ( var key in attrs ) if ( attrs.hasOwnProperty(key) ) {
			if ( key === "class" )
				container.className += " " + attrs[key];
			else if ( ! ["name"].contains(key) )
				container.setAttribute(key, attrs[key]);
		}
		
		this._super(container);
	
		var controller = Screen[el.getAttribute('name')];
		
		if ( ! controller )
			throw new Error("Controller for context named Screen." + el.getAttribute('for') + " not found");
	
		this.startController = controller;
	},
	
	start: function() {
		Screen.currentVC = this;
		this.setCurrentScreen(new this.startController());
	}
});