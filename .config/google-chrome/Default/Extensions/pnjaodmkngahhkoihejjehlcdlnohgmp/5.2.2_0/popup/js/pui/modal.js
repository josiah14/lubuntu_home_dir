PUI.Modal = Class.extend({
	initialize: function() {
		this.parent = $(document.body);
		this.makeContainer();
	},
	
	destroy: function() {
		if ( this.isDestroyed )
			return;
			
		this.isDestroyed = true;
		
		this.container.remove();
		this.overlay.remove();
		
		fireCallback(this.onDestroy);
	},
	
	makeContainer: function() {
		this.container = $('<div></div>').addClass('pui-modal').css({
			position: 'fixed',
			zIndex: '20'
		});
		this.container.appendTo(this.parent);
	},
	
	show: function() {
		this.container.show();
		this.position();
		
		this.addOverlay();
	},
	
	addOverlay: function() {
		this.overlay = $('<div class="pui-overlay"></div>').css({
			position: 'fixed',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			width: '100%',
			height: '100%',
			zIndex: '15'
		}).appendTo(this.parent);
	},
	
	position: function() {
		var rect = this.container.rect();
		
		var x = this.pointX ? this.pointX : $(window).width()/2 - rect.width/2;
		var y = this.pointY ? this.pointY : $(window).height()/2 - rect.height/2;
		
		this.container.css({
			left: x,
			top: y
		});
	},
	
	setText: function(text) {
		this.container.find('.pui-alert-text').html(text.replace(/\n/g, '<br>')).on('click', 'a', function(e) {
			if (!Ext.isOnline()) {
				e.preventDefault();
				UI.openTab(this.href);
			}
		});
	}
});