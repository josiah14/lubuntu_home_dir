PUI.YesNo = PUI.Draggable.extend({
	initialize: function(el) {
		this.el = $(el);
		this.yesNo = this.handle = this.el.find('.yes-no');
		
		this.maxLeft = -29; // Match this with the CSS-style
		
		this._super();
	},
	
	set: function(val) {
		var method = val ? 'removeClass' : 'addClass'; 
		this.yesNo[method]('is-no');
		
		fireCallback(this.onChangeCallback, !!val);
	},
	
	activate: function() {
		this.set(true);
	},
	
	deactivate: function() {
		this.set(false);
	},
	
	toggle: function() {
		this.set(!this.isToggled());
	},
	
	isToggled: function() {
		return !this.yesNo.hasClass('is-no');
	},
	
	onChange: function(callback) {
		this.onChangeCallback = callback;
	},
	
	onDragStart: function(e) {
		this.startLeft = parseInt(this.yesNo.css('margin-left'), 10);
	},
	
	onDrag: function(delta) {
		var left = this.startLeft + delta.x;
		this.yesNo.css('margin-left', Math.max(Math.min(left, 0), this.maxLeft) + 'px');
	},
	
	onDragEnd: function(e) {
		if ( Date.now() - this.startedDraggingAt > 250 ) {
			this.determineSetting();
			this.el.removeClass('in-drag');
		} else {
			// Unset margin-left so it reverts to what is set by stylesheet
			this.yesNo.css('margin-left', '');
			
			this.el.removeClass('in-drag');
			this.toggle();
		}
	},
	
	determineSetting: function() {
		var left = parseInt(this.yesNo.css('margin-left'), 10);
		this.yesNo.css('margin-left', '');
		this.set(left/this.maxLeft < 0.5);
	}
});