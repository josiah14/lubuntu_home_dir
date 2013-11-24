var PostMapper = Mapper.extend({
	table: 'posts',
	model: 'Post',
	
	install: function(callback) {
		var postMapper = this;
		
		this._super(function() {
			postMapper.addIndex('feed_id', callback);
		});
	},
	
	addPosts: function(posts, callback) {
		var link = chain();
		
		for ( var i = 0, post; post = posts[i]; i++ )
			link.chain(this.addPost, post);
		
		link.end(callback);
	},
	
	addPost: function(post, callback) {
		post.checkIfIsPost({
			yes: this.syncIsRead.andArguments(post, callback), // If already post just don't
			no: this.addNewPost.withCallback(callback)
		});
	},
	
	// Some APIs, like google reader, indicate if the post is read. So we make sure we sync this correctly
	syncIsRead: function(post, originalPost, callback) {
		// If is_read or is_starred is defined
		if ( typeof originalPost.is_read !== "undefined" || typeof originalPost.is_starred !== "undefined" ) {
			// Keep track if something changed
			var changed = false;
			
			// First is_read
			if ( post.is_read != originalPost.is_read ) {
				post.is_read = +originalPost.is_read;
				changed = true;
			}
			
			// Second is_starred
			if ( post.is_starred != originalPost.is_starred ) {
				post.is_starred = +originalPost.is_starred;
				changed = true;
			}
			
			// If something changed, save it to database
			if ( changed )
				chain(this.save, post).end(callback, originalPost);
			else
				callback(originalPost);
		} else {
			callback(originalPost);
		}
	},
	
	addNewPost: function(post, callback) {
		var feed = app.user.feed(post.feed_id);
		
		chain(this.save, post)
		.and(function() {
			app.events.send('post:added', {post: post.id});
			app.events.send('feed:updated', {feed: post.feed_id});
			callback(post);
		});
	}
});
