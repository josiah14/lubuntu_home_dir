var OnlineLoader = FeedLoader.extend({
	load: function(callback) {
		var request = new Request({
			url: Config.feeder.root + '/api/feeds/' + this.feed.guid + '.json',
			onComplete: this.loadComplete.withCallback(callback)
		});
		
		request.send();
	},
	
	loadComplete: function(status, text, xml, callback) {
		callback(tryToParseJSON(text));
	}
});