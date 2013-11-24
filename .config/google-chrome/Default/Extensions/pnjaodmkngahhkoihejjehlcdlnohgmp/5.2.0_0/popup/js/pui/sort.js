PUI.Sort = Class.extend({
	initialize: function(options) {
		this.options = toOptions(options, {
			droppable: false,
			dropAreas: [],
			onMove: function() {},
			onDrop: function() {},
			onDropArea: function() {},
			onEnd: function() {},
			sortOptions: {
				processGhost: function() {}
			}
		});
		
		this.sortables = [];
	},
	
	add: function(el) {
		this.sortables.push(new PUI.Sortable(el, this, this.options.sortOptions));
	},
	
	clear: function() {
		this.sortables = [];
	},
	
	onStart: function(sortable) {
		var globalDrops = [];
		
		PUI.Sort.drops.forEach(function(drop) {
			$(drop.selector).not('.ghost').forEach(function(el) {
				el = $(el);
				el.drop = drop;
				globalDrops.push(el);
			});
		});
		
		// Remove anything that can confuse sorting, for example, items in the current this.sortable
		this.globalDrops = globalDrops.filter(function(el) {
			return el[0] != sortable.el[0] && ! this.sortables.some(function(s) { return s.el[0] == el[0]; });
		}, this);
	},
	
	onEnd: function() {
		this.globalDrops = false;
	},
	
	check: function(sortable) {
		this.currentSortable = sortable;
		this.resetDroppable();
		
		for ( var i = 0, area; area = this.options.dropAreas[i]; i++ ) {
			if ( ! area.length || ! this.isOver(area, sortable) )
				continue;
			
			area.addClass('drop-over');
			this.currentDropArea = area;
			return;
		}
		
		for ( var i = 0, globalDrop; globalDrop = this.globalDrops[i]; i++ ) {
			if ( ! globalDrop || ! this.isOver(globalDrop, sortable) )
				continue;
			
			globalDrop.addClass('drop-over');
			this.currentGlobalDrop = {el: globalDrop, drop: globalDrop.drop};
			return;
		}
		
		for ( var i = 0, sort; sort = this.sortables[i]; i++ ) {
			if ( sort == sortable || sort.el.hasClass('in-sort') )
				continue;
			
			var rect = sort.el.rect();
			rect.bottom = rect.top + rect.height;
			rect.right = rect.left + rect.width;
			
			if ( sortable.pointer.y > rect.top && sortable.pointer.y < rect.bottom && sortable.pointer.x < rect.right && sortable.pointer.x > rect.left ) {
				var dir;
				
				var deltas = [0.4, 0.6];
				
				// If sorting is disabled the drop areas are bigger
				if ( this.options.disableSort )
					deltas = [1.0, 0.0];
				
				if ( this.options.droppable && sort.el.is(this.options.droppable) ) {
					var delta = (sortable.pointer.y - rect.top)/(rect.bottom-rect.top);

					if ( delta < deltas[0] || delta > deltas[1] ) {
						this.currentDroppable = sort;
						this.currentDroppable.el.addClass('drop-over');
						return;
					}
				}
				
				if ( this.options.disableSort )
					continue;
				
				if ( sortable.dir.y == 'down' ) {
					sortable.el.insertAfter(sort.el);
					dir = 'after';
				} else {
					sortable.el.insertBefore(sort.el);
					dir = 'before';
				}
				this.options.onMove(sortable, sort, dir);
				
				// Abort?
				return;
			}
		}
	},
	
	isOver: function(area, sortable) {
		var rect = area.rect();
		rect.bottom = rect.top + rect.height;
		rect.right = rect.left + rect.width;
			
		var x = sortable.pointer.x;
		var y = sortable.pointer.y;

		var res = x > rect.left && x < rect.right && y < rect.bottom && y > rect.top;

		return res;
	},
	
	resetDroppable: function() {
		if ( this.currentDroppable )
			this.currentDroppable.el.removeClass('drop-over');
		
		if ( this.currentDropArea )
			this.currentDropArea.removeClass('drop-over');
		
		if ( this.currentGlobalDrop )
			this.currentGlobalDrop.el.removeClass('drop-over');

		this.currentGlobalDrop = this.currentDropArea = this.currentDroppable = false;
	},
	
	onDragEnd: function() {
		if ( this.currentDroppable )
			this.options.onDrop(this.currentDroppable, this.currentSortable);
		
		if ( this.currentDropArea )
			this.options.onDropArea(this.currentDropArea, this.currentSortable);
		
		if ( this.currentGlobalDrop ) {
			this.currentGlobalDrop.drop.callback(this.currentGlobalDrop.el, this.currentSortable);
			this.resetDroppable();
			return;
		}
		
		this.resetDroppable();
		this.options.onEnd();
	}
});

PUI.Sort.drops = [];

PUI.Sort.addDrop = function(selector, func) {
	PUI.Sort.drops.push({selector: selector, callback: func});
};
