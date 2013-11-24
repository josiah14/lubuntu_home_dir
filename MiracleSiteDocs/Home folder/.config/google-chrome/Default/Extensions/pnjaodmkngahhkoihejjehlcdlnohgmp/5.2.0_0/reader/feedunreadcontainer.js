var FeedUnreadContainer = Class.extend({
	initialize: function() {
		this.feeds = {};
	},

	addPostFor: function(feed, post) {
		if (!this.feeds[feed.path])
			this.feeds[feed.path] = [];

		this.feeds[feed.path].push({
			title: post.title,
			link: post.link,
			guid: post.guid,
			is_read: post.is_read,
			is_starred: post.is_starred
		});
	},

	toJSON: function() {
		return JSON.stringify(this.feeds);
	}
});