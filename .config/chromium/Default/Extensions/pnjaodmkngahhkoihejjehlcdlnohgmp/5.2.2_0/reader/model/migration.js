var Migration = Model.extend({
	mapper: 'migration',
	
	schema: {
		'version': {type: 'int'},
		'created': {type: 'int'}
	},

	getCacheId: function() {
		return false;
	}
});

Migration.model = "migration";

Migration.migrations = {
	1: function(callback) {
		chain(this.postMapper.addField, 'meta')
		.and(this.postMapper.addField, 'summary')
		.and(this.postMapper.addField, 'is_starred')
		.and(this.postMapper.addField, 'guid')
		
		.and(this.feedMapper.addField, 'type')
		.and(this.feedMapper.addField, 'guid')
		.and(this.feedMapper.addField, 'updateinterval')
		.and(this.feedMapper.addField, 'meta')
		 
		// Add GUIDs to all feeds
		.and(function(next) {
			chain(this.feedMapper.find, 'all')
			.then(function(res, meta, done) {
				var link = chain();
				for ( var i = 0, feed; feed = res[i]; i++ ) {
					feed.guid = feed.path;
					link.and(feed.save);
				}
				link.end(done);
			})
			.end(next);
		}.bind(this))
		
		.and(app.user.reloadFeeds)
		 	
		.end(callback);
	},

	2: function(callback) {
		chain(this.feedMapper.addField, 'notifyemail')
		.and(app.user.reloadFeeds)
		.end(callback);
	}
};
