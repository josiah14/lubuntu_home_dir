var OnlineSyncer = Syncer.extend({
	startListening: function() {
		this._super();
		app.events.subscribe('feed:backendUpdated', this.eventUpdateFeed);
	},
	
	destroy: function() {
		this._super();	
		app.events.unsubscribe('feed:backendUpdated', this.eventUpdateFeed);
	},
	
	eventUpdateFeed: function(evt) {
		var feed = app.user.feed(evt.feed);
		if ( ! feed )
			return feed;
		
		var previousApiLastUpdated = new Date(feed.previousApiLastUpdated);
		
		function isNewPost(post) {
			return post.created_at > previousApiLastUpdated;
		}
		
		feed.posts = false;
		feed.fetchPosts(function(posts) {
			var updated = feed.previousUnreadCount != app.user.countUnreadForFeed(feed.id);
			
			posts.forEach(function(post) {
				if (!isNewPost(post))
					return;
				updated = true;
				app.events.send("post:added", {post: post.id});
			});
			
			if (updated)
				app.events.send("feed:updated", {feed: feed.id});
		});
	},
	
	processFeed: function(feed, callback) {
		if (feed.type === "online")
			return fireCallback(callback, feed);
		
		// Reroute request to API
		var request = new Request({
			url: OnlineSyncer.path('/api/add-feed.json'),
			onComplete: this.addFeedComplete.andArguments(feed, callback),
			addFeederAuthorization: true
		});
		
		request.send({get: {path: feed.path}});
	},
	
	addFeedComplete: function(status, text, xml, feed, callback) {
		// Check if successful
		var response = tryToParseJSON(text);
		
		// Tell feed to not go any further in sync tree
		if ( ! response || ! response.success ) {
			feed.isError = true;
		} else {
			feed.guid = response.guid;
			feed.type = "online";
			feed.favicon = response.favicon;
		}
		
		// Done!
		fireCallback(callback);
	},
	
	preferencesChanged: function(callback) {
		var request = new Request({
			url: OnlineSyncer.path('/api/settings.json'),
			method: 'POST',
			addFeederAuthorization: true
		});
		request.send({post: {settings: this.settingsToJSON()}});
		
		fireCallback(callback);
	},
	
	settingsToJSON: function() {
		return JSON.stringify(app.user.preferences.getAll());
	},
	
	fetchUpstream: function(callback) {
		var request = new Request({
			url: OnlineSyncer.path('/api/settings.json'),
			onComplete: this.restorePreferencesFromAPI.withCallback(callback),
			addFeederAuthorization: true
		});
		
		request.send();
	},
	
	restorePreferencesFromAPI: function(status, text, xml, callback) {
		var settings = tryToParseJSON(text);

		if ( !settings ) {
			this.failedInit();
			return fireCallback(callback);
		}

		this.succeededInit();
		
		for (var key in settings) if (settings.hasOwnProperty(key))
			app.user.preferences.setQuiet(key, settings[key]);
		
		fireCallback(callback);
	},

	// Basic wrapper around API call
	countUnread: function(callback) {
		var request = new Request({
			url: OnlineSyncer.path('/api/unread.json'),
			onComplete: function(status, res) {
				var unreads = tryToParseJSON(res);
				for (var key in unreads) if (unreads.hasOwnProperty(key))
					unreads[key] = unreads[key].unread;
				callback(unreads);
			},
			addFeederAuthorization: true
		});
		
		request.send();
	},
	
	loadUnreadCounts: function(callback) {
		var request = new Request({
			url: OnlineSyncer.path('/api/unread.json'),
			onComplete: this.loadUnreadCountsLoaded.withCallback(callback),
			addFeederAuthorization: true
		});
		
		request.send();
	},
	
	loadUnreadCountsLoaded: function(status, text, xml, callback) {
		var counts = tryToParseJSON(text);

		chain(this.loadNewFeedsNotInCounts, counts)
		.end(callback, counts);
	},

	loadNewFeedsNotInCounts: function(counts, callback) {
		var needsUpdate = Object.keys(counts).length != app.store.feeds().length;

		for (var key in counts) if (counts.hasOwnProperty(key)) {
			if (!app.user.feed(key))
				needsUpdate = true;
		}

		if (needsUpdate)
			app.user.reload(callback);
		else
			fireCallback(callback);
	},

	clearAllUnread: function(feed, callback) {
		var request = new Request({
			method: 'POST',
			url: OnlineSyncer.path("/api/mark-as-read.json"),
			onComplete: function() {
				fireCallback(callback);
			},
			addFeederAuthorization: true
		});

		request.send({post: {feed_id: feed.id}});
	},

	clearAllUnreadEverywhere: function(feedId, callback) {
		var request = new Request({
			method: 'POST',
			url: OnlineSyncer.path("/api/mark-as-read.json"),
			onComplete: function() {
				fireCallback(callback);
			},
			addFeederAuthorization: true
		});

		request.send({post: {}});
	},
	
	feedAdded: function(evt, callback) { fireCallback(callback); },
	feedUpdated: function(evt, callback) { fireCallback(callback); },
	feedRemoved: function(evt, callback) { fireCallback(callback); },
	postUpdated: function(evt, callback) { fireCallback(callback); },
	folderUpdated: function(evt, callback) { fireCallback(callback); },
	folderAdded: function(evt, callback) { fireCallback(callback); },
	folderRemoved: function(evt, callback) { fireCallback(callback); },
	
	pushUp: function(order, callback) { fireCallback(callback); },
	uninstall: function(callback) { callback(); }
});

OnlineSyncer.path = function(path) {
	return Config.feeder.root + path;
};