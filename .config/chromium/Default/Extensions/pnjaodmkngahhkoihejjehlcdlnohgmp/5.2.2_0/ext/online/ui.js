// Application host UI methods
// Online

UI.online = {
	initialize: function() {
		
	},
	
	openTab: function(url, callback) {
		window.open(url);
		fireCallback(callback);
	},
	
	closeTab: function(tab, callback) {
		callback = callback || function() {};
		callback();
	},
	
	onTabRemoved: function(callback) {
		// NoOp...
	},
	
	removeOnTabRemoved: function(callback) {
		// NoOp...
	},
	
	setBadge: function(text) {
		// NoOp...
	},
	
	setBadgeIcon: function(img, tab) {
		// NoOp...
	},
	
	currentTab: function(callback) {
		callback({id: 1});
	},
	
	tabChangeURL: function(tabId, url) {
		// NoOp...?
	},
	
	getTab: function(tabId, callback) {
		callback({id: tabId});
	},
	
	selectTab: function(tabId, callback) {
		fireCallback(callback);
	},
	
	openPopup: function(url, callback) {
		var win = window.open(url, null, 'width=500,height=400');
		fireCallback(callback, win);
	},
	
	getIntentFeedURL: function() {
		return false;
	}
};

UI.online.Notifications = new (Class.extend({
	initialize: function() {},
	
	image: '/icons/icon48x48.png',
	duration: 15000,
	
	can: function() {
		return window.webkitNotifications.checkPermission() == 0;
	},
	
	// Has to be trigger from user action
	ask: function(callback) {
		window.webkitNotifications.requestPermission(callback || function() {});
	},
	
	show: function(title, message, options) {
		options.link = options.link || function() {};
		
		var note = window.webkitNotifications.createNotification(this.image, title, message);
		note.onclick = function() {
			window.focus();
			options.link();
			note.cancel();
		};
		
		note.show();
		
		setTimeout(function() {
			note.cancel();
		}, this.duration);
		
		return note;
	}
}))();