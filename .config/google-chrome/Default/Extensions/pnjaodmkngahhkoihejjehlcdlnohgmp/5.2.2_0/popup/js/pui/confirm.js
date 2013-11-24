PUI.Confirm = PUI.Modal.extend({
	initialize: function(text) {
		this._super();
		
		this.container.addClass('pui-confirm');
		this.container.append($('<div class="pui-confirm-text"></div>').html(text.replace(/\n/g, '<br>')));
		
		this.noButton = $('<div class="pui-button">No</div>').click(this.noClick).appendTo(this.container);
		this.yesButton = $('<div class="pui-button confirm">Yes</div>').click(this.yesClick).appendTo(this.container);

		$(window).on('keydown', this.keydown);
	},
	
	destroy: function() {
		this._super();
		$(window).off('keydown', this.keydown);
	},
	
	keydown: function(e) {
		if (e.keyCode != 13)
			return;
		
		this.yesClick();
	},
	
	yesClick: function() {
		this.destroy();
		fireCallback(this.yesCallback);
	},
	
	noClick: function() {
		this.destroy();
		fireCallback(this.noCallback);
	},
	
	yes: function(func) {
		this.yesCallback = func;
		return this;
	},
	
	no: function(func) {
		this.noCallback = func;
		return this;
	}
});

PUI.confirm = function(text) {
	var win = new PUI.Confirm(text);
	win.show();
	return win;
};