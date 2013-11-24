PUI.ScreenModal = PUI.Modal.extend({
	initialize: function(screenClass) {
		this._super();
		
		this.screenClass = screenClass;
		
	},
	
	show: function() {
		this._super();
		
		this.instance = new this.screenClass();
		this.container.append(this.instance.template.container);
		
		this.overlay.on('click', this.destroy);
		
		this.position();
	}
});
