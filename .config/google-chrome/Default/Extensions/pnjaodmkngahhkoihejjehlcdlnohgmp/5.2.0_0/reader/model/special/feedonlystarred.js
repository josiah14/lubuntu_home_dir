var FeedOnlyStarred = Feed.extend({
	initialize: function() {
		this._super.apply(this, arguments);
		
		this.isMagic = true;
		this.title = "All starred posts";
		this.favicon = app.config.defaultFavicon();
	},
	
	findConditions: function() {
		return {is_starred: 1};
	},

	byConditions: function() {
		return 'id desc'
	},

	fetchPosts: function(callback) {
		this.offset = 0;
		this.numberOfFetchedPosts = this.getNumPosts();

		Mapper.get('post').find(
			this.findConditions(),
			{by: this.byConditions(), limit: this.numberOfFetchedPosts+1},
			this.setPosts.withCallback(callback)
		);
	},
	
	_getFromCache: function() {
		return this.posts.slice(0, this.getNumPosts());
	},

	massMarkAsRead: function(callback) {
		var ids = this.posts.map(function(p) {
			app.store.post(p.id).is_read = 1;
			app.store.feed(p.feed_id).cacheUpdateCount();
			return p.id;
		});
		
		Mapper.get('post').massUpdate({is_read: 1}, {id: ids}, callback);
	},
	
	countUnread: function(callback) {
		fireCallback(callback, 0);
	}
});