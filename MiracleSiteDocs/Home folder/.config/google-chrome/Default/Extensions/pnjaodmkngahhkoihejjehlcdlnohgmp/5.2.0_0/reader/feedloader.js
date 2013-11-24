var FeedLoader = Class.extend({
	initialize: function(feed) {
		this.feed = feed;
	},
	
	load: function(callback) {
		this.request = new Request({
			url: this.pathToLoad(),
			onComplete: this.loadComplete.withCallback(callback),
			onError: function() {
				callback('', '');
			},
			timeout: 30000
		});
		
		this.request.send();
	},
	
	loadComplete: function(status, text, xml, callback) {
		callback(xml || '', (text || '').trim() || '');
	},
	
	pathToLoad: function() {
		return this.feed.getPath();
	},
	
	abort: function() {
		this.isAborted = true;
		this.request.abort();
	}
});

FeedLoader.forFeed = function(feed) {
	return new (({
		'rss': RSSLoader,
		'google': GoogleLoader,
		'online': OnlineLoader
	})[feed.type] || RSSLoader)(feed);
};

FeedLoader.load = function(feed, callback) {
	var loader = FeedLoader.forFeed(feed);
	var parser = FeedParser.forFeed(feed);
		
	feed.loader = loader;
		
	chain(loader.load)
	.then(parser.setResult)
	.then(parser.parse)
	.then(function(parser) {
		callback(parser);
	});
};
