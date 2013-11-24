var Controller = Class.extend({
	initialize: function() {
		this.created = Date.now();
		this.vc = Screen.currentVC;
		
		this.template = new PUI.Template(this.template);
		this.template.prepareVariables(this.vc);
		
		this.ui = this.template.getComponents();
		this.contextMenus = {};
		
		this.event = new PUI.Events(this.template.container, this);
		this.event.add(this.events || {});
		
		this.addStandardEvents();
		
		this.args = arguments;
		this.start.apply(this, arguments);
	},
	
	destroy: function() {
		// Remove events bound by data objects
		this.template.destroy();
	},
	
	start: function() {},
	onVisible: function() {}, // when page added to DOM
	onCurrent: function() {}, // when set as current screen
	onOff: function() {}, // when page has gone off screen
	onPopupVisible: function() {},
	onPopupHide: function() {},

	navNext: function() {},
	navPrevious: function() {},
	navForward: function() {},
	navBack: function() {},
	setCurrentNavFromItem: function() {},

	callbackAfterAnimation: function(callback) {
		return function() {
			return this.vc.addAnimationDoneCallback(callback, arguments);
		}.bind(this);
	},
	
	// Reused actions across every screen
	// Maybe this should be in a "Screen"-class, instead of Controller?
	
	addStandardEvents: function() {
		this.event.addEvent('click-or-touch .back, .escape', 'back');
		this.event.addEvent('click .tooltip-button', 'showTooltip');
		this.event.addEvent('click .get-feeder-pro', 'getFeederPro');
		this.event.addEvent('contextmenu', 'checkContextClick');
		this.event.addEvent('click .feeder-online', 'openOnline');
	},
	
	openOnline: function(e) {
		e.preventDefault();

		if (app.user.isPro())
			UI.openTab(app.config.feeder.root);
		else
			UI.openTab(app.config.feeder.connectURL);
	},

	showTooltip: function(e) {
		if ( this.currentTooltip || $(e.target).closest('.tooltip-item').length )
			return;

		var el = $(e.currentTarget);
		
		this.currentTooltip = el.find('.tooltip').addClass('show');
		
		// Add cover element over content
		window.addEventListener('click', this.blockAllClicksAndHideTooltip, true);
	},

	checkContextClick: function(e) {
		if ( e.which != 3 )
			return true;
		
		var found = false;
		for ( var key in this.contextMenus ) if ( this.contextMenus.hasOwnProperty(key) ) {
			if ( $(e.target).closest(key).length )
				found = key;
		}

		if ( ! found )
			return true;
		
		e.preventDefault();
		e.stopPropagation();
		
		var menu = new PUI.ContextMenu(this.contextMenus[key], false, e.pageX, e.pageY);
		menu.item = e.item;
		menu.show();
	},
	
	addContextMenu: function(selector, obj, options) {
		options = options || {};
		
		for ( var key in obj ) if ( obj.hasOwnProperty(key) )
			obj[key] = this[obj[key]];
		
		if ( ! options.onlyPopup || (options.onlyPopup && this.vc.isPopup()) )
			this.contextMenus[selector] = obj;
	},
	
	blockAllClicksAndHideTooltip: function(e) {
		this.hideTooltip();
		
		if ( $(e.target).closest('.tooltip').length )
			return;
			
		e.preventDefault();
		e.stopPropagation();
	},
	
	hideTooltip: function() {
		this.currentTooltip.removeClass('show');
		this.currentTooltip = false;
		window.removeEventListener('click', this.blockAllClicksAndHideTooltip, true);
	},

	back: function(e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		this.vc.popScreen();
	},
		
	openOptionsPage: function() {
		this.vc.openSettingsPage();
	},
	
	openEveryUnreadPost: function() {
		app.user.openEveryUnread();
	},
	
	clearAllUnread: function() {
		chain(this.disableEvents)
		.and(app.user.clearAllUnread)
		.and(this.enableEvents)
		.and(this.vc.currentScreen.onClearAllUnread)
		.and(this.vc.currentScreen.populate);
	},
	
	onClearAllUnread: function(callback) {
		fireCallback(callback);
	},
	
	getFeederPro: function(e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		UI.openTab(app.config.feeder.connectURL + (app.sync.get("google") ? '&googlereader=true' : ''));
		UI.closePopup();
	},
	
	disableEvents: function(callback) {
		this.vc.listener.disable = true;
		fireCallback(callback);
	},
	
	enableEvents: function(callback) {
		this.vc.listener.disable = false;
		fireCallback(callback);
	},
	
	startScreenLoading: function() {
		this.template.el('[data-loader]').addClass("loading-screen");
	},
	
	stopScreenLoading: function() {
		this.template.el('.loading-screen').removeClass("loading-screen");
	}
});