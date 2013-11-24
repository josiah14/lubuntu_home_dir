PUI.Draggable = Class.extend({
	initialize: function(el, options) {
		this.options = toOptions(options, {
			exclude: '',
			include: '',
			waitForDrag: false
		});
		
		this.handle.on('mousedown', this.mousedown);
	},
	
	destroy: function() {
		this.handle.off('mousedown', this.mousedown);
	},
	
	mousedown: function(e, forceIt) {
		if ( this.options.exclude && $(e.target).closest(this.options.exclude).length )
			return;
		
		if ( this.options.include && ! $(e.target).closest(this.options.include).length )
			return;
		
		e.preventDefault();
		
		this.bindDragEvents();
		this.started = false;
			
		if ( this.options.waitForDrag && ! forceIt )
			return;
		
		this.started = true;
		
		e.stopPropagation();
		
		this.el.addClass('in-drag');
		
		this.start = this.pointer = {x: e.pageX, y: e.pageY};
		
		this.onDragStart();
	},
	
	bindDragEvents: function() {
		this.startedDraggingAt = Date.now();
		$(window).on('mousemove', this.mousemove).on('mouseup', this.mouseup);
	},
	
	mousemove: function(e) {
		if ( ! this.started && this.options.waitForDrag ) {
			this.mousedown(e, true);
		}
		
		e.preventDefault();
		
		this.dir = {
			x: e.pageX - this.pointer.x > 0 ? 'right' : 'left',
			y: e.pageY - this.pointer.y > 0 ? 'down' : 'up'
		};
		
		this.pointer = {x: e.pageX, y: e.pageY};
		this.delta = {x: e.pageX - this.start.x, y: e.pageY - this.start.y};
		
		this.onDrag(this.delta);
	},
	
	mouseup: function(e) {
		e.preventDefault();

		$(window).off('mousemove', this.mousemove).off('mouseup', this.mouseup);
		
		if ( ! this.started )
			return;
		
		this.el.removeClass('in-drag');
		this.onDragEnd();
	},
	
	onDragStart: function() {},
	onDrag: function(delta) {},
	onDragEnd: function() {}
});