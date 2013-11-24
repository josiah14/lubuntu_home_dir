PUI.Prompt = PUI.Confirm.extend({
	initialize: function(text) {
		this._super(text);
		
		this.container.addClass('pui-confirm');
		
		var textElement = this.container.find('.pui-confirm-text');
		this.input = $('<div class="pui-prompt-text"><input type="text" /></div>').insertAfter(textElement).find('input');
		this.input.on('keydown', this.onKeyDown);
		
		this.yesButton.text("OK");
		this.noButton.text("Cancel");
	},
	
	onKeyDown: function(e) {
		if ( e.keyCode !== 13 )
			return; 
		
		e.preventDefault();
		e.stopPropagation();
		
		if ( this.input.val().length > 0 )
			this.yesClick();
	},
	
	show: function() {
		this._super();
		this.input.focus();
	},
	
	yesClick: function() {
		this.destroy();
		fireCallback(this.yesCallback, this.input.val());
	},
	
	done: function(callback) {
		this.yesCallback = callback;
	}
});

PUI.prompt = function(text) {
	var modal = new PUI.Prompt(text);
	modal.show();
	return modal;
}