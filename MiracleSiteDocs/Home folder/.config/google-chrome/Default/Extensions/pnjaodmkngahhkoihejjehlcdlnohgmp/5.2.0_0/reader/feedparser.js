/*
	Class:
		FeedParser
	
	Reads an RSS with callbacks for posts
*/

var FeedParser = Class.extend({
	initialize: function(feed) {
		this.feed = feed;
		this.path = feed.path;
		
		this.error = false;
		this.posts = [ /* { title, link, published } */ ];
		this.data = { /* title, favicon, link */ };
	},
	
	setResult: function(callback) { throw "implement"; },
	parse: function(callback) { throw "implement"; },

	getFeed: function() {
		this.feed.copyPropertiesFromServerData(this.data);
		this.feed.lastUpdated = Date.now();
		return this.feed;
	},
	
	// Transform post data into Post-objects
	getPosts: function() {
		var allAreRead = !! this.allAreRead;
		return this.posts.map(function(post) {
			var p = new Post(post);
			if ( allAreRead )
				p.is_read = 1;
			return p;
		});
	}
});

FeedParser.forFeed = function(feed) {
	return new ({
		'rss': RSSParser,
		'google': GoogleParser,
		'online': OnlineParser
	})[feed.type || 'rss'](feed);
};
