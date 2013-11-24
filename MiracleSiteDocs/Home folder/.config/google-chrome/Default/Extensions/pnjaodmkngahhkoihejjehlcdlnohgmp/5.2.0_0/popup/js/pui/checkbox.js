PUI.Checkbox = Class.extend({
	initialize: function(el) {
		this.el = $(el);
		
		this.el.on('click', this.onClick);
	},
	
	set: function(checked) {
		if ( checked )
			this.el.addClass('checked');
		else
			this.el.removeClass('checked');
		
		var event = document.createEvent("HTMLEvents");
		event.initEvent("change", true, true);
		this.el[0].dispatchEvent(event);
	},
	
	isChecked: function() {
		return this.el.hasClass('checked');
	},
	
	toggle: function() {
		return this.set(!this.isChecked());
	},
	
	onClick: function(e) {
		e.preventDefault();
		e.stopPropagation();
		this.toggle();
	}
})