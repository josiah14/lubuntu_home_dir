PUI.SpeechBubble = PUI.Modal.extend({
	initialize: function(text, pointX, pointY) {
		this._super();
		
		this.container.addClass('pui-speech-bubble');
		this.container.append($('<div class="pui-text"></div>').html(text.replace(/\n/g, '<br>')));
		
		this.pointX = pointX;
		this.pointY = pointY;
	}
});

PUI.speechBubble = function(text, x, y) {
	var win = new PUI.SpeechBubble(text, x, y);
	win.show();
	return win;
};