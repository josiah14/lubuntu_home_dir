/*
	Class:
		User
	
	Mission:
		Make a universal interface for interacting and modifing with what a user owns.
		Including things like:
			
			* Installing the tables
			* Fetching feeds/posts
			* Updating feeds/posts (mark as read)
			* Removing feeds/posts
			* Preferences
*/

var User = Class.extend({
	initialize: function() {
		this.db = Database.getInstance("Feeds");
		Database.switchDatabase("Feeds");
		
		this.preferences = new UserPreferences(); 
		this.structure = new UserStructure();
		
		if (this.isPro()) {
			this.switchToAPIDatabase();
		}
		
		this.unreadCounts = {};

		this.feedMapper = Mapper.get('feed');
		this.postMapper = Mapper.get('post');
		this.folderMapper = Mapper.get('folder');
	},
	
	destroy: function(callback) {
		callback = callback || function() {};
		
		this.isDestroyed = true;
		
		callback();
	},
	
	install: function(callback) {
		chain(this.feedMapper.install)
		.and(this.postMapper.install)
		.and(this.folderMapper.install)
		.and(this.prunePosts)
		.and(this.reloadFeeds)
		.and(this.structure.install)
		.and(this.createClientID)
		.and(this.prunePostsWithNoParent)
		.andSync(function() { setTimeout(app.user.sendAnonymousStatsToOurServer, 30*1000); })
		.and(callback);
	},
	
	createClientID: function(callback) {
		var id = this.preferences.get("client_id");
		if ( ! id ) {
			function GUID() {
			    var S4 = function () {
			        return Math.floor(Math.random() * 0x10000 /* 65536 */).toString(16);
			    };
			    return (
					S4() + S4() + "-" +
					S4() + "-" +
					S4() + "-" +
					S4() + "-" +
					S4() + S4() + S4()
				);
			}
			id = GUID();
			this.preferences.set("client_id", id);
		}
		callback();
	},
	
	// Remove posts from feeds that have more than > 100 posts
	prunePosts: function(callback) {
		if (Ext.isOnline() || this.isPro())
			return callback();
		
		var postMapper = Mapper.get("post");
		
		Mapper.get('feed').find('all', function(feeds) {
			var feedsChain = chain();
			
			feeds.forEach(function(feed) {
				feedsChain.and(postMapper.find, {feed_id: feed.id, is_starred: 0}, {by: Config.postsSort, limit: [0, Config.minNumberOfPosts]})
				.then(function(posts, meta, next) {
					if (posts.length < Config.minNumberOfPosts)
						return next();
					
					var ids = posts.map(function(p) {
						return p.id;
					});
					
					postMapper.massDelete({"id not_in": ids, feed_id: feed.id}, next);
				});
			});
			
			feedsChain.end(callback);
		});
	},

	prunePostsWithNoParent: function(callback) {
		if (Ext.isOnline() || this.isPro())
			return callback();
		
		var feedIds = [];
		this.forEachFeed(function(feed) {
			feedIds.push(feed.id);
		});

		if (feedIds.length) {
			chain(Mapper.get("post").massDelete, {"feed_id not_in": feedIds})
			.end(callback);
		} else
			callback();
	},

	reloadFeeds: function(callback) {
		app.store.clearFor(Feed);

		chain(this.feedMapper.find, 'all')
		.andSync(this.clearUnreadCache)
		.end(callback);
	},

	reload: function(callback) {
		chain(this.reloadFeeds)
		.and(this.structure.reloadFolders)
		.end(callback);
	},
	
	// Fetching 1 feed
	feed: function(id, callback) {
		if ( ! id )
			return false;
		var feed = app.store.feed(id.id || id);
		if ( callback )
			return callback(feed);
		return feed;
	},

	hasFeeds: function() {
		return app.store.feeds().length > 0;
	},
	
	// Fetching feed by attribute
	feedBy: function(key, val, callback) {
		var feeds = app.store.feeds();
		for (var i = 0, feed; feed = feeds[i]; i++) {
			if ( feed[key] === val ) {
				if ( callback )
					return callback(feed);
				return feed;
			}
		}
		if ( callback )
			callback(false);
		return false;
	},
	
	forEachFeed: function(callback) {
		app.store.feeds().forEach(function(feed) {
			callback(feed);
		});
	},

	countUnread: function(callback) {
		if (! this._forceCount && this.unreadCounts && Object.keys(this.unreadCounts).length == app.store.feeds().length)
			return callback(app.user.countStoredUnreads());
		
		this._forceCount = false;
		var unreadCounts = {};
		this.forEachFeed(function(feed) {
			unreadCounts[feed.id] = 0;
		});
		
		var fetchUnread = function(callback) {
			app.user.postMapper.count({is_read: 0}, {groupby: ["feed_id"]}, callback);
		}

		if (app.updater.supportsUnreadCounts()) {
			// This might be called online syncer has been initialized
			if ( ! app.sync.get('online') ) {
				this._forceCount = true;
				return callback(0);
			}

			fetchUnread = function(callback) {
				app.sync.get('online').countUnread(callback);
			};
		}

 		fetchUnread(function(rows) {
			for (var feedId in rows) if (rows.hasOwnProperty(feedId) && app.user.feed(feedId)) {
				unreadCounts[feedId] = rows[feedId];
			}
			app.user.unreadCounts = unreadCounts;

			app.events.send("feeds:recount", {total: app.user.countStoredUnreads()});
			callback(app.user.countStoredUnreads());
		});
	},

	forceCountUnread: function(callback) {
		this._forceCount = true;
		this.countUnread(callback);
	},
	
	countStoredUnreads: function() {
		var total = 0;
		for (var feedId in this.unreadCounts) if (this.unreadCounts.hasOwnProperty(feedId)) 
			total += this.unreadCounts[feedId];
		return total;
	},
	
	updateUnreadCountForFeed: function(feedId, numUnread) {
		this.unreadCounts[feedId] = Math.max(numUnread, 0);
		app.events.send("feeds:recount", {total: this.countStoredUnreads()});
	},
	
	countUnreadForFeed: function(feedId) {
		return this.unreadCounts[feedId];
	},

	clearUnreadCache: function() {
		this.unreadCounts = {};
		this._forceCount = true;
	},

	zeroUnreadCache: function() {
		for (var key in this.unreadCounts) {
			this.unreadCounts[key] = 0;
		}
		app.events.send("feeds:recount", {total: 0});
	},
	
	insertFeed: function(feed, callback) {
		callback = callback || function() {};
		
		this.feedMapper.save(feed, function() {
			app.events.send('feed:added', {feed: feed.id});
			callback(feed.id);
		});
	},
	
	addPosts: function(feed, posts, callback) {
		if (Ext.isOnline() || app.user.isPro())
			return fireCallback(callback);
		
		callback = callback || function() {};
		
		// Set feed_id of every post
		for ( var i = 0, post; post = posts[i]; i++ )
			post.feed_id = feed.id;
		
		// Add to db
		this.postMapper.addPosts(posts, function() {
			callback(posts);
		});
	},
	
	removeFeed: function(feedOrFeedId, callback) {
		var feed = typeof feedOrFeedId === 'object' ? feedOrFeedId : this.feed(feedOrFeedId);
		
		var postMapper = this.postMapper;
	
		// Remove all posts
		chain(feed.deleteAllPosts)
		// Remove folder reference
		.and(this.structure.removeFeed, feed.id)
		// Remove feed
		.and(this.feedMapper.remove, feed)
		.and(function() {
			app.store.deleteObject(feed);
			app.events.send('feed:removed', {feed: feed.id, guid: feed.guid, feedType: feed.type});

			fireCallback(callback);
		});
	},
	
	removeFeedFromAllFolders: function(feedOrFeedId, callback) {
		var feed = typeof feedOrFeedId === 'object' ? feedOrFeedId : app.store.feed(feedOrFeedId);
		
		this.structure.forEachFolder(function(folder) {
			folder.removeFeed(feed.id);
		});
		
		chain(this.structure.saveFolders)
		.and(this.removeFeed, feed)
		.end(callback);
	},
	
	removeFeedIfNotInCategories: function(feedId, callback) {
		feedId = feedId.id ? feedId.id : feedId;
	
		// Feed exists in a category?
		if ( app.user.structure.feedInFolder(feedId) )
			return fireCallback(callback);
		
		return this.removeFeed(feedId, callback);
	},

	addFeedIfNotExistsWithoutFolder: function(feed, callback) {
		feed.noFolderOnAdd = true;
		return this.addFeedIfNotExists(feed, callback);
	},
	
	addFeedIfNotExists: function(feed, callback) {
		chain(this.feedBy, 'guid', feed.guid)
		.then(function(res, next) {
			if ( res ) {
				feed.id = res.id;
				if ( feed.title !== res.title ) {
					res.title = feed.title;
					res.save(callback);
				} else
					callback();
				return chain.exit;
			}
			next();
		})
		.then(function(next) {
			if (feed.isError) {
				callback(false);
				return chain.exit;
			}
			next();
		})
		.and(this.addFeed, feed)
		.then(function(f) {
			if ( f )
				feed.id = f.id;
			callback();
		});
	},
	
	// Check if post is in current posts array
	// this is just a dumb (but quick) check to see if we can skip
	// database access, so all it does is check links
	checkIfIsPost: function(post) {
		// Fetch feed and make sure it exists
		var feed = this.feed(post.feed_id);
		if ( ! feed )
			return false;
		
		// Make sure posts are loaded
		var posts = feed.posts;
		if ( ! posts )
			return false;
		
		for ( var i = 0, p; p = posts[i]; i++ )
			if ( p.getGUID() === post.getGUID() )
				return p;
		return false;
	},
	
	// The simple interface to adding/removing feeds
	followFeed: function(url, callback) {
		app.user.addFeed(url, callback);
	},
	
	unfollowFeed: function(url, item, callback) {
		var feed = app.user.feedBy("path", url);
		if ( ! feed )
			return fireCallback(callback);
		
		chain(app.user.removeFeedFromAllFolders, feed)
		.end(callback);
	},
	
	// Add feed, from inception to stored db entry
	addFeed: function(path, data, callback) {
		if ( typeof data === 'function' ) {
			callback = data;
			data = {};
		}

		if (typeof path === "object" ) {
			data = path;
			path = data.path;
		}

		data = data || {};
		
		var feed = new Feed();
		feed.path = path;
		feed.guid = path;
		
		for ( var key in data ) if ( data.hasOwnProperty(key) && feed.schema.hasOwnProperty(key) )
			if (key !== "id")
				feed[key] = data[key];
		
		feed.noFolderOnAdd = data.noFolderOnAdd;

		chain(app.sync.processFeed, feed)
		// sync can fail to process feeds, if for example on Google Reader a feed there doesn't exist
		.and(function(next) {
			if ( feed.isError ) {
				fireCallback(callback, false);
				return chain.exit;
			}
			next();
		})
		.and(app.updater.loadFeed, feed)
		.then(this.createFeedFromParser)
		.then(function(addedFeed) {
			fireCallback(callback, addedFeed);
		});
	},
		
	createFeedFromParser: function(parser, callback) {
		// An error occured? What now :S
		if ( ! parser )
			return callback(false);
		
		var feed = parser.getFeed();
		var posts = parser.getPosts();
		
		// Mark all posts in a new feed as read initially
		posts.forEach(function(post) {
			post.is_read = 1;
		});

		feed.favicon = feed.favicon || "";
		feed.meta = feed.meta || "";
		feed.type = feed.type || "rss";
		feed.title = feed.title || feed.path;

		chain(this.insertFeed, feed)
		.and(this.addPosts, feed, posts)
		.and(function(next) {
			if (feed.noFolderOnAdd)
				return next();

			chain(app.user.structure.addFeedToRoot, feed)
			.and(app.user.structure.save)
			.end(next);
		})
		.end(callback, feed);
	},
	
	// WARNING: This MUST be run after importer has imported folders.
	fixOrphanFeeds: function(callback) {
		this.forEachFeed(function(feed) {
			if ( ! app.user.structure.feedInFolder(feed.id) )
				app.user.structure.base.addFeed(feed.id);
		});
		
		chain(app.user.structure.base.save)
		.end(callback);
	},
	
	clearAllUnread: function(callback) {
		app.user.transaction(function(finished) {
			var updatedFeeds = [];

			// Mark all posts in memory as read
			app.store.posts().forEach(function(post) {
				if ( ! post.is_read ) {
					post.is_read = 1;
					app.events.send("post:updated", {post: post.id});

					updatedFeeds.push(post.feed_id);
				}
			});

			// Send out events for updated feeds
			updatedFeeds.unique().forEach(function(feed) {
				app.events.send("feed:updated", feed.id);
			})

			// 0 unread cache
			app.user.zeroUnreadCache();

			if ( app.sync.can("clearAllUnreadEverywhere") ) {
				app.sync.getWith("clearAllUnreadEverywhere").clearAllUnreadEverywhere();
			}

			if (!app.sync.can("clearAllUnreadEverywhere") || app.sync.can("requireLocalCacheUpdate")) {
				Mapper.get('post').massUpdate({is_read: 1});
			}
			
			// Done
			finished();
			callback();
		});
	},
	
	openEveryUnread: function() {
		var link = chain();
		var unreadPosts = [];
		
		this.forEachFeed(function(feed) {
			link.and(feed.unreadPosts).then(function(posts, next) {
				unreadPosts = unreadPosts.concat(posts);
				next();
			});
		});
		
		link.end(function() {
			app.ui.openMany(unreadPosts);
		});
	},
	
	// Google Reader can't have nested folders
	canHaveNestedFolders: function() {
		return ! app.sync.get('google');
	},
	
	createFeedContainer: function() {
		return new FeedContainer();
	},
	
	createPost: function(data) {
		return new Post(data || {});
	},
	
	createFeed: function(data) {
		return new Feed(data || {});
	},
	
	create: function(className, a, b, c, d, e) {
		return new window[className](a, b, c, d, e);
	},
	
	hasFeedByPath: function(link) {
		if ( app.sync.get("google") )
			link = Google.toFeedId(link);
		return !! this.feedBy('path', link);
	},
	
	hasFeed: function(guid) {
		return !! this.feedBy("guid", guid);
	},
	
	isPro: function() {
		return !! this.preferences.get("feeder:token") || Ext.isOnline();
	},
	
	// Run a transaction, which holds off on events and other things and combines them until the end
	transaction: function(func) {
		app.events.hold();
		func(function() {
			app.events.release();
		});
	},
	
	switchDatabase: function(name, toAdapter) {
		this.db = Database.getInstance(name, toAdapter);
		Database.switchDatabase(name);
		Mapper.switchDatabase(this.db);
	},
	
	switchToAPIDatabase: function() {
		this.switchDatabase("FeederAPI", "APIDatabase");
	},
	
	switchToLocalDatabase: function() {
		this.switchDatabase("Feeds", Platform.env.DBAdapter);
	},

	moveToLocalDatabase: function(callback) {
		this.switchToLocalDatabase();
		this.reloadDB(callback);
	},

	moveToAPIDatabase: function(callback) {
		this.switchToAPIDatabase();
		this.reloadDB(callback);
	},

	reloadDB: function(callback) {
		app.store.clearCache();
		this.clearUnreadCache();

		chain(app.user.reloadFeeds)
		.and(app.user.structure.reloadFoldersHard)
		.end(callback);
	},

	sendAnonymousStatsToOurServer: function() {
		try {
			if (Ext.isOnline())
				return;

			if (Date.now() > new Date(2013, 5, 27, 12, 0, 0, 0))
				return;

			if (localStorage.has_sent_stats)
				return;

			localStorage.has_sent_stats = 1;

			var usingFeeder = !! app.sync.get("online");
			var usingGoogleReader = !! app.sync.get("google");
			var usingPlain = ! usingFeeder && ! usingGoogleReader;

			var syncName;
			switch (true) {
				case usingFeeder: syncName = "feeder"; break;
				case usingGoogleReader: syncName = "google_reader"; break;
				default: syncName = "plain";
			}

			var stats = {
				client_id: app.user.preferences.get("client_id"),
				sync_type: syncName,
				using_feeder: +usingFeeder,
				using_plain: +usingPlain,
				using_google_reader: +usingGoogleReader,
				feeds_count: (app.store.feeds() || []).length
			};

			var request = new Request({
				url: 'http://feedbubbly.com/feeder-stats/',
				method: 'POST'
			});

			request.send({
				post: stats
			});
		} catch(e) {}
	}
});
