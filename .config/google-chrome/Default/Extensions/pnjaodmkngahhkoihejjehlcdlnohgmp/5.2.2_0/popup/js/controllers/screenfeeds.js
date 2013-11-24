Screen.Feeds = Screen.Organizeable.extend({
	start: function() {
		this._super.apply(this, arguments);
		
		this.event.add({
			'click .item-edit-button': 'editFeed',
			'click-or-touch .tpl-list-item-feed': 'itemClicked',
			'click .tpl-list-item-feed .tpl-count-group': 'markAllAsRead',
			'click .cancel': 'cancelEdit',
			'click .edit-feed': 'editFeed',
			'click .item-remove': 'removeItem',
			'click .open-all-unread': 'openAllUnread',
			'click .flerp': 'openFlerp'
		});
		
		this.addContextMenu('.tpl-list-item-feed', {
			'Go to page': 'gotoPage',
			'Mark feed as read': 'markAllAsRead',
			'Open all unread in feed': 'openAllUnread',
			'--': '',
			'Open every unread post': 'openEveryUnreadPost',
			'Mark all as read': 'clearAllUnread',
			'---': '',
			'Go to options page': 'openOptionsPage',
		}, {onlyPopup: true});

		this.vc.history.wrapAround = true;
	},
	
	destroy: function() {
		this._super();
		this.vc.listener.removeModelListener(this.folder, this.folderChanged);
		this.clearPostsPage();
	},
	
	populate: function(callback) {
		this._onPopulatedCallback = callback;

		this.clearItems();
		this.startScreenLoading();
		
		if ( this.vc.currentFilter )
			this['on' + this.vc.currentFilter.upperCaseFirst()]();
		else
			this.onAll();
	},
	
	populateDone: function() {
		this.stopScreenLoading();
		
		try {
			this.vc.refreshWindowHeight();
		} catch(e) {}
		
		if ( this.inOrganize() )
			this.loadSortables();
		
		this.onPopulated();
		fireCallback(this._onPopulatedCallback);
	},
	
	onPopulated: function() {},
	
	onUnread: function() {
		this.setPostsPage(app.user.create('FeedOnlyUnread'), this.populateDone);
	},
	
	onStarred: function() {
		this.setPostsPage(app.user.create('FeedOnlyStarred'), this.populateDone);
	},
	
	onAll: function() {
		this.clearPostsPage();
		if (this.folder) {
			this.error = false;
			this.folder.forEachItem(this.addItem);
		} else {
			this.error = true;
			this.showError();
		}
		this.populateDone();
	},
	
	setFolder: function(folder) {
		this.folder = folder;
		this.vc.listener.addModelListener(folder, this.folderChanged);
	},
	
	folderChanged: function(folder) {
		this.folder = folder;
		if ( this.disableFolderUpdates )
			return;
		this.populate();
	},
	
	clearItems: function() {
		this.hideNoScreen = false;
		this.items = [];
		this.vc.history.reset();
		this.template.setItems('feeds', []);
	},
	
	setPostsPage: function(magicFeed, callback) {
		this.clearPostsPage();
		this.postsPage = new Screen.Posts(magicFeed, true);
		this.postsPage.populate(this.onPostsPageSetPosts.withCallback(callback));

		this.postsPage.forceReload = this.populate;
	},
	
	onPostsPageSetPosts: function(posts, callback) {
		this.stopScreenLoading();
		
		if ( ! posts.length ) {
			fireCallback(callback);
			return this.clearPostsPage();
		}

		this.template.element.find('.screen-container').append(this.postsPage.template.container);
		
		// Remove 'no unread/starred' thing
		this.hideNoScreen = true;
		$(document.body).addClass('no-posts-page');
		
		fireCallback(callback);
	},
	
	clearPostsPage: function() {
		$(document.body).removeClass('no-posts-page');
		
		if ( this.postsPage ) {
			this.postsPage.destroy();
			this.postsPage.template.element.remove();
			this.postsPage = false;
		}
	},
	
	runItemFilter: function(item, callback) {
		var addItem = this.addItem;
		
		Screen.Feeds.currentFilter(item, function(res) {
			if ( res )
				addItem(item);
			callback();
		});
	},

	addItem: function(model) {
		var item;
		if ( model.isFolder )
			item = this.addFolder(model);
		else
			item = this.addFeed(model);

		this.vc.history.addAction(model);

		if (this.items.indexOf(item) === this.options.active) {
			this.vc.history.setActiveAction(model);
			$(item.element).addClass("active-highlighted");
			this.options.active = false;
		}
	},
	
	addFolder: function(folder) {
		var item = this.template.addItem('feeds', folder);
		$(item.element).addClass('is-folder');
		this.items.push(item);
		return item;
	},
	
	addFeed: function(feed) {
		var item = this.template.addItem('feeds', feed);
		this.items.push(item);
		return item;
	},
	
	itemClicked: function(e) {
		if ( $(e.target).closest('.tpl-count-group, .tpl-drawer-menu, .item-remove, .item-edit-button, .flerp, .tpl-screen-no-feeds').length )
			return;
		
		if ( (e.ctrlKey || e.metaKey) && ! this.inOrganize() ) {
			e.preventDefault();
			$(e.target).closest('.tpl-list-item-feed').toggleClass('opened');
			return;
		}

		this.gotoItem(e.item);
	},

	gotoItem: function(item) {
		if ( item.model.model === "folder" )
			this.vc.pushFolder(item.model);
		else if ( ! this.inOrganize() )
			this.vc.pushFeed(item.model);
		else if ( this.inOrganize() )
			this.vc.showSettingsScreen(item.model);
	},
	
	markAllAsRead: function(e) {
		e.item.model.markAllAsRead();
	},
	
	cancelEdit: function(e) {
		$(e.target).closest('.tpl-list-item-feed').removeClass('opened');
	},
	
	editFeed: function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		this.vc.showSettingsScreen(e.item.model);
		this.cancelEdit(e);
	},
	
	removeItem: function(e) {
		var text = _("Delete %s?", e.item.get('title'));
		
		if ( e.item.model.isFolder ) {
			var total = e.item.model.countItems();
			if ( total == 1 )
				text = _("Delete %s and the one feed in it?", e.item.get('title'));
			else if ( total > 1 )
				text = _("Delete %s and the %s feeds in it?", e.item.get('title'), total);
		}
		
		PUI.confirm(text)
		.yes(this.yesRemoveItem.andArguments(e.item));
	},
	
	yesRemoveItem: function(item) {
		if ( item.model.isFeed )
			this.yesRemoveFeed(item.model);
		else
			this.yesRemoveFolder(item.model);
	},
	
	yesRemoveFeed: function(feed) {
		this.folder.removeFeed(feed.id);
		app.user.removeFeedIfNotInCategories(feed.id);
		this.folder.save();
		
		this.elementForModel(feed).remove();
		this.vc.refreshWindowHeight();
	},
	
	yesRemoveFolder: function(folder) {
		app.user.structure.removeFolder(folder, function() {
			app.events.send("folder:removed", {folder: folder.id, folderName: folder.name});
		});
		
		this.elementForModel(folder).remove();
		this.vc.refreshWindowHeight();
	},
	
	elementForModel: function(model) {
		return $(this.template.element.find('.tpl-list-item-feed').get().filter(function(el) {
			return el.store.model === model;
		})[0]);
	},
	
	openAllUnread: function(e) {
		e.item.model.unreadPosts(function(posts) {
			app.ui.openMany(posts);
		});
	},
	
	openFlerp: function(e) {
		$(e.target).closest('.tpl-list-item-feed').toggleClass('opened');
	},
	
	gotoPage: function(e) {
		UI.openTab(e.item.model.link);
	},

	navForward: function(to) {
		this.gotoItem({model: to});
	},

	navigateTo: function(model) {
		if ( ! model )
			return;
		this.template.el('.active-highlighted').removeClass('active-highlighted');
		
		var currentElement = this.elementForModel(model);
		currentElement.addClass("active-highlighted");
		currentElement[0].scrollIntoViewSmart();

		this.currentIndex = this.vc.history.list.indexOf(model);
	},

	showError: function() {
		$(document.body).addClass("in-error");
	}
});
