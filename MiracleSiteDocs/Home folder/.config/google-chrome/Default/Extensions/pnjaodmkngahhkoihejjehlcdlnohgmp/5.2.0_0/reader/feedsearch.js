var FeedSearch = Class.extend({
	searchURL: function() {
		return Ext.isOnline() ? app.config.feeder.root + '/api/feed-search.json?q=$term' : 'https://ajax.googleapis.com/ajax/services/feed/find?q=$term&v=1.0'
	},
	
	proxyURL: function() {
		return app.config.feeder.root + '/api/feed-proxy?path=$url';
	},
	
	search: function(url, callback) {
		this.term = url;
		
		if ( ! url.match(/https?:\/\//) )
			url = "http://" + url;
		
		this.searchTerm = url;
		
		if ( Ext.isOnline() )
			url = this.proxyURL().replace('$url', encodeURIComponent(url));
		
		this.request = new Request({
			url: url,
			onComplete: this.searchComplete.withCallback(callback)
		});
		this.request.send();
	},
	
	searchComplete: function(status, data, xml, callback) {
		var feeds = [];
		if ( status === 200 )
			feeds = this.searchForFeedsInText(data, this.searchTerm);
			
		if ( ! feeds.length ) {
			this.keywordSearch(this.term, callback);
		} else {
			callback(feeds);
		}
	},
	
	keywordSearch: function(term, callback) {
		this.request = new Request({
			url: this.searchURL().replace('$term', encodeURIComponent(this.term)),
			onComplete: this.keywordSearchComplete.withCallback(callback)
		});
		this.request.send();
	},
	
	keywordSearchComplete: function(status, data, xml, callback) {
		var feeds = [];
		try {
			data = JSON.parse(data);
			feeds = data.responseData.entries.map(function(feed) {
				return {
					title: feed.title,
					href: feed.url
				};
			});
		} catch (e) {}
		
		callback(feeds);
	},
	
	searchForFeedsInText: function(text, url) {
		var html;
		var match = text.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
			
		var feeds = [];
			
		if ( match ) {
			html = match[1];
			
			var element = document.createElement('div');
			element.innerHTML = html;
			
			feeds = element.querySelectorAll('link[rel=alternate], link[type*=rss], link[type*=atom], link[type*=rdf]');
			for ( var i = 0, feed; feed = feeds[i]; i++ ) {
				// Get link
				var href = feed.getAttribute('href');
				if ( ! href.match(/^(http|https):/) ) {
					if ( url.substr(-1) != '/' && href.substr(0, 1) != '/' )
						url += '/';
					href = url + href;
				}
				feed.href = href;
			}
			feeds = Array.prototype.slice.call(feeds);
		} else {
			var doc = (new DOMParser()).parseFromString(text, 'text/xml');
			if ( doc.querySelector('rss') || doc.querySelector('feed') || doc.querySelector('rdf') || doc.querySelector('channel') )
				feeds = [{title: 'Feed', href: url}];
		}
		return feeds;
	}
});
