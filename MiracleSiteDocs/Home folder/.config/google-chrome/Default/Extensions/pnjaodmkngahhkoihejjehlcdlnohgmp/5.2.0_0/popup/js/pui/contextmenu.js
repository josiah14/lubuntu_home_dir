PUI.ContextMenu = Class.extend({
	initialize: function(data, parent, x, y, options) {
		options = options || {};

		this.destroyOnHide = typeof options.destroyOnHide === "undefined" ? true : options.destroyOnHide;
		this.elementPosition = typeof options.elementPosition === "undefined" ? false : options.elementPosition;

		this.parent = $(parent || document.body);
		this.x = x;
		this.y = y;
		this.marginLeft = options.marginLeft || 0;
		this.marginTop = options.marginTop || 0;
		this.create();
		
		this.extraMargin = 30;

		for ( var key in data ) {
			this.addLink(key, data[key]);
		}
	},
	
	destroy: function() {
		this.container.remove();
	},
	
	create: function() {
		this.container = $('<div class="tooltip context-menu"></div>');
		this.container.appendTo(this.parent);
		this.container[0].ctxMenu = this;
		this.container.css({top: -1000, left: 0});
	},
	
	show: function() {
		this.hideAll();
		
		this.reposition();
		setTimeout(function() { this.container.addClass('is-active'); }.bind(this), 10);
		setTimeout(function() { this.container.addClass('show').css({top: this.y}) }.bind(this), 20);
		
		window.addEventListener('click', this.hideEvent, true);
		
		this.adjustDocumentSize();
	},
	
	hideEvent: function(e) {
		e.preventDefault();
		
		if ( ! this.container.find('*').get().contains(e.target) || ! $(e.target).closest('.tooltip-item').length )
			e.stopPropagation();

		this.hide();
	},
	
	hide: function() {
		this.container.removeClass('show');
		window.removeEventListener('click', this.hideEvent, true);
		
		this.revertDocumentSize();

		if ( this.destroyOnHide )
			this.destroy.delay(500);
	},
	
	hideAll: function() {
		$('.tooltip').get().forEach(function(el) {
			if ( el.ctxMenu && el.ctxMenu !== this )
				el.ctxMenu.hide();
		}, this);
	},
	
	addLink: function(text, callback) {
		var link = $('<div class="tooltip-item"></div>');
		
		// Replace "balbla [classes foo bar]" with "balbla"
		var classes = "";
		text = text.replace(/\[.*\]/, function(a) {
			classes = a.split(/\[|\]/)[1];
			return "";
		})

		link.addClass(classes);

		if ( text.match(/^--/) ) {
			link.addClass('separator');
			link.html('<span>...</span>');
		} else {
			link.html(text);
		}
		
		link.appendTo(this.container);
		link.on('click', this.itemClicked.withCallback(callback));
	},
	
	itemClicked: function(e, callback) {
		e.preventDefault();
		e.stopPropagation();
		fireCallback(callback, {item: this.item});
		this.hide();
	},

	reposition: function() {
		var x = this.x;
		var y = this.y;
		
		if (this.elementPosition) {
			var r = this.elementPosition.rect();
			x = r.left + r.width/2;
			y = r.top + r.height/2;
		}

		var containerSize = this.container.rect();

		// If bottom
		if ( y + containerSize.height > window.innerHeight && y - $(window).scrollTop() - containerSize.height > 0  ) {
			y -= containerSize.height;
			this.container.addClass("bottom");
		} else {
			this.container.addClass("top");
		}
		
		// Check bounds x
		if ( x + containerSize.width > window.innerWidth ) {
			this.container.addClass("right");
		}
		
		this.x = x + this.marginLeft;
		this.y = y + this.marginTop;
		
		this.container.css({
			left: this.x,
			top: this.y
		});
	},
	
	adjustDocumentSize: function() {
		var rect = this.container.rect();
		var bottom = rect.top + rect.height;
		
		if (document.body.clientHeight > bottom)
			return;
		
		$(document.body).css('height', bottom + this.extraMargin);
		this.adjustedDocument = true;
	},
	
	revertDocumentSize: function() {
		if (! this.adjustedDocument)
			return;
		$(document.body).css('height', '');
	}
});
