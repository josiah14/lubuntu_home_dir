var Post = Model.extend({
	mapper: 'post',
	
	schema: {
		feed_id: {type: 'int'},
		title: {type: 'text'},
		link: {type: 'text'},
		summary: {type: 'text', mandatory: false, standard: ''}, // new
		is_read: {type: 'int', standard: 0},
		is_starred: {type: 'int', standard: 0}, // new
		published: {type: 'int'},
		guid: {type: 'text', mandatory: false}, // New
		meta: {type: 'text', mandatory: false} // new
	},

	getCacheId: function() {
		return this.id;
	},
	
	checkIfIsPost: function(callbacks) {
		var postMapper = this.mapper;
		var post = this, foundPost;
		
		if ( foundPost = app.user.checkIfIsPost(post) )
			return callbacks.yes(foundPost);
		
		var findParams = {
			'feed_id': post.feed_id
		};
		
		if ( post.guid )
			findParams.guid = post.getGUID();
		else
			findParams.link = post.link;
		
		// First try to find with the same link
		chain(postMapper.find, findParams).then(function(posts, meta, next) {
			if ( ! posts.length )
				return next();
			callbacks.yes(posts[0]);
			return chain.exit;
		// GUIDs are holy. If no result was found via the GUID we must assume that this post is unique.
		}).and(function(next) {
			if ( ! post.guid )
				return next();
			callbacks.no(post);
			return chain.exit;
		// Then try to find with same title, and published within 10 seconds of it
		}).then(postMapper.find, {
			'feed_id': post.feed_id,
			'title': post.title,
			'published >': post.published - 5000, // time is in milliseconds
			'published <': post.published + 5000
		}).then(function(posts) {
			if ( ! posts.length )
				callbacks.no(post);
			else
				callbacks.yes(posts[0]);
		});
	},
	
	markAsRead: function(callback) {
		this.mark(1, callback);
	},
	
	markAsUnread: function(callback) {
		this.mark(0, callback);
	},
	
	mark: function(isRead, callback) {
		var post = this;
		var oldUnread = post.is_read;
		post.is_read = isRead;
		
		var changedCount = false;
		if (this.is_read != oldUnread)
			changedCount = (oldUnread != this.is_read);
		
		this.mapper.save(post, function() {
			if (changedCount)
				app.user.updateUnreadCountForFeed(post.feed_id, app.user.unreadCounts[post.feed_id] + (isRead ? -1 : 1));
			
			app.events.send('post:updated', {post: post.id});
			app.events.send('feed:updated', {feed: post.feed_id});
			
			fireCallback(callback);
		});
	},
	
	toggleStar: function(callback) {
		var post = this;
		
		post.is_starred = +(! post.is_starred);
		this.mapper.save(post, function() {
			app.events.send('post:updated', {post: post.id});
			fireCallback(callback);
		});
	},
	
	getGUID: function() {
		return this.guid || this.link;
	},
	
	getLink: function() {
		if ( ! app.user.isPro() && app.user.preferences.get("global:useSkimlinks") )
			return "http://go.feeder.co/?id=32290X899567&url=" + encodeURIComponent(this.link);
		return this.link;
	},

	getConsumePath: function() {
		return app.config.feeder.postURL.replace("{post_id}", this.guid);
	}
});

Post.model = "post";