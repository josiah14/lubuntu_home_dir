Screen.NoFeeds = Controller.extend({
	template: 'screen#no-feeds',
	
	events: {
		'click .tpl-count-group': 'follow',
		'click .open-google-reader': 'openGoogleReader',
		'click .open-sync-settings': 'openSyncSettings',
		'click .done': 'done'
	},
	
	start: function() {
		this.template.set('title', _("Or add som recommended feeds"));
		$(document.body).removeClass("organize-mode");
		
		var feeds = [
			app.user.createFeed({title: "Feeder development blog", path: app.config.feederBlog, favicon: 'http://www.tumblr.com/favicon.ico'}),
			//app.user.createFeed({title: "Your Gmail", path: "https://mail.google.com/mail/u/0/feed/atom", favicon: 'https://mail.google.com/mail/u/0/images/favicon.ico'}),
			app.user.createFeed({title: "BBC News - Home", path: "http://feeds.bbci.co.uk/news/rss.xml", favicon: 'http://www.bbc.co.uk/favicon.ico'}),
			app.user.createFeed({title: "XKCD", path: "http://xkcd.com/rss.xml", favicon: 'http://xkcd.com/favicon.ico'})
		];
		
		feeds.forEach(function(feed) {
			feed.posts = [];
			feed.numUnread = 0;
			feed.numberOfFetchedPosts = app.user.preferences.get("global:postsDisplay");
		});
		
		this.doneButton = this.template.element.find(".bar-settings .done");
		
		feeds.forEach(this.addFeed);
		this.followChanged();
	},
	
	addFeed: function(feed) {
		feed.isStale = true;
		
		var item = this.template.addItem('feeds', feed);
		item.set('count', _('+ Follow'));
	},
	
	follow: function(e) {
		var feed = e.item.model;
		
		if ( ! app.user.hasFeedByPath(feed.path) ) {
			app.user.addFeed(feed.path, this.checkFeedAdd.andArguments(e.item));
			e.item.set('count', _('✔ Followed'));
		} else {
			app.user.removeFeed(app.user.feedBy('path', feed.path), this.followChanged);
			e.item.set('count', _('+ Follow'));
		}
	},
	
	checkFeedAdd: function(feed, item) {
		if ( ! feed ) {
			item.set('count', _('+ Follow'));
			PUI.alert("There was an error adding this feed.");
		}
		this.followChanged();
	},
	
	followChanged: function() {
		if ( app.user.hasFeeds() )
			this.doneButton.addClass("visible");
		else
			this.doneButton.removeClass("visible");
	},

	openGoogleReader: function() {
		this.vc.openSettingsPage("settings");
	},
	
	openSyncSettings: function() {
		this.vc.openSettingsPage("main", "highlightSyncSettings");
	},
	
	done: function() {
		fireCallback(this.onDone);
	}
});