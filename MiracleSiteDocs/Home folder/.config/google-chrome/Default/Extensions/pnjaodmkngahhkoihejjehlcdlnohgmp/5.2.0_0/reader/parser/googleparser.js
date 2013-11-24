var GoogleParser = FeedParser.extend({
	initialize: function() {
		this._super.apply(this, arguments);
	},
	
	setResult: function(res, callback) {
		this.result = res;
		if ( ! this.result )
			this.error = true;
		
		fireCallback(callback);
	},
	
	parse: function(callback) {
		if ( this.error )
			return fireCallback(callback, this);
		
		this.data.title = this.result.title.stripHTMLEntities();
		this.data.link = this.findLinkFromAlternate(this.result.alternate);
		this.data.favicon = app.config.defaultFavicon(this.data.link);
		this.findPosts();
		
		fireCallback(callback, this);
	},
	
	findPosts: function() {
		this.result.items.forEach(this.parsePost);
	},
	
	parsePost: function(item) {
		this.posts.push({
			title: (item.title || "").stripHTMLEntities(),
			link: this.findLinkFromAlternate(item.alternate),
			summary: (item.summary ? item.summary.content : '').stripHTMLEntities(),
			guid: item.id,
			published: item.published*1000,
			is_read: +(Google.hasTag("read", item)), // FIXME: TODO: how does this work? && ! Google.hasTag("unread", item)),
			is_starred: +(Google.hasTag("starred", item))
		});
	},
	
	findLinkFromAlternate: function(alternate) {
		if ( ! alternate )
			return false;
		
		for ( var i = 0, alt; alt = alternate[i]; i++ )
			if ( alt.type.contains("html") )
				return alt.href;
		
		return false;
	}
});