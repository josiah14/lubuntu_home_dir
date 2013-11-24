var GoogleLoader = FeedLoader.extend({
	load: function(callback) {
		this.request = new Google.Request({
			url: this.pathToLoad(),
			onComplete: this.loadComplete.withCallback(callback),
			onError: function() {
				callback('', '');
			},
			timeout: 30000
		});
		
		this.request.start();
	},
	
	pathToLoad: function() {
		return Google.feedLoadPath(this.feed.guid);
	},
	
	loadComplete: function(response, status, req, callback) {
		callback(response);
	}
});
