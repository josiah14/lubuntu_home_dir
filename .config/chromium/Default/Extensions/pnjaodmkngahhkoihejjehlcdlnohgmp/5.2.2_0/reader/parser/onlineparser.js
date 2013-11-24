var OnlineParser = FeedParser.extend({
	setResult: function(res, callback) {
		this.result = res;
		if ( ! this.result )
			this.error = true;
		
		fireCallback(callback);
	},
	
	parse: function(callback) {
		if ( this.error )
			return fireCallback(callback, this);
		
		this.data.title = this.result.title;
		this.data.link = this.result.link;
		this.data.favicon = this.result.favicon;
		this.findPosts();
		
		fireCallback(callback, this);
	},
	
	findPosts: function() {
		this.result.posts.forEach(this.parsePost);
	},
	
	parsePost: function(item) {
		this.posts.push({
			title: item.title,
			link: item.link,
			summary: item.summary || '',
			guid: item.guid,
			published: item.published
		});
	}
});
