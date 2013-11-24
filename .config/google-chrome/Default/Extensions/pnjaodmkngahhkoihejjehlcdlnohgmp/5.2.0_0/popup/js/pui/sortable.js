PUI.Sortable = PUI.Draggable.extend({
	initialize: function(el, sort, options) {
		this.sortOptions = toOptions(options, {
			onStart: function() {},
			onEnd: function() {},
			processGhost: function(ghost, sortable) { return ghost; }
		});
		
		this.sort = sort;
		
		this.el = $(el);
		this.handle = this.el;
		
		this._super(el, {
			exclude: options.exclude,
			include: options.include,
			waitForDrag: options.waitForDrag
		});
	},
	
	onDragStart: function() {
		this.startOffset = this.el.rect();
		
		this.ghost = this.sortOptions.processGhost(this.el.clone(), this)
		.css({
			position: 'absolute'
		})
		.css(this.startOffset)
		.addClass('ghost')
		.appendTo(document.body);
		
		this.el.addClass('in-sort');
		
		this.sort.onStart(this);
	},
	
	onDrag: function(delta) {
		this.ghost.css({
			left: this.startOffset.left + delta.x,
			top: this.startOffset.top + delta.y
		});
		
		this.sort.check(this)
	},
	
	onDragEnd: function() {
		this.sort.onEnd();
		
		this.ghost.remove();
		this.el.removeClass('in-sort');
		this.sortOptions.onEnd(this);
		
		this.sort.onDragEnd();
	}
});