var CacheStore = Class.extend({
	initialize: function() {
		this.clearCache();
	},

	clearCache: function() {
		this.store = {};
		this.store[Feed.model] = {};
		this.store[Folder.model] = {};
		this.store[Post.model] = {};

		this.cache = {
			posts: {}
		};
	},

	addObject: function(obj) {
		var id = obj.getCacheId();

		if (!id)
			return obj;

		// New objects
		if (!this.store[obj.model][id]) {
			this.store[obj.model][id] = obj;

			if (obj.model == "post") {
				this.addPostToFeed(obj);
			}
		// Update property for existing object
		} else {
			this.store[obj.model][id].copyPropertiesFrom(obj);
		}

		return this.store[obj.model][id];
	},

	addPostToFeed: function(post) {
		if (!this.cache.posts[post.feed_id])
			this.cache.posts[post.feed_id] = {};

		this.cache.posts[post.feed_id][post.getCacheId()] = post;
	},

	deleteObject: function(obj) {
		delete this.store[obj.model][obj.getCacheId()];

		if (obj.model == "post") {
			this.cache.posts[obj.feed_id] = [];
		}
	},

	clearFor: function(cls) {
		this.store[cls.model] = {};
	},

	randomObjectFor: function(cls) {
		var items = Object.values(this.store[cls.model]);
		return items[Math.floor(Math.random()*items.length)] || false;
	},

	randomPost: function() {
		return this.randomObjectFor(Post);
	},

	deleteAllPosts: function(feedId) {
		if (this.cache.posts[feedId]) {
			this.postsForFeed.forEach(function(post) {
				this.deleteObject(post);
			}, this);
		}
		delete this.cache.posts[feedId];
	},

	feed: function(id) {
		return this.store[Feed.model][id];
	},

	post: function(id) {
		return this.store[Post.model][id];
	},

	folder: function(id) {
		return this.store[Folder.model][id];
	},

	feeds: function() {
		return Object.values(this.store[Feed.model]);
	},

	posts: function() {
		return Object.values(this.store[Post.model]);
	},

	postsForFeed: function(feedId) {
		if (!this.cache.posts[feedId])
			return [];
		return Object.values(this.cache.posts[feedId]);
	},
	
	sortedPostsForFeed: function(feedId) {
		var posts = this.postsForFeed(feedId);

		posts.sort(function(a, b) {
			if ( a.published == b.published )
				return 0;
			if ( a.published > b.published )
				return -1;
			if ( a.id > b.id )
				return -1;
			return 1;
		});

		return posts;
	},
});
