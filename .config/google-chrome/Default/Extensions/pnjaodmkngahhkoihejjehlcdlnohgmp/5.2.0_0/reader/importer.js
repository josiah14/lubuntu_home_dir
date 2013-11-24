/*
	Class:
		Importer
	
	Takes care of importing old folder structure to FeedReader 4.0.
	Also takes care of migrations between DB versions.
*/

var Importer = Class.extend({
	initialize: function() {
		this.migrationMapper = Mapper.get("migration");
	},
	
	install: function(callback) {
		if (Database.current.isApi)
			return callback();
		this.migrationMapper.install(callback);
	},
	
	migrateDB: function(callback) {
		if (Database.current.isApi)
			return callback();
		this.migrationMapper.migrate(callback);
	},
	
	importOldFolders: function(callback) {
		if (Database.current.isApi)
			return callback();
		if ( ! localStorage.folders )
			return fireCallback(callback);
		
		this.folders = JSON.parse(localStorage.folders);
		
		this.feeds = new FeedContainer();
		this.runThroughFolder(this.folders[0]);
		
		app.sync.mergeContainer(this.feeds, function() {
			localStorage.oldFolders = localStorage.folders;
			delete localStorage.folders;
			fireCallback(callback);
		});
	},
	
	runThroughFolder: function(folder) {
		if ( ! folder )
			return;
		
		var name = folder.name; 
		this.feeds.pushFolder(name);
		
		var children = folder.children;
		var order = folder.feeds;
		
		var oldChildren = this.children;
		this.children = children;
		
		if ( typeof order === "object" && order.constructor === Array ) {
			order.forEach(this.runThroughChildren);
		}
		
		this.children = oldChildren;
		this.feeds.popFolder();
	},
	
	runThroughChildren: function(child) {
		if ( typeof child === "number" )
			this.runThroughFolder(this.children[child]);
		else
			this.addFeed(child);
	},
	
	addFeed: function(url) {
		var feed = app.user.feedBy("path", url);
		if ( ! feed ) {
			feed = new Feed();
			feed.path = feed.guid = url;
		}
		this.feeds.addFeed(feed);
	}
});

Importer.folders = {"0":{"name":"Feeds","children":{"1":{"name":"Folders","children":{"3":{"name":"Folders","children":{"2":{"name":"Within","children":{},"feeds":[]}},"feeds":[2]}},"feeds":["http://localhost/random/feed.rss","http://feeds.feedburner.com/codinghorror",3]}},"feeds":["http://anna.blo.gg/index.rss","http://feeds.feedburner.com/mootools-blog","http://webkit.org/blog/feed/","http://erikrothoff.com/feed/","http://duriansoftware.com/joe/index.rss","http://kent.nu/feed/","http://backend.deviantart.com/rss.xml?q=by%3ALindgrena&type=journal&formatted=1","http://pearlplatt.blogg.se/index.rss","http://peter.sh/feed/","http://allergilogg.blogg.se/index.rss","http://blog.wilshipley.com/feeds/posts/default","http://johanharenblogg.blogg.se/index.rss","http://andreaslagerkvist.com/?module=Articles&rss=1","http://xkcd.com/rss.xml","http://feed.dilbert.com/dilbert/daily_strip","http://erik.glonk.se/life/generate.php","http://littlebigdetails.com/rss","http://haironfire.blogg.se/index.rss","http://rootof.tumblr.com/rss","http://www.smbc-comics.com/rss.php","http://www.tbray.org/ongoing/ongoing.atom",1]}};