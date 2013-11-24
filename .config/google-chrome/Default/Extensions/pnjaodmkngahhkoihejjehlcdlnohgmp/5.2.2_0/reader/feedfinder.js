var FeedFinder = Class.extend({
	initialize: function() {
		this.availableFeeds = {};
	},

	startListening: function() {
		app.events.subscribe("feedsFound", this.foundInTab);
		UI.onTabRemoved(this.tabClosed);
	},
		
	destroy: function(callback) {
		callback = callback || function() {};
		
		app.events.unsubscribe("feedsFound", this.foundInTab);
		UI.removeOnTabRemoved(this.tabClosed);
		
		callback();
	},
	
	foundInTab: function(evt) {
		this.availableFeeds[evt.tab] = evt.feeds;
		app.events.send("feeds:found", {tab: evt.tab});
	},
	
	feedsInCurrentTab: function(callback) {
		var availableFeeds = this.availableFeeds;
		
		chain(UI.currentTab)
		.then(function(tab) {
			var feeds = availableFeeds[tab.id] || [];
			callback(feeds);
		});
	},
	
	countFeedsInCurrentTab: function(callback) {
		this.feedsInCurrentTab(function(feeds) {
			callback(feeds.length);
		});
	},
	
	countFeedsInTab: function(tabId, callback) {
		callback(this.availableFeeds[tabId].length);
	},
	
	forEachFeed: function(callback) {
		this.feedsInCurrentTab(function(feeds) {
			feeds.forEach(callback);
		});
	},
	
	tabClosed: function(tabId) {
		delete this.availableFeeds[tabId];
	}
});
