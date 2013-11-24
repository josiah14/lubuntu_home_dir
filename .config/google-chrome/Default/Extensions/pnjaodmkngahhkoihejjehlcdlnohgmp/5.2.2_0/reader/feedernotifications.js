var FeederNotifications = Class.extend({
	initialize: function() {
		setInterval(this.check, Config.feederNotificationCheckInterval);
	},

	check: function(callback) {
		if (Ext.isOnline())
			return fireCallback(callback);

		var request = new Request({
			url: Config.feederNotificationsURL,
			onComplete: this.loaded.withCallback(callback)
		});

		request.send({get: {id: app.user.preferences.get("client_id"), _random: Date.now()}});
	},

	loaded: function(status, res, xml, callback) {
		var emptyFeed = new Feed();
		var parser = new RSSParser(emptyFeed);
		parser.useSummary = true;

		chain(parser.setResult, xml, res)
		.and(parser.parse)
		.end(this.parsed, parser, callback);
	},

	parsed: function(parser, callback) {
		var posts = parser.getPosts();

		if (! posts[0])
			this.current = false;
		else {
			this.current = this.encodeText(posts[0].summary);
			this.currentId = posts[0].guid;
		}

		if (app.user.preferences.get("notifications:hide") == this.currentId) {
			this.current = false;
		}

		fireCallback(callback);
	},

	encodeText: function(text) {
		return text.replace ? text.replace(/feeder pro/, 'feeder <span class="pro-badge">pro</span>') : text;
	},

	hideCurrent: function() {
		if (this.currentId) {
			this.current = false;
			app.user.preferences.set("notifications:hide", this.currentId);
		}
	}
});