/*
	Class:
		FeedSync
	
	Sync feeds with other clients, beginning with Google Reader
	
	Do so by listening for feed:*-events, like feed:added, feed:removed,
	and also by bringing changes upstream from Google Reader
*/

var FeedSync = Class.extend({
	initialize: function() {
		this.syncers = [];
		this.syncerMap = {};
	},

	destroy: function(callback) {
		this.run('destroy', [], callback);
	},
	
	isFailedState: function() {
		return this.syncers.some(function(syncer) {
			return syncer.FAILURE;
		});
	},

	run: function(command, args, callback) {
		var link = chain();
		for ( var i = 0, syncer; syncer = this.syncers[i]; i++ )
			link.and.apply(link, [syncer[command]].concat(args));
		
		link.end(callback);
	},

	can: function(method) {
		return !!this.getWith(method);
	},

	getWith: function(method) {
		return this.syncers.filter(function(sync) {
			return typeof sync[method] === "function";
		})[0];
	},
	
	// Register all syncers
	startSyncing: function(callback) {
		chain(this.reloadSyncers)
		.and(this.addFeeder)
		.end(callback);
	},

	reloadSyncers: function(callback) {
		var queue = chain();

		if ( app.user.preferences.get('sync:google') && ! (Ext.isOnline() || app.user.isPro())  )
			queue.and(this.addGoogle)
			
		if ( Ext.isOnline() || app.user.isPro() )
			queue.and(this.addOnline);

		queue.end(callback);
	},
	
	createSyncer: function(name, syncerClass, callback) {
		var syncer = new syncerClass();
		syncer.startListening();
		
		this.syncers.push(syncer);
		this.syncerMap[name] = syncer;
		
		fireCallback(callback, syncer);
		
		return syncer;
	},

	unconnectSyncer: function(name) {
		var syncer = this.syncerMap[name];
		if (!syncer)
			return;
		this.syncers.remove(syncer);
		delete this.syncerMap[name];
		return syncer;
	},
	
	removeSyncer: function(name, callback) {
		var syncer = this.unconnectSyncer(name);

		chain(syncer.destroy)
		.and(syncer.uninstall)
		.then(function(feedsWithProblems) {
			callback(feedsWithProblems);
		});
	},
	
	fetchUpstream: function(callback) {
		this.run('fetchUpstream', [], callback);
	},
	
	processFeed: function(feed, callback) {
		this.run('processFeed', [feed], callback);
	},
	
	reloadDownstream: function(callback) {
		this.run('reloadDownstream', [], callback);
	},
	
	loadUnreadCounts: function(callback) {
		var syncer = false;
		if (this.get('online'))
			syncer = this.get('online');
		else if (this.get('google'))
			syncer = this.get('google');
		if (! syncer)
			return callback(false);
		syncer.loadUnreadCounts(callback);
	},

	push: function() {
		var args = [].slice.call(arguments);
		var callback = args[args.length-1];
		var syncers = args.slice(0, -1);
		
		if (! syncers.length) {
			syncers = this.syncers;
		}
		
		var exporter = new Exporter();
		
		var queue = chain();
		syncers.forEach(function(sync) {
			queue.and(sync.pushUp, exporter.feeds);
		});
		
		queue.end(callback, exporter);
	},
	
	get: function(syncer) {
		return this.syncerMap[syncer];
	},
	
	error: function(t) {
		alert("ERROR with " + t + ": You are not logged in as " + app.user.preferences.get("sync:google"));
	},
	
	//
	// Feeder setup
	//
	
	addFeeder: function(callback) {
		return this.createSyncer("feeder", FeederSyncer, callback);
	},

	addOnline: function(callback) {
		return this.createSyncer("online", OnlineSyncer, callback);
	},
	
	//
	//	Google setup
	//
	
	addGoogle: function(callback) {
		return this.createSyncer("google", GoogleSyncer, callback);
	},
	
	setupGoogle: function(callback) {
		Google.ensureUser(this.googleAuthenticationComplete.withCallback(callback));
	},
	
	googleAuthenticationComplete: function(success, callback) {
		if ( ! success )
			return callback("fail-auth");
		
		// We are now logged in as the right user.
		chain(Google.fetchFeeds)
		.then(function(subscriptions) {
			callback("success", subscriptions);
		});
	},
	
	//
	// Feed syncing
	//
	
	mergeContainer: function(feedContainer, callback) {
		this.currentFolder = app.user.structure.base;
		
		app.user.transaction(function(flushEvents) {
			chain(this.merge, feedContainer.base)
			.and(app.user.structure.save)
			.andSync(flushEvents)
			.and(function(next) {
				app.events.sendForced("sync:merge", {status: "Merge done"});
				next();
			})
			.end(callback, true);
		}.bind(this));
	},
	
	merge: function(folder, callback) {
		var queue = chain(), mergeItem = this.mergeItem;
		
		app.events.sendForced("sync:merge", {status: "Merging " + folder.name});
		
		folder.forEachItem(function(item) {
			queue.and(mergeItem, item);
		});
		
		queue.end(callback);
	},
	
	mergeItem: function(item, callback) {
		if ( item.isFeed )
			this.mergeFeed(item, callback);
		else
			this.mergeFolder(item, callback);
	},
	
	mergeFeed: function(feed, callback) {
		var currentFolder = this.currentFolder;
		
		var newFeed = new Feed(feed);
		if ( ! feed.type )
			feed.type = "rss";
		delete newFeed.id;
		
		app.events.sendForced("sync:merge", {status: "Merging feed " + feed.title});
		
		chain(app.sync.processFeed, newFeed)
		.and(app.user.addFeedIfNotExistsWithoutFolder, newFeed)
		.and(function() {
			if ( newFeed.id && ! currentFolder.hasFeed(newFeed.id) )
				currentFolder.addFeed(newFeed.id);
			callback();
		});
	},
	
	mergeFolder: function(folder, callback) {
		delete folder.id;
		
		var syncer = this;
		
		app.events.sendForced("sync:merge", {status: "Merging folder " + folder.name});
		
		chain(app.user.structure.findByParentAndName, syncer.currentFolder.id, folder.name)
		.then(function(addedFolder) {
			if ( ! syncer.currentFolder.hasFolder(addedFolder.id) )
				syncer.currentFolder.addFolder(addedFolder.id);
			syncer.mergeNextFolder(addedFolder, folder, callback);
		});
	},
	
	mergeNextFolder: function(addedFolder, folder, callback) {
		var lastFolder = this.currentFolder;
		this.currentFolder = addedFolder;
		
		chain(this.merge, folder)
		.end(this.mergeFolderDone, lastFolder, callback);
	},
	
	mergeFolderDone: function(lastFolder, callback) {
		this.currentFolder = lastFolder;
		callback();
	}
});
