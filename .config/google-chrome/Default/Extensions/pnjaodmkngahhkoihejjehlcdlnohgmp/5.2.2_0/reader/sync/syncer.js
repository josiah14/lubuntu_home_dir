/*
	Class:
		Syncer
	
	Base class for syncing to services
*/

var Syncer = Class.extend({
	startListening: function() {
		app.events.subscribe('feed:added', this.feedAdded);
		app.events.subscribe('feed:updated', this.feedUpdated);
		app.events.subscribe('feed:removed', this.feedRemoved);
		app.events.subscribe('post:updated', this.postUpdated);
		app.events.subscribe('folder:updated', this.folderUpdated);
		app.events.subscribe('folder:added', this.folderAdded);
		app.events.subscribe('folder:removed', this.folderRemoved);
		app.events.subscribe('preferences:changed', this.preferencesChanged);
	},
	
	destroy: function(callback) {
		callback = callback || function() {};
		
		app.events.unsubscribe('feed:added', this.feedAdded);
		app.events.unsubscribe('feed:updated', this.feedUpdated);
		app.events.unsubscribe('feed:removed', this.feedRemoved);
		app.events.unsubscribe('post:updated', this.postUpdated);
		app.events.unsubscribe('folder:updated', this.folderUpdated);
		app.events.unsubscribe('folder:added', this.folderAdded);
		app.events.unsubscribe('folder:removed', this.folderRemoved);
		app.events.unsubscribe('preferences:changed', this.preferencesChanged);
		
		callback();
	},
	
	run: function(command, args) {
		this[command].apply(this, args);
	},

	failedInit: function() {
		this.FAILURE = true;
	},

	succeededInit: function() {
		this.FAILURE = false;
	},
	
	processFeed: function(feed, callback) { throw "implement Syncer.processFeed"; },
	
	feedAdded: function(evt, callback) { throw "implement Syncer.feedAdded"; },
	feedUpdated: function(evt, callback) { throw "implement Syncer.feedUpdated"; },
	feedRemoved: function(evt, callback) { throw "implement Syncer.feedRemoved"; },
	postUpdated: function(evt, callback) { throw "implement Syncer.postUpdated"; },
	folderUpdated: function(evt, callback) { throw "implement Syncer.folderUpdated"; },
	folderAdded: function(evt, callback) { throw "implement Syncer.folderAdded"; },
	folderRemoved: function(evt, callback) { throw "implement Syncer.folderRemoved"; },
	preferencesChanged: function(evt, callback) {},
	
	fetchUpstream: function(callback) { throw "implement Syncer.fetchUpstream"; },
	pushUp: function(order, callback) { throw "implement Syncer.pushUp"; },
	reloadDownstream: function() { throw "implement Syncer.reloadDownstream"; }

	// optionally implemented by those who support it
	//clearAllUnread: function() {},
	//clearAllUnreadEverywhere: function() {}
});
