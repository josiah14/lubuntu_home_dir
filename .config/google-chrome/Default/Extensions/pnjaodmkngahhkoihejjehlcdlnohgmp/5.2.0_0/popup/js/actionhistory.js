var ActionHistory = Class.extend({
	initialize: function() {
		this.reset();

		this.wrapAround = true;
		this.onEndCallback = function() {};
		this.onStartCallback = function() {};
	},

	reset: function() {
		this.list = [];
		this.index = -1;
	},

	addAction: function(action) {
		this.list.push(action);
	},

	setActiveAction: function(action) {
		this.index = this.list.indexOf(action);
	},

	next: function() {
		this.byOffset(1);
		return this.current();
	},

	previous: function() {
		this.byOffset(-1);
		return this.current();
	},

	current: function() {
		return this.list[this.index];
	},

	byOffset: function(offset) {
		this.index += offset;

		if (this.wrapAround) {
			if (this.index >= this.list.length)
				this.index = 0;
			else if (this.index < 0)
				this.index = this.list.length - 1;
		} else {
			if (this.index >= this.list.length) {
				this.index = this.list.length - 1;
				this.onEndCallback();
			} else if (this.index < 0) {
				this.index = 0;
				this.onStartCallback();
			}
		}
	},

	onEnd: function(callback) {
		this.onEndCallback = callback;
	},

	onStart: function(callback) {
		this.onStartCallback = callback;
	}
});