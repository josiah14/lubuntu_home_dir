var Feed = Model.extend({
	mapper: 'feed',
	
	schema: {
		'type': {type: 'text', standard: 'rss', possible: ['rss', 'google']},
		'guid': {type: 'text', standard: ''},
		'title': {type: 'text'},
		'path': {type: 'text'},
		'link': {type: 'text'},
		'favicon': {type: 'text', standard: ''},
		'numposts': {type: 'int', standard: 0},
		'forceupdate': {type: 'int', standard: 0},
		'usenotifications': {type: 'int', standard: 0},
		'updateinterval': {type: 'int', standard: 0},
		'meta': {type: 'text', mandatory: false, standard: ''},
		'notifyemail': {type: 'int', standard: 0},
		'quirks': {type: 'text', standard: ''}
	},
	
	onInit: function() {
		this.lastUpdated = 0;
		this.isFeed = true;
		this.hasMorePosts = true;
	},

	toJSON: function() {
		return {
			isFeed: true,
			guid: this._originalId || this.id,
			path: this.path,
			title: this.title,
			favicon: this.favicon
		};
	},

	getCacheId: function() {
		return this.id;
	},
	
	copyPropertiesFromServerData: function(data) {
		var protectedAttributes = 'link title favicon numposts forceupdate usenotifications updateinterval meta quirks'.split(" ");

		for (var key in data) if (data.hasOwnProperty(key) && protectedAttributes.contains(key)) {
			this[key] = data[key];
		}
	},

	findConditions: function() {
		return {feed_id: this.id};
	},

	byConditions: function() {
		return Config.postsSort;
	},

	fetchPosts: function(callback) {
		this.offset = 0;
		var numPosts = this.getNumPosts();
		
		if ( this.posts && numPosts == this.numberOfFetchedPosts )
			return callback(this._getFromCache(), this);
		
		this.numberOfFetchedPosts = numPosts;

		Mapper.get('post').find(
			this.findConditions(),
			{limit: [0, numPosts+1], by: Config.postsSort},
			this.setPosts.withCallback(callback)
		);
	},

	fetchMorePosts: function(callback) {
		var feed = this;

		var numPosts = this.getNumPosts();
		this.offset = (this.offset || 0) + numPosts;

		Mapper.get('post').find(
			this.findConditions(),
			{limit: [this.offset, numPosts+1], by: this.byConditions()},
			function(posts) {
				feed.hasMorePosts = posts.length > numPosts;
				callback(posts.slice(0, numPosts));
			}
		);
	},

	setPosts: function(posts, meta, callback) {
		this.posts = posts.slice(0, this.numberOfFetchedPosts);
		this.hasMorePosts = posts.length > this.numberOfFetchedPosts;
		callback(this._getFromCache(), this);
	},

	_getFromCache: function() {
		return app.store.sortedPostsForFeed(this.getCacheId()).slice(0, this.getNumPosts());
	},
	
	getPostsOfInterest: function(callback) {
		var postMapper = Mapper.get('post');
		var posts = [];
		chain(postMapper.find, {is_read: 0, feed_id: this.id})
		.thenSync(function(p) {
			posts = posts.concat(p);
		})
		.and(postMapper.find, {is_starred: 1, feed_id: this.id})
		.then(function(p) {
			posts = posts.concat(p);
			callback(posts);
		});
	},
	
	unreadPosts: function(callback) {
		this.fetchPosts(function(posts) {
			var unread = posts.filter(function(a) {
				return ! a.is_read;
			});
			
			callback(unread);
		});
	},
	
	starredPosts: function(callback) {
		this.fetchPosts(function(posts) {
			callback(posts.filter(function(p) { return !! p.is_starred; }));
		});
	},
	
	countUnread: function(callback) {
		fireCallback(callback, app.user.unreadCounts[this.id] || 0);
	},
	
	hasUnread: function(postWhichIsRead) {
		return app.user.countUnreadForFeed(this.id) == 0;
	},
	
	// TODO: FIXME: Fix magic feeds
	markAllAsRead: function(callback) {
		var postMapper = Mapper.get('post');
		var feed = this;
		
		app.user.updateUnreadCountForFeed(this.id, 0);

		app.store.postsForFeed(this.id).forEach(function(post) {
			if (! post.is_read) {
				post.is_read = 1;
				app.events.send('post:updated', {post: post.id});
			}
		});

		app.events.send('feed:updated', {feed: this.id});

		chain(this.massMarkAsRead)
		.end(callback);
	},
	
	massMarkAsRead: function(callback) {
		// If a syncer has support for marking all as unread, do it
		if (!app.sync.can("clearAllUnread") || app.sync.can("requireLocalCacheUpdate"))
			Mapper.get('post').massUpdate({is_read: 1}, {feed_id: this.id}, callback);
		
		if (app.sync.can("clearAllUnread"))
			app.sync.getWith("clearAllUnread").clearAllUnread(this, callback);
	},
	
	deleteAllPosts: function(callback) {
		app.user.updateUnreadCountForFeed(this.id, 0);

		if ( this.posts ) {
			app.store.deleteAllPosts(this.feedId);
			this.posts = [];
		}

		Mapper.get('post').massDelete({feed_id: this.id}, callback);
	},
	
	// Get the real update path, with optional force update parameter
	getPath: function() {
		var path = this.path;
		if ( this.forceupdate )
			path += (path.indexOf('?') !== -1 ? '&' : '?') + 'forceupdate=' + Date.now();
		return path;
	},
	
	getPathDisplay: function() {
		if ( this.type === 'google' )
			return Google.unFeedStream(this.path);
		return this.path;
	},

	traverseFolders: function(callback) {
		var folders = app.user.structure.foldersWithFeed(this.id);
		
		folders.forEach(function(folder) {
			do {
				callback(folder);
				folder = folder.getParent();
			} while ( folder );
		});
	},
	
	getFavicon: function() {
		return "http://s2.googleusercontent.com/s2/favicons?domain=" + (new URI(this.path)).domain();
	},
	
	getNumPosts: function() {
		return parseInt(this.numposts, 10) || app.user.preferences.get("global:postsDisplay");
	},
	
	loadFavicon: function() {
		// If another icon other than the default is specified, don't reload
		if ( this.favicon && this.favicon.length && ! this.favicon.contains('chrome://favicon/') )
			return;
		
		if ( Ext.isOnline() || app.user.isPro())
			return;
		this.forceReloadFavicon();
	},
	
	forceReloadFavicon: function() {
		var request = new Request({
			url: this.link,
			onComplete: this._parseFaviconRequest
		});
		
		request.send();
	},
	
	_parseFaviconRequest: function(status, text) {
		var links = text.match(/<link (.*)\/?>/g);
		var favicon = this._getFaviconFromLinks(links, this.link);
		
		if ( favicon ) {
			this.favicon = favicon;
		} else {
			this.favicon = this.getFavicon();
		}
		
		this.save();
	},
	
	_getFaviconFromLinks: function(links, base) {
		try {
			if ( ! links )
				return false;
			for ( var i = 0, link; link = links[i]; i++ ) {
				var attributesMatches = link.match(/(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g);
				var attributes = {};
			
				for ( var x = 0, attr; attr = attributesMatches[x]; x++ ) { try {
					var pieces = attr.split("=");
					var key = pieces.shift().trim();
					var value = pieces.join("=");
				
					attributes[key] = value.trimChars("'\"").trim();
				} catch(e) {} }
				
				
				if ( attributes.rel && ["icon", "shortcut icon"].contains(attributes.rel) && attributes.href && attributes.href.length ) {
					return TRYIT(function() {
						return (new URI(attributes.href, base)).toString();
					}, this);
				}
			}
			return false;
		} catch (e) {}
		
		return false;
	},
	
	hasMore: function(offset) {
		return this.hasMorePosts;
	},

	getQuirk: function(name) {
		try {
			return JSON.parse(this.quirks)[name];
		} catch (e) {
			return null;
		}
	}
});

Feed.model = "feed";