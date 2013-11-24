var Folder = Model.extend({
	mapper: 'folder',
	
	schema: {
		name: {type: 'text'},
		orderstring: {type: 'text', standard: ""},
		standard: {type: 'int', standard: 0},
		meta: {type: 'text', mandatory: false}
	},
	
	onInit: function() {
		this.isFolder = true;
		if ( ! this.orderstring )
			this.orderstring = "";
	},

	toJSON: function() {
		return {
			isFolder: true,
			name: this.name
		}
	},

	getCacheId: function() {
		return this.id;
	},
	
	forEachItem: function(callback) {
		return this.items().forEach(callback);
	},
	
	forEachFolder: function(callback) {
		return this.items().filter(function(item) {
			return item.isFolder;
		}).forEach(callback);
	},
	
	forEachFolderRecursively: function(callback) {
		this.forEachFolder(function(folder) {
			callback(folder);
			folder.forEachFolder(callback);
		});
	},
	
	allFeeds: function(callback) {
		var feeds = [];
		this.forEachItem(function(item) {
			if ( item.isFeed )
				feeds.push(item);
			else
				feeds = feeds.concat(item.allFeeds());
		});
		return feeds;
	},
	
	rawItems: function() {
		if ( ! this.orderstring )
			return [];
		
		return this.orderstring.split(",").map(function(item) {
			return item.split(":");
		});
	},
	
	items: function() {
		var getFeed = this.getFeed, getFolder = this.getFolder;
		
		return this.rawItems().map(function(item) {
			var type = item[0], id = item[1];
			return type === "f" ? getFeed(id) : getFolder(id);
		}).filter(function(a) {
			return !! a;
		});
	},
	
	addItem: function(model) {
		if ( model.model == "feed" )
			this.addFeed(model.id);
		else if ( model.model == "folder" )
			this.addFolder(model.id);
	},
	
	addFeed: function(feedId) {
		if ( this.hasFeed(feedId) )
			this.moveFeedToBack(feedId);
		else
			this.orderstring = (this.orderstring + ",f:" + feedId).trimChars(",");
	},
	
	addFolder: function(folderId) {
		if ( this.hasFolder(folderId) )
			this.moveFolderToBack(folderId);
		else
			this.orderstring = (this.orderstring + ",d:" + folderId).trimChars(",");
	},
	
	removeItem: function(model) {
		if ( model.model == "feed" )
			this.removeFeed(model.id);
		else if ( model.model == "folder" )
			this.removeFolder(model.id);
	},
	
	removeFeed: function(feedId) {
		this.orderstring = this.rawItems().filter(function(item) {
			return !(item[0] == "f" && item[1] == feedId);
		}).map(function(item) {
			return item.join(":");
		}).join(",");
	},
	
	removeFolder: function(folderId) {
		this.orderstring = this.rawItems().filter(function(item) {
			return !(item[0] == "d" && item[1] == folderId);
		}).map(function(item) {
			return item.join(":");
		}).join(",");
	},
	
	moveFeedToBack: function(feedId) {
		this.removeFeed(feedId);
		this.addFeed(feedId);
	},
	
	moveFolderToBack: function(folderId) {
		this.removeFolder(folderId);
		this.addFolder(folderId);
	},
	
	hasFeed: function(id) {
		return this.rawItems().some(function(item) {
			return item[0] == "f" && item[1] == id;
		});
	},
	
	hasFolder: function(id) {
		return this.rawItems().some(function(item) {
			return item[0] == "d" && item[1] == id;
		});
	},
	
	hasFolderRecursively: function(id) {
		if ( this.hasFolder(id) )
			return true;
		
		return this.items().some(function(item) {
			if ( ! item.isFolder ) return false;
			return item.hasFolderRecursively(id);
		});
	},
	
	unreadPosts: function(callback) {
		var unread = [];
		var link = chain();
		this.items().forEach(function(item) {
			link.and(item.unreadPosts);
			link.then(function(un, next) {
				unread = unread.concat(un);
				next();
			});
		});
		
		link.end(function() {
			callback(unread);
		});
	},
	
	countUnread: function(callback) {
		var feeds = this.allFeeds();
		var link = chain();
		var total = 0;
		feeds.forEach(function(feed) {
			link.and(feed.countUnread)
			link.then(function(unread, next) {
				total += unread;
				next();
			});
		});
		link.end(function() {
			callback(total);
		});
		//this.unreadPosts(function(posts) {
		//	callback(posts.length);
		//});
	},

	countUnreadSync: function() {
		var total = 0;
		this.allFeeds().forEach(function(feed) {
			total += feed.countUnreadSync();
		});
		return total;
	},
	
	starredPosts: function(callback) {
		var link = chain();
		var res = [];
		this.items().forEach(function(item) {
			link.and(item.starredPosts);
			link.then(function(posts, next) {
				res = res.concat(posts);
				next();
			});
		})
		
		link.and(function() {
			callback(res);
		});
	},
	
	countItems: function() {
		var total = 0;
		this.items().forEach(function(item) {
			if ( item.isFeed )
				total++;
			else
				total += item.countItems();
		});
		return total;
	},
	
	markAllAsRead: function(callback) {
		var folder = this;
		
		var link = chain();
		this.items().forEach(function(item) {
			link.and(item.markAllAsRead);
		});
		
		link.and(function() {
			app.events.send("folder:updated", {folder: folder.id});
			fireCallback(callback);
		});
	},
	
	setOrderFromArray: function(arr) {
		this.orderstring = arr.map(function(item) {
			return (item.model == 'feed' ? 'f' : 'd') + ':' + item.id;
		}).join(",");
	},
	
	toGoogleString: function() {
		return this.items().map(function(item) {
			return item.model == "feed" ? Google.sortIdFor(item.guid) : Google.sortIdForFolder(item.name);
		}).join("");
	},
	
	googleId: function() {
		return this.standard ? Google.categories.root : Google.toLabelName(this.name);
	},
	
	getParent: function() {
		return app.user.structure.folderWithFolder(this.id);
	},
	
	getFeeds: function() {
		return this.items().filter(function(item) {
			return item.isFeed;
		});
	},
	
	getFolders: function() {
		return this.items().filter(function(item) {
			return item.isFolder;
		});
	},
	
	getFeed: function(id) {
		return this.structure ? this.structure.feed(id) : app.user.feed(id);
	},
	
	getFolder: function(id) {
		return this.structure ? this.structure.folder(id) : app.user.structure.folder(id);
	},
	
	getStructure: function() {
		var ret = [this];
		var p = this;
		while ( p = p.getParent() )
			ret.push(p);
		return ret;
	},
	
	feedBy: function(key, value) {
		return this.items().filter(function(item) {
			if ( item.isFolder ) return false;
			return item[key] == value;
		})[0];
	},
	
	folderBy: function(key, value) {
		return this.items().filter(function(item) {
			if ( ! item.isFolder ) return false;
			return item[key] == value;
		})[0];
	},

	toContainer: function() {
		var feedContainer = new FeedContainer();
		feedContainer.pushFolder("Feeds");

		this.forEachItem(function add(item) {
			if (item.isFeed)
				feedContainer.addFeed(item);
			else {
				feedContainer.pushFolder(item.name);
				item.forEachItem(add);
				feedContainer.popFolder();
			}
		});

		return feedContainer;
	}
});

Folder.model = "folder";