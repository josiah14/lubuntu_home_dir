var FeedContainer = Class.extend({
	initialize: function() {
		this.feeds = {};
		this.folders = {};
		
		this.feedIdCounter = 9999999;
		this.folderIdCounter = 9999999;
		
		this.base = false;
		this.folderQueue = [];
	},
	
	addFeed: function(data) {
		var originalId = data.id || false;

		var feed = new Feed(data);
		feed._originalId = originalId;
		
		// this is wrong? this.feeds[id] = feed
		if ( this.feeds[feed.guid] )
			return;
		
		if ( ! feed.favicon )
			feed.favicon = app.config.defaultFavicon(feed.path);
		
		if ( ! feed.title )
			feed.title = feed.path;
		
		if ( ! feed.type )
			feed.type = "rss";
		
		TRYIT(function() {
			if ( ! feed.link )
				feed.link = "http://" + (new URI(feed.path)).host();
		});
		
		if ( ! feed.id )
			feed.id = this.feedIdCounter++;
		this.feeds[feed.id] = feed;
		
		this.currentFolder.addFeed(feed.id);
	},
	
	addFolder: function(folder) {
		folder.id = this.folderIdCounter++;
		this.folders[folder.id] = folder;
		
		if ( this.currentFolder )
			this.currentFolder.addFolder(folder.id);
	},
	
	pushFolder: function(name) {
		var folder;
		if ( typeof name === "string" ) {
			folder = new Folder();
			folder.name = name;
		
			this.addFolder(folder);
		} else
			folder = name;
		folder.structure = this;
		
		if ( ! this.base ) {
			this.base = folder;
			folder.standard = true;
		}
		
		this.currentFolder = folder;
		this.folderQueue.push(folder);
		
		return folder;
	},
	
	popFolder: function() {
		this.folderQueue.pop();
		this.currentFolder = this.folderQueue[this.folderQueue.length-1];
	},
	
	feed: function(id) {
		return this.feeds[id];
	},
	
	folder: function(id) {
		return this.folders[id];
	},
	
	forEachFeed: function(callback) {
		for ( var key in this.feeds ) if (this.feeds.hasOwnProperty(key))
			fireCallback(callback, this.feeds[key]);
	},
	
	removeFeed: function(feed) {
		this.feedToRemove = feed;
		delete this.feeds[feed];
		this.recRemoveFeed(this.base);
	},

	recRemoveFeed: function(folder) {
		folder.removeFeed(this.feedToRemove.id);
		folder.getFolders().forEach(this.recRemoveFeed);
	},

	toJSON: function() {
		var obj = {name: "Feeds"};
		obj.items = this.base.items().map(function serialize(item) {
			if (item.isFeed)
				return item.toJSON();
			else {
				var folder = item.toJSON();
				folder.items = item.items().map(serialize);
				return folder;
			}
		});
		return JSON.stringify(obj);
	}
});