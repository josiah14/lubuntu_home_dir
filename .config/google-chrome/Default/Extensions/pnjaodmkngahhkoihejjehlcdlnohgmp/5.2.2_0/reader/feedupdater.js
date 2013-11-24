var FeedUpdater = Class.extend({
	initialize: function() {
		// A list of currently updating feeds
		this.updating = [];
		
		// A list of feeds that need update, but the queue is too crowded for
		this.waiting = [];
	},
	
	startListening: function() {
		// Subscribe to know when an app is eligible for update
		app.events.subscribe('feed:needsUpdate', this.eventUpdateFeed);
		
		// Subscribe to know when the poller is checking updates. This is when we go through the queue
		// Some platforms might even support unread counts checking
		app.events.subscribe('poller:check', this.eventPollerCheck);
	},
	
	destroy: function(callback) {
		this.isDestroyed = true;
		app.events.unsubscribe('feed:needsUpdate', this.eventUpdateFeed);
		clearInterval(this.updaterInterval);
		
		// Abort ongoing requests
		for ( var i = 0, feed; feed = this.updating[i]; i++ )
			feed.loader.abort();
		
		fireCallback(callback);
	},
	
	eventPollerCheck: function() {
		for ( var i = 0, feed; (feed = this.waiting[i]) && i < Config.maxConcurrentUpdates; i++ )
			this.updateFeed(app.user.feed(feed));
		
		if ( this.supportsUnreadCounts() )
			this.checkUnreadCounts();
	},
	
	eventUpdateFeed: function(evt) {
		this.updateFeed(app.user.feed(evt.feed), evt.force);
	},
	
	// Update feed, if it can't, ie max concurrent updates is reached, skip it, and wait till next time
	updateFeed: function(feed, force) {
		// We don't update feeds on the online platform, since it's only doing an API call
		if (Ext.isOnline() || app.user.isPro())
			return;
		
		// Feed might not even exist!
		if ( ! feed )
			return;
		
		// If is in update list, something is probably wrong, but don't update it twice
		if ( this.updating.contains(feed.id) )
			return;
		
		// Only update <Config.maxConcurrentUpdates> feeds at a time
		if ( this.updating.length >= Config.maxConcurrentUpdates && ! force ) {
			if ( ! this.waiting.contains(feed.id) )
				this.waiting.push(feed.id);
			return;
		}
		
		this.runUpdate(feed);
	},
	
	runUpdate: function(feed, callback) {
		this.waiting.remove(feed.id);
		this.updating.push(feed.id);
		
		chain(this.loadFeed, feed)
		.then(this.storeResults)
		.and(function() {
			fireCallback(callback);
		});
	},
	
	loadFeed: function(feed, callbackWhenDone) {
		feed.isUpdating = true;
		
		var loader = FeedLoader.forFeed(feed);
		var parser = FeedParser.forFeed(feed);
		var updating = this.updating;
		
		feed.loader = loader;
		
		chain(loader.load)
		.then(parser.setResult)
		.then(parser.parse)
		.then(function(parser, callback) {				
			feed.isUpdating = false;
		
			// Remove feed as updating since it isn't
			updating.remove(feed.id);
			
			// Could have been aborted? Don't do anything
			if ( loader.isAborted ) {
				callbackWhenDone(false);
				return chain.exit;
			}
			
			// If an error occured send out an error event, and exit the chain
			if ( parser.error ) {
				app.events.send('error', {code: 'PARSER_ERROR'});
				app.events.send('updater:failed', {feed: parser.feed.id});
				feed.lastUpdated = Date.now();
				callbackWhenDone(false);
				return chain.exit;
			}
			
			callbackWhenDone(parser);
		});
	},
	
	storeResults: function(parser, callback) {
		if ( ! parser )
			return;
		
		var feed = parser.feed;
		feed.loadFavicon();
		
		// Keep track of when last "offical" update was stored
		feed.lastUpdated = Date.now();
		
		// If removed while updating, don't do didly
		if ( feed.deleted )
			return;
		
		var posts = parser.getPosts();
		
		if ( Ext.isOnline() || app.user.isPro())
			return fireCallback(callback);
		
		// Store feed and posts
		chain(app.user.addPosts, feed, posts)
		.andSync(app.user.clearUnreadCache)
		.and(app.user.countUnread, function() {
			fireCallback(callback);
		});
	},
	
	supportsUnreadCounts: function() {
		return Ext.isOnline() || app.user.isPro();
	},
	
	checkUnreadCounts: function() {
		app.sync.loadUnreadCounts(this.checkUnreadCountsForNew);
	},
	
	checkUnreadCountsForNew: function(counts) {
		for (var feedId in counts) if (counts.hasOwnProperty(feedId)) {
			this.checkUnreadCountAndLastUpdatedForFeed(app.user.feed(feedId), counts[feedId].last_updated, counts[feedId].unread);
		}
	},
	
	checkUnreadCountAndLastUpdatedForFeed: function(feed, lastUpdated, unread) {
		// If feed was removed
		if ( ! feed )
			return false;

		var storedUnreadCountForFeed = app.user.countUnreadForFeed(feed.id);
		app.user.updateUnreadCountForFeed(feed.id, unread);
		
		// If storedUnreadCountForFeed is undefined then it's the first time around
		// so we send a feed:updated event, which otherwise would be taken care of by the updated below
		if (typeof storedUnreadCountForFeed === "undefined") {
			app.events.send("feed:updated", {feed: feed.id});
		}

		// If no previous api check has been done, or no unread counts have been stored, just wait
		if (typeof feed.apiLastUpdated === "undefined" || typeof storedUnreadCountForFeed === "undefined" ) {
			feed.apiLastUpdated = lastUpdated;
			feed.previousUnreadCount = storedUnreadCountForFeed;
			return;
		}

		// Has the feed updated since we last checked, or just that unread count has changed?
		if (feed.apiLastUpdated != lastUpdated || storedUnreadCountForFeed != unread) {
			console.log("NEEDS UPDATE: %s # %s != %s || %s != %s", feed.title, feed.apiLastUpdated, lastUpdated, storedUnreadCountForFeed, unread);
			
			feed.needsUpdate = true;
			feed.previousUnreadCount = storedUnreadCountForFeed;

			// Store previos api check time so we have a range to go by
			feed.previousApiLastUpdated = feed.apiLastUpdated;
			feed.apiLastUpdated = lastUpdated;
			
			app.events.send("feed:backendUpdated", {feed: feed.id});

			return true;
		}

		return false;
	}
});
