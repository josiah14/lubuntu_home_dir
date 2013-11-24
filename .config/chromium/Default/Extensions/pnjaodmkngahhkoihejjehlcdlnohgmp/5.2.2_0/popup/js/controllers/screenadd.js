Screen.Add = Controller.extend({
	template: 'screen#add',
	
	events: {
		'submit .add-feed-form': 'addFeedSubmit',
		'submit .add-folder-form': 'addFolder',
		'click .done': 'done',
		'change .tpl-follow-button': 'followChanged'
	},
	
	start: function() {
		this.searchForm = this.template.element.find('.add-feed-form');
		this.fromPageFrom = this.template.element.find('.add-from-page-form');
		
		this.hideSearchResults();
		this.hideEmptyResult();
		
		app.finder.countFeedsInCurrentTab(this.showOrHideFeedsInCurrentTab);
		
		this.template.set('title', _('Add new feed or folder'));
	},
	
	onPopupVisible: function() {
		app.finder.countFeedsInCurrentTab(this.showOrHideFeedsInCurrentTab);
	},
	
	showOrHideFeedsInCurrentTab: function(count) {
		this.template.setItems('feeds-on-page', []);
		if ( ! count )
			this.template.element.find('.tpl-box-add-from-page').hide();
		else {
			this.template.element.find('.tpl-box-add-from-page').show();
			app.finder.forEachFeed(this.addFeedFromPage);
		}
	},
	
	addFeedFromPage: function(feed) {
		this.template.addItem('feeds-on-page', {
			title: feed.title || feed.href,
			link: feed.href,
			value: feed.href,
			following: !!app.user.feedBy("path", feed.href) ? "true" : ""
		});
	},
	
	addFeedSubmit: function(e) {
		e.preventDefault();
		
		this.showLoading(this.searchForm);
		
		var term = this.searchForm.find('input[name=url]').val();
		
		var search = new FeedSearch();
		search.search(term, this.searchDone);
	},
	
	searchDone: function(feeds) {
		this.hideLoading(this.searchForm);
		
		if ( feeds.length == 1 ) {
			this.addFeed(feeds[0].href, false, this.vc.popScreen);
		} else if ( feeds.length )
			this.showSearchResults(feeds);
		else
			this.showEmptyResult();
	},

	showSearchResults: function(feeds) {
		this.template.element.find('.search-results').show();
		
		this.template.setItems('search-results', feeds.map(function(feed) {
			return {
				title: feed.title || feed.href,
				link: feed.href,
				value: feed.href,
				following: !!app.user.feedBy("path", feed.href) ? "true" : ""
			};
		}));
	},
	
	hideSearchResults: function() {
		this.template.element.find('.search-results').hide();
		this.template.setItems('search-results', []);
	},
	
	showEmptyResult: function() {
		this.template.element.find('.empty-search-result').show();
	},
	
	hideEmptyResult: function() {
		this.template.element.find('.empty-search-result').hide();
	},
	
	showLoading: function(form, callback) {
		$(form).find('input[type=submit]').addClass('loading');
		fireCallback(callback);
	},
	
	hideLoading: function(form, callback) {
		$(form).find('input[type=submit]').removeClass('loading');
		fireCallback(callback);
	},
	
	followChanged: function(e) {
		var feed = e.item.get("link");
		
		if ( e.item.ui.isFollowing.get() )
			this.addFeed(feed, e.item);
		else
			this.removeFeed(feed, e.item);
	},
	
	addFeed: function(url, item, callback) {
		var currentFolderId = this.vc.currentFolderId;
		
		chain(app.user.addFeed, url)
		.then(function(feed, next) {
			if ( ! feed ) {
				if (item)
					item.ui.isFollowing.set(false);
				PUI.alert(_("Could not add:\n%s", url), next);
				return chain.exit;
			}
				
			if ( ! currentFolderId || app.user.structure.base.id == currentFolderId )
				return next();
				
			chain(app.user.structure.removeFeed, feed.id)
			.and(app.user.structure.addFeedToFolder, feed.id, currentFolderId)
			.end(next);
		})
		.end(callback);
	},
	
	removeFeed: function(url, item, callback) {
		var feed = app.user.feedBy("path", url);
		if ( ! feed )
			return fireCallback(callback);
		
		PUI.confirm(_('Remove "%s"?', feed.title))
		.yes(function() {
			chain(app.user.removeFeedFromAllFolders, feed)
			.end(callback);
		})
		.no(function() {
			item.ui.isFollowing.set("true");
			fireCallback(callback);
		});
	},
	
	done: function() {
		this.vc.popScreen();
	},

	addFolder: function(e) {
		e.preventDefault();
		
		var folder = this.vc.currentFolderId || app.user.structure.base.id;
		app.user.structure.addNewFolderToFolder(this.template.el('[name=folder-name]').val(), folder, this.done);
	}
});