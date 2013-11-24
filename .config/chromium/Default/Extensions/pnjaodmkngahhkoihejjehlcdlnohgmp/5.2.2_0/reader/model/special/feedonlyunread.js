var FeedOnlyUnread = Feed.extend({
	initialize: function() {
		this._super.apply(this, arguments);
		
		this.isMagic = true;
		this.onlyUnread = true;
		this.title = "All unread";
		this.favicon = app.config.defaultFavicon();
	},

	findConditions: function() {
		return {is_read: 0};
	},

	byConditions: function() {
		return 'id desc';
	},
	
	fetchPosts: function(callback) {
		this.offset = 0;

		var numPosts = this.getNumPosts();
		this.numberOfFetchedPosts = numPosts;

		Mapper.get("post").find(
			this.findConditions(),
			{by: this.byConditions(), limit: [this.offset, numPosts+1]},
			this.setPosts.withCallback(callback)
		);
	},

	_getFromCache: function() {
		return this.posts.slice(0, this.getNumPosts());
	},
	
	massMarkAsRead: function(callback) {
		app.user.clearAllUnread(callback);
	},
	
	countUnread: function(callback) {
		fireCallback(callback, app.user.countStoredUnreads());
	}
});