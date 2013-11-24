/*
	Class:
		Exporter
	
	Creates a container with the local DB and Google reader merged, into a Google Reader-friendly format
	(no nested folders). In the future this class should be made smarter, by creating an abstract container
	for foreign feed data (in this case googleSubscription). This applies to the entire Google Reader integration really.
*/

var Exporter = Class.extend({
	initialize: function() {
		this.googleSubscription = Google.subscription;

		// Build a structure with the final result
		this.buildStructure();
	},
	
	buildStructure: function() {
		this.feeds = app.user.createFeedContainer();
		this.feeds.pushFolder("Feeds");
		
		// Add Google Feeds
		if ( this.googleSubscription && this.googleSubscription.order && this.googleSubscription.order.root )
			this.googleSubscription.order.root.forEach(this.addGoogleOrderSubscription);
		
		this.nestedFolders = [];
		
		// Merge current structure into it
		app.user.structure.base.forEachItem(this.addCurrentItem);
		
		// Add nested folders to bottom folder
		this.nestedFolders.forEach(function(folder) {
			this.feeds.pushFolder(folder.name);
			folder.getFeeds().forEach(this.addCurrentFeed);
			this.feeds.popFolder();
		}, this);
	},
	
	addGoogleOrderSubscription: function(item) {
		if ( item.isFeed )
			this.addGoogleFeedSubscription(item);
		else
			this.addGoogleFolderSubscription(item);
	},
	
	addGoogleFeedSubscription: function(feed) {
		if ( ! feed.isFeed )
			return;
		
		this.feeds.addFeed({
			path: feed.href,
			guid: feed.id,
			link: feed.htmlUrl,
			title: feed.title,
			type: 'google'
		});
	},
	
	addGoogleFolderSubscription: function(folder) {
		var category = this.googleSubscription.order.categories.filter(function(a) {
			return a.id == folder.id;
		})[0];
		
		if ( ! category )
			return;
			
		this.feeds.pushFolder(folder.label);
		
		// Only add feeds since we can't have nested folders in Google Reader
		category.order.forEach(this.addGoogleFeedSubscription);
		
		this.feeds.popFolder();
	},
	
	addCurrentItem: function(item) {
		if ( item.isFeed )
			this.addCurrentFeed(item);
		else {
			// If in base folder (since we don't support nested folders)
			if ( this.feeds.base === this.feeds.currentFolder )
				this.addCurrentFolder(item);
			else
				this.addNestedFolder(item);
		}
	},
	
	addCurrentFeed: function(feed) {
		if ( this.feeds.currentFolder.feedBy('path', feed.path) )
			return;
		this.feeds.addFeed(feed);
	},
	
	addCurrentFolder: function(folder) {
		var folderInstance = this.feeds.currentFolder.folderBy('name', folder.name);
		
		this.feeds.pushFolder(folderInstance || folder.name);
		folder.items().forEach(this.addCurrentItem);
		this.feeds.popFolder();
	},
	
	addNestedFolder: function(folder) {
		this.nestedFolders.push(folder);
		folder.getFolders().forEach(this.addNestedFolder);
	}
});