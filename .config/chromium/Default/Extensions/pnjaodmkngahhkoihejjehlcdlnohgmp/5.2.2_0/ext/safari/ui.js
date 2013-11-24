// Application host UI methods
// Safari

UI.safari = {
	tabGUID: 1,
	
	initialize: function() {
		safari.application.addEventListener("activate", this.onTabChangedState, true);
		safari.application.addEventListener("open", this.onTabChangedState, true);
		safari.application.addEventListener("navigate", this.onTabChangedState, true);
		this.__tabImages = {};
		this.__tabImageUrls = {};
	},
	
	onTabChangedState: function(e) {
		var tab = e.target;
		if ( tab.activeTab )
			tab = tab.activeTab;
		UI.__ensureId(tab);
		if ( UI.__tabImages[tab.__feederId] && UI.__tabImageUrls[tab.__feederId] == tab.url )
			UI.setBadgeIcon(UI.__tabImages[tab.__feederId], tab.__feederId);
		else
			UI.setBadgeIcon(Config.icon.standard, tab.__feederId)
	},
	
	openTab: function(url, callback) {
		callback = callback || function() {};
		
		var tab = safari.application.activeBrowserWindow.openTab();
		tab.url = url;
		UI.__ensureId(tab);
		
		callback(tab);
	},
	
	closeTab: function(tab, callback) {
		callback = callback || function() {};
		this.__getNativeTab(tab).close();
		callback();
	},
	
	onTabRemoved: function(callback) {
		callback._uiWrapped = function(e) {
			if (e.command != "close-tab")
				return;
			callback();
		};
		safari.application.addEventListener("command", callback._uiWrapped, false);
	},
	
	removeOnTabRemoved: function(callback) {
		safari.application.removeEventListener("command", callback._uiWrapped, false);
	},
	
	setBadge: function(text) {
		safari.extension.toolbarItems.forEach(function(bar) {
			bar.badge = parseInt(text, 10);
		});
	},
	
	setBadgeIcon: function(img, tabId) {
		var tab = false;
		if ( typeof tabId !== "undefined" ) {
			tab = this.getTab(tabId);
			if ( ! tab )
				return;
			UI.__tabImages[tab.id] = img;
			UI.__tabImageUrls[tab.id] = this.__getNativeTab(tabId).url;
		}
		
		UI.currentTab(function(currentTab) {
			if ( ! tab || currentTab.id == tabId ) {
				safari.extension.toolbarItems.forEach(function(bar) {
					bar.image = img;
				});
			}
		});
	},
	
	currentTab: function(callback) {
		callback(new Platform.env.OpaqueTab(safari.application.activeBrowserWindow.activeTab));
	},
	
	tabChangeURL: function(tabId, url) {
		this.__getNativeTab(tabId).url = url;
	},
	
	// The return is only for Safari, making my life easier
	getTab: function(tabId, callback) {
		var t = false;
		for ( var i = 0, win; win = safari.application.browserWindows[i]; i++) {
			if ( ! win.tabs )
				continue;
			
			for ( var x = 0, tab; tab = win.tabs[x]; x++ )
				if ( tab.__feederId === tabId ) {
					var t = new Platform.env.OpaqueTab(tab);
					fireCallback(callback, new Platform.env.OpaqueTab(tab));
					return t;
				}
		}
		fireCallback(callback, false);
		return false;
	},
	
	__getNativeTab: function(tabId) {
		return this.getTab(tabId).__tab;
	},
	
	selectTab: function(tabId, callback) {
		this.__getNativeTab(tabId).active();
		fireCallback(callback);
	},
	
	openPopup: function(url, callback) {
		var win = window.open(url, null, 'width=500,height=400');
		fireCallback(callback, win);
	},
	
	getIntentFeedURL: function() {
		return false;
	},
		
	setPopupSize: function(w, h) {
		safari.extension.popovers[0].width = w;
		safari.extension.popovers[0].height = h;
	},
	
	closePopup: function() {
		safari.extension.popovers[0].hide();
	},
	
	showPopup: function() {
		safari.extension.toolbarItems.forEach(function(bar) {
			bar.showPopover();
		})
	},
	
	addGoogleReaderContentScript: function() {
		safari.extension.addContentScriptFromURL(Ext.path("content/googlereader.js"), ["https://accounts.google.com/o/oauth2/approval*"]);
	},
	
	removeGoogleReaderContentScript: function() {
		safari.extension.removeContentScript(Ext.path("content/googlereader.js"));
	},
	
	__ensureId: function(tab) {
		if ( typeof tab.__feederId !== "undefined" )
			return tab;
		tab.__feederId = UI.tabGUID++;
		return tab;
	}
};

UI.safari.Notifications = new (Class.extend({
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