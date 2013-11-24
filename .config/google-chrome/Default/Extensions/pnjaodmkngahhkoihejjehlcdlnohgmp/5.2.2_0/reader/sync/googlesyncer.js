var GoogleSyncer = Syncer.extend({
	startListening: function() {
		this._super.apply(this, arguments);
		
		if ( ! GoogleOAuth2.refresh_token && app.user.preferences.get("sync:google") )
			GoogleOAuth2.refresh_token = app.user.preferences.get("sync:google");
	},
	
	install: function(callback) {
		app.events.send("syncsetup:status", {text: "Fetching from Google Reader..."});
		
		app.user.preferences.set("sync:google", GoogleOAuth2.refresh_token);
		this.fetchUpstream(callback);
	},
	
	uninstall: function(callback) {
		app.user.preferences.remove("sync:google");

		app.events.send("unsync:status", {text: "Removing Google Reader sync"});
		
		this.feedsWithProblems = [];
		
		var link = chain();
		var googleSync = this;
		
		// Change all feeds from google, to their rss equivalents
		app.user.forEachFeed(function(feed) {
			if ( feed.type === 'google' )
				link.and(googleSync.unprocessFeed, feed);
		});
		
		link.and(this.removeFeedsWithProblems);
		link.and(app.user.reloadFeeds);
		
		link.end(function() {
			GoogleOAuth2.refresh_token = false;
			GoogleOAuth2.access_token = false;
			
			app.events.send("unsync:status", {text: "Done"});
			callback(googleSync.feedsWithProblems);
		});
	},
	
	unprocessFeed: function(feed, callback) {
		app.events.send("unsync:status", {text: "Unprocessing " + feed.title + "..."});
		
		feed.type = 'rss';
		
		// Change GUID and path
		feed.guid = feed.path = Google.unFeedStream(feed.guid);
		
		var feedsWithProblems = this.feedsWithProblems;
		var unprocessPosts = this.unprocessPosts;
		
		// Make sure it exists and works
		chain(feed.save)
		.and(FeedLoader.load, feed)
		.then(function(parser, next) {
			if ( parser.error ) {
				feedsWithProblems.push(feed);
				return next();
			}
			unprocessPosts(feed, parser, next);
		})
		.end(callback);
	},
	
	unprocessPosts: function(feed, parser, callback) {
		app.events.send("unsync:status", {text: "Unprocessing posts for " + feed.title + "..."});
		
		// Make sure the parser marks them all as read
		parser.allAreRead = true;
		
		chain(feed.deleteAllPosts)
		.and(app.updater.storeResults, parser)
		.end(callback);
	},
	
	removeFeedsWithProblems: function(callback) {
		app.events.send("unsync:status", {text: "Removing feeds with problems..."});
		
		var link = chain();
		for ( var i = 0, feed; feed = this.feedsWithProblems[i]; i++ )
			link.and(app.user.removeFeed, feed);
		link.end(callback);
	},
	
	processFeed: function(feed, callback) {
		if ( feed.type === 'google' )
			return fireCallback(callback);
		
		chain(Google.addFeed, feed)
		.then(function(data, next) {
			if ( ! data ) {
				feed.isError = true;
				return next();
			}
			
			feed.type = 'google';
			feed.guid = data.streamId;
			
			next();
		})
		.end(callback);
	},
	
	feedAdded: function(evt, callback) {
		fireCallback(callback);
	},
	
	feedUpdated: function(evt, callback) {
		var feed = app.user.feed(evt.feed);
		
		if ( evt.reason === 'name' )
			Google.updateFeed(feed, callback);
		else if ( evt.reason === 'category' ) {
			var toFolder = app.user.structure.folder(evt.to);
			var fromFolder = app.user.structure.folder(evt.from);
			
			var link = chain();
			
			// Don't add/remove category if it is standard
			if ( ! fromFolder.standard )
				link.and(Google.removeTag, feed.guid, fromFolder.googleId());
			
			link.and(Google.addTag, feed.guid, toFolder.googleId());
			link.and(Google.checkFolderSyncStatus, toFolder.name);
			
			link.end(callback || function() {});
		} else
			fireCallback(callback);
	},
	
	feedRemoved: function(evt, callback) {
		if ( evt.feedType === "google" )
			Google.removeFeed(evt.guid);
		fireCallback(callback);
	},
	
	folderUpdated: function(evt, callback) {
		var folder = app.user.structure.folder(evt.folder);
		
		if ( evt.reason === 'order' ) {
			var sortstring = folder.toGoogleString()
			
			Google.updateOrder(sortstring, folder.googleId(), callback);
		} else if ( evt.reason === 'name' ) {
			var parent = folder.getParent();
			Google.renameFolder(evt.prev, folder.name, function() {
				var sortstring = parent.toGoogleString()
				Google.updateOrder(sortstring, parent.googleId(), callback);
			});
		} else
			fireCallback(callback);
	},
	
	folderAdded: function(evt, callback) {
		Google.unsyncedFolders.push(app.user.structure.folder(evt.folder).name);
		fireCallback(callback);
	},
	
	folderRemoved: function(evt, callback) {
		Google.removeFolder(Google.toLabelName(evt.folderName), callback);
	},
	
	postUpdated: function(evt, callback) {
		chain(Google.updatePost, app.store.post(evt.post))
		.end(callback);
	},
	
	reloadDownstream: function(callback) {
		this.reloadSubscriptions(callback);
	},
	
	fetchUpstream: function(callback) {
		this.feedMap = {};
		this.reverseFeedMap = {};
		this.folderMap = {};
		this.reverseFolderMap = {};
		
		// We probably don't have to do this on every application load
		// we should set some form of counter, perhaps fetch upstream every day,
		// or if initialized by the user?
		chain(GoogleOAuth2.refreshToken)
		.thenSync(function() {
			if (GoogleOAuth2.tokenError) {
				this.failedInit();
				fireCallback(callback);
				return chain.exit;
			}
			this.succeededInit();
		}.bind(this))
		.and(Google.fetchSelf)
		.and(this.reloadSubscriptions)
		.and(this.mergeFeeds)
		.end(callback);
	},
	
	mergeFeeds: function(callback) {
		// Decide which feeds in localDB to add, remove and change

		if ( !this.subscriptions)
			return fireCallback(callback);
		
		var feeds = this.subscriptions.feeds.map(this.googleSubscriptionToFeed);
		
		var link = chain();
		for ( var i = 0, feed; feed = feeds[i]; i++ ) {
			link.and(this.mergeFeed, feed);
			// This should only be run on first load of feed to fetch the posts
			//link.and(app.updater.runUpdate, feed);
		}
		
		link.and(this.populateFolders, this.subscriptions);
		link.and(this.mergeOrder, this.subscriptions);
		link.end(callback);
	},
	
	mergeFeed: function(feed, callback) {
		var map = this.feedMap, reverseMap = this.reverseFeedMap;
		
		// Check if feed exists
		//  - Add if not
		//  - Do nothing otherwise
		
		app.user.addFeedIfNotExists(feed, function() {
			map[feed.guid] = feed.id;
			reverseMap[feed.id] = feed.guid;
			callback();
		});
	},
	
	mergeOrder: function(subscriptions, callback) {
		var link = chain();
		
		// Purge removed feeds
		link.and(this.purgeFeeds);
		
		// Add root folder
		link.and(this.mergeOrderToFolder, subscriptions.order.root, app.user.structure.base.id);

		// Add sub-folders
		for ( var i = 0, category; category = subscriptions.order.categories[i]; i++ )
			link.and(this.mergeOrderToFolder, category.order, this.folderMap[category.id]);
		
		// Purge folders with removed stuff
		link.and(this.purgeFolders);
		
		// Save order to database
		link.and(app.user.structure.save);

		link.end(callback);
	},
	
	mergeOrderToFolder: function(objects, folderId, callback) {
		var folderMap = this.folderMap;
		var feedMap = this.feedMap;
		
		var link = chain();
		
		objects.forEach(function(obj) {
			if ( obj.isFeed ) {
				if (feedMap[obj.id])
					link.and(app.user.structure.addFeedToFolder, feedMap[obj.id], folderId);
			} else {
				if (folderMap[obj.id] )
					link.and(app.user.structure.addFolderToFolder, folderMap[obj.id], folderId);
			}
		});
		
		link.end(callback);
	},
	
	// Remove all feeds that have been removed from categories
	// and remove categories not in use any more
	purgeFolders: function(callback) {
		var link = chain();
		var isInFolder = this.isInFolder;
		var reverseFolderMap = this.reverseFolderMap;
		var subscriptions = this.subscriptions;
		
		// Loop through every folder and remove orphans
		app.user.structure.forEachFolder(function(folder) {
			// Check every feed
			folder.forEachItem(function(item) {
				if ( item.isFolder ) return;
				
				if ( ! isInFolder(item, folder) )
					folder.removeFeed(item.id);
			});
		});
		
		// Loop through every folder and find ones not used by Google Reader
		app.user.structure.forEachFolder(function(folder) {
			if ( folder.id != app.user.structure.base.id && ! reverseFolderMap[folder.id] )
				link.and(app.user.structure.removeFolder, folder);
		});
		
		link.end(callback);
	},
	
	// Remove unused feeds
	purgeFeeds: function(callback) {
		var feedMap = this.reverseFeedMap;
		
		var link = chain();
		app.user.forEachFeed(function(feed) {
			// If feed is not used, remove it
			if ( ! feedMap[feed.id] )
				link.and(app.user.removeFeed, feed);
		});
		
		link.end(callback);
	},
	
	isInFolder: function(feed, folder) {
		// check if $feed is in $folder
		// find $folder in this.subscriptions.order
		var readerCategory = this.reverseFolderMap[folder.id];
		var category = this.getCategoryFromId(readerCategory);
		
		// No category? Assume root. TODO: FIXME: Make better
		category = !category ? this.subscriptions.order.root : category.order;
		
		return category.some(function(f) {
			return f.id == feed.guid;
		});
	},
	
	getCategoryFromId: function(id) {
		for ( var i = 0, cat; cat = this.subscriptions.order.categories[i]; i++ )
			if ( cat.id == id )
				return cat;
		return false;
	},
	
	populateFolders: function(subscriptions, callback) {
		var folderMap = this.folderMap;
		var reverseFolderMap = this.reverseFolderMap;
		
		var link = chain();
		subscriptions.categories.forEach(function(category) {
			link.and(app.user.structure.findByParentAndName, app.user.structure.base.id, category.label);
			link.then(function(folder, next) {
				folderMap[category.id] = folder.id;
				reverseFolderMap[folder.id] = category.id;
				next();
			});
		});
		link.end(callback);
	},
	
	googleSubscriptionToFeed: function(sub) {
		return new Feed({
			type: 'google',
			guid: sub.id,
			path: Google.unFeedStream(sub.id),
			title: sub.title,
			link: sub.htmlUrl,
			favicon: app.config.defaultFavicon(sub.htmlUrl)
		});
	},
	
	reloadSubscriptions: function(callback) {
		chain(Google.fetchFeeds)
		.then(this.storeSubscriptions)
		.end(callback);
	},
	
	storeSubscriptions: function(subscriptions, callback) {
		this.subscriptions = subscriptions;
		this.googleSubscriptionMap = {};
		
		if (subscriptions && subscriptions.feeds) {
			for ( var i = 0, feed; feed = subscriptions.feeds[i]; i++ )
				this.googleSubscriptionMap[feed.id] = feed;
		}
		
		if (subscriptions && subscriptions.categories) {
			for ( var i = 0, folder; folder = subscriptions.categories[i]; i++ )
				this.googleSubscriptionMap[folder.id] = folder;
		}
		
		fireCallback(callback, this.subscriptions);
	},
	
	pushUp: function(feedContainer, callback) {
		this.newData = feedContainer;
		this.badFeeds = [];
		
		app.events.send("syncsetup:status", {text: "Syncing..."});
		
		chain(this.reloadSubscriptions) // ✔
		.and(this.upAddSubscriptions) // ✔
		.and(this.upAddFolders) // ✔
		.and(this.upStoreOrder) // ✔
		.and(this.upCheck) // ✔
		.then(function(success) {
			app.events.send("syncsetup:status", {text: "Sync complete"});
			fireCallback(callback, success);
		});
	},
	
	// Add feeds not found in Google Reader, but user might have had locally before syncing
	upAddSubscriptions: function(callback) {
		app.events.send("syncsetup:status", {text: "Pushing local feeds to Google Reader"});
		
		var link = chain();
		var googleSyncer = this;
		
		this.newData.forEachFeed(function(feed) {
			if ( feed.type !== "rss" )
				return;
			
			link.and(function(next) {
				app.events.send("syncsetup:status", {text: "Pushing " + feed.title + "..."});
				next();
			});
			
			// Add this feed
			link.and(Google.addFeed, {path: feed.path}).then(function(res, next) {
				// So this feed didn't exist in Google Reader
				if ( ! res ) {
					googleSyncer.badFeeds.push(feed.path);
					googleSyncer.newData.removeFeed(feed);
					return next();
				}
				feed.guid = res.streamId;
				next();
			});
		});
		
		link.end(callback);
	},
	
	upAddFolders: function(callback) {
		app.events.send("syncsetup:status", {text: "Adding local folders to Google Reader"});
		
		var link = chain();
		
		// Add correct feeds to correct categories
		this.newData.base.getFolders().forEach(function(folder) {
			var streamIds = [];
			
			// Loop through children adding tag with name user/-/label/<labelname>
			folder.getFeeds().forEach(function(feed) {
				streamIds.push(feed.guid);
			});
			
			link.and(Google.addTag, streamIds, Google.toLabelName(folder.name));
		});
				
		link.end(callback);
	},
	
	upStoreOrder: function(callback) {
		app.events.send("syncsetup:status", {text: "Updating order..."});
		
		// Make sure we have all sortid's
		chain(this.reloadSubscriptions)
		// Then do the actual updating
		.then(this.upStoreAllOrder)
		.end(callback);
	},
	
	upStoreAllOrder: function(callback) {
		app.events.send("syncsetup:status", {text: "Saving order..."});
		this.updateSortOrderForFolder({id: Google.categories.root}, this.newData.base, callback);
	},
	
	updateSortOrderForFolder: function(folder, items, callback) {
		app.events.send("syncsetup:status", {text: "Saving order for " + folder.label + "..."});
		
		var link = chain();
		var sortString = [];
		
		items.items().forEach(function(item) {
			if ( item.isFeed && this.googleSubscriptionMap[item.guid] )
				sortString.push(this.googleSubscriptionMap[item.guid].sortid);
			else if ( item.isFolder ) {
				var category = this.googleSubscriptionMap[item.googleId()];
				if ( ! category || ! item.items().length )
					return;
				sortString.push(category.sortid);
				
				link.and(this.updateSortOrderForFolder, category, item);
			}
		}, this);
				
		link.and(Google.updateOrder, sortString.join(""), folder.id);
		link.end(callback);
	},
	
	upCheck: function(callback) {
		callback(!! this.badFeeds.length);
	},
	
	getUsername: function() {
		return Google.profileData ? Google.profileData.userName : "Loading...";
	},
	
	getEmail: function() {
		return Google.profileData ? Google.profileData.userEmail : "Restart to see email";
	},

	clearAllUnread: function(feed, callback) {
		Google.markAllAsRead(feed.guid, callback);
	},

	clearAllUnreadEverywhere: function(callback) {
		Google.markAllFeedsAsRead(callback);
	},

	requireLocalCacheUpdate: function() {
		return true;
	}
});
