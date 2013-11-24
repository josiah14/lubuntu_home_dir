Screen.Posts = Controller.extend({
	template: 'screen#posts',
	
	events: {
		'click .tpl-bar-top': 'gotoPage',
		'click .tpl-list-item-post': 'postClicked',
		'mousedown .tpl-list-item-post': 'mousedownOnPost',
		'click .bar .mark-as-read': 'markAllAsRead',
		'click .tpl-post-list .tpl-drawer-menu .mark-as-read, .tpl-post-list .tpl-count-group': 'markAsRead',
		'click .tpl-post-list .mark-as-unread': 'markAsUnread',
		'click .tpl-post-list .star-post': 'toggleStar',
		'click .flerp': 'openFlerp',
		'click .cancel': 'cancelEdit',
		'click .item-starred': 'toggleStarFromItem',
		'click .load-more': 'loadMore',
		'click .x-more-available': 'moreAvailableClicked'
	},
	
	start: function(feed, wait, options) {
		this.feed = feed;
		this.offset = 0;
		
		this.template.data.setModel(feed);

		this.options = options || {};
		
		if ( this.feed.isMagic ) {
			this.template.element.addClass('is-magic-feed');
			
			if (this.feed.onlyUnread)
				this.removeReadPosts = false;
		}
		
		if ( ! wait)
			this.populate();
		
		this.vc.queue.setListener(this.queueChanged);

		this.vc.history.wrapAround = false;
		this.vc.history.onEnd(this.loadMoreForActions)
		
		this.addContextMenu('.tpl-list-item-post', {
			'Toggle read': 'toggleRead',
			'Mark feed as read': 'markAllAsRead',
			'Open all unread in feed': 'openAllUnread',
			'--': '',
			'Open every unread post': 'openEveryUnreadPost',
			'Mark all as read': 'clearAllUnread',
			'---': '',
			'Go to options page': 'openOptionsPage',
		});
		
		this.vc.listener.listen("post:updated", this.postUpdated);
	},
	
	populate: function(callback) {
		this.setMoreAvailable(0);
		this.onSetPostsDone = callback;
		this.feed.fetchPosts(this.callbackAfterAnimation(this.setPosts));
	},
	
	destroy: function() {
		this._super();
		if (this.noPostsPage)
			this.noPostsPage.destroy();
		this.vc.queue.removeListener(this.queueChanged);
		this.vc.listener.unlisten("post:updated", this.postUpdated);
	},
	
	onPopupHide: function() {
		this.checkIfHasToGoBackToClosestScreenWithUnreadPostsIfNoUnreadPostsHere();	
	},
	
	checkIfHasToGoBackToClosestScreenWithUnreadPostsIfNoUnreadPostsHere: function() {
		if ( this.vc.currentScreen instanceof Screen.Main )
			return;
		(this.feed || this.folder).countUnread(this.goBackToClosestScreenWithUnreadPostsIfNoUnreadPostsHere);
	},
	
	goBackToClosestScreenWithUnreadPostsIfNoUnreadPostsHere: function(unread) {
		if (unread)
			return;
		this.vc.popScreen(this.checkIfHasToGoBackToClosestScreenWithUnreadPostsIfNoUnreadPostsHere);
	},
	
	feedUpdated: function() {
		
	},
	
	postUpdated: function(e) {
		if ( ! this.removeReadPosts )
			return;
		
		var item;
		if (e.post)
			item = this.items[e.post];
		else
			item = e;
		$(item.element).remove();
		item.destroy();
		
		delete this.items[e.post];
	},
	
	setPosts: function(posts) {
		this.stopScreenLoading();
		
		this.items = {};
		this.itemsOrdered = [];
		this.vc.history.reset();

		posts.forEach(this.addPost);

		if ( ! posts.length ) {
			this.showNoPostsPage();
			this.toggleShowMore();
		}
		
		fireCallback(this.onSetPostsDone, posts);
	},
	
	addPost: function(post) {
		var item = this.template.addItem('posts', post);
		this.items[post.id] = item;
		this.itemsOrdered.push(item);
		this.vc.history.addAction(post);

		if ( this.vc.queue.contains(post.id) )
			item.element.classList.add('queued');

		this.toggleShowMore();
	},
	
	addPosts: function(posts, feed, callback) {
		this.template.el('.load-more').removeClass("loading");
		posts.forEach(this.addPost);
		fireCallback(callback);
	},
	
	showNoPostsPage: function() {
		this.noPostsPage = new Screen.NoPosts();
		this.template.container.appendChild(this.noPostsPage.template.container);
	},
	
	gotoPage: function(e) {
		if ( $(e.target).closest('.tpl-count-group, .back').length )
			return;
		
		UI.openTab(this.feed.link);
	},
	
	postClicked: function(e) {
		if ( $(e.target).closest('.tpl-count-group, .flerp, .tpl-drawer-menu, .item-starred').length )
			return;
		
		var post = e.item.model;
		
		// Queue post?
		if ( e.ctrlKey || e.metaKey || (e.which == 2 && ! Ext.isOnline()) ) {
			post.markAsRead();
			this.vc.queue.toggle(post.id);
			return;
		}

		this.gotoPost(post);
	},

	mousedownOnPost: function(e) {
		if (e.which == 2 && ! Ext.isOnline()) {
			e.preventDefault();
			e.stopPropagation();
			this.postClicked(e);
		}
	},

	gotoPost: function(post) {
		// If a link is pressed with a queue, add that and pump all
		if ( ! this.vc.queue.isEmpty() ) {
			post.markAsRead();
			this.vc.queue.add(post.id);
			this.vc.queue.pump();
			return;
		}
		
		this.rememberScreen(post.id);
		this.vc.history.setActiveAction(post);
			
		post.markAsRead(this.checkUnread);
		
		if ( typeof window.parent.onGotoPost !== "function" ) {
			if ( Ext.isMobile()) {
				this.vc.pushScreen(new Screen.Consume(post));
			} else {
				if ( app.user.preferences.get('global:openPostsInNewTab') )
					UI.openTab(post.getLink());
				else {
					UI.currentTab(function(tab) {
						UI.tabChangeURL(tab.id, post.getLink());
					});
				}
			}
		} else {
			window.parent.onGotoPost(post);
		}
	},
	
	checkUnread: function() {
	
	},
	
	markAsRead: function(e) {
		e.item.model.markAsRead();
		this.cancelEdit(e);
	},
	
	markAsUnread: function(e) {
		e.item.model.markAsUnread();
		this.cancelEdit(e);
	},
	
	toggleStar: function(e) {
		e.item.model.toggleStar();
		this.cancelEdit(e);
	},
	
	toggleStarFromItem: function(e) {
		this.toggleStar(e);
	},
	
	markAllAsRead: function(e) {
		this.feed.markAllAsRead();
	},
	
	rememberScreen: function(postId) {
		if ( this.feed.hasUnread(postId) )
			this.vc.storeScreenChain();
		else
			this.vc.forgetScreenChain();
	},
	
	queueChanged: function(id, isNew) {
		TRYIT(function() {
			if ( ! this.items[id] )
				return;
			this.items[id].element.classList[isNew ? 'add' : 'remove']('queued');
		}, this);
	},
	
	openFlerp: function(e) {
		$(e.target).closest('.tpl-list-item-post').addClass('opened');
	},
	
	cancelEdit: function(e) {
		$(e.target).closest('.tpl-list-item-post').removeClass('opened');
	},
	
	toggleRead: function(e) {
		var post = e.item.model;
		if (post.is_read)
			post.markAsUnread();
		else
			post.markAsRead();
	},
	
	openAllUnread: function() {
		this.feed.unreadPosts(function(posts) {
			app.ui.openMany(posts);
		});
	},
	
	loadMoreClicked: function(e) {
		e.preventDefault();
		this.loadMore();
	},

	loadMore: function(callback) {
		if ( ! this.hasMore() )
			return fireCallback(callback);

		this.template.el('.load-more').addClass("loading");
		
		this.offset += this.feed.getNumPosts();
		this.feed.fetchMorePosts(this.addPosts.withCallback(callback));
	},

	loadMoreForActions: function() {
		if ( ! this.hasMore() )
			return;

		this.loadMore(this.vc.historyNext);
	},
	
	toggleShowMore: function() {
		this.template.el('.load-more')[this.hasMore() ? 'show' : 'hide']();
	},
	
	hasMore: function() {
		return this.feed.hasMore(this.offset);
	},

	getFeed: function() {
		return this.feed;
	},

	navigateTo: function(post) {
		this.setCurrentNavFromPost(post);
		this.gotoPost(post);
	},

	setMoreAvailable: function(num) {
		var moreAvailable = this.template.el('.x-more-available');
		if (num == 0) {
			moreAvailable.hide();
		}  else {
			moreAvailable.show();
			moreAvailable.find('.num').text(num);

			if (num != 1) {
				moreAvailable.find('.multiple').css('display', 'inline');
			} else {
				moreAvailable.find('.multiple').css('display', 'none');
			}
		}

		moreAvailable.data('total-available', num);
	},

	addMoreAvailable: function() {
		var current = this.template.el('.x-more-available').data('total-available') || 0;
		this.setMoreAvailable(current + 1);
	},

	setCurrentNavFromPost: function(post) {
		var index = false;
		for ( var i = 0, item; item = this.itemsOrdered[i]; i++ ) {
			if (item.model.id === post.id) {
				index = i;
				break;
			}
		}

		if (this.itemsOrdered[this.currentHighlightedIndex])
			this.itemsOrdered[this.currentHighlightedIndex].element.classList.remove("active-highlighted");

		this.currentHighlightedIndex = index;

		var currentElement = this.itemsOrdered[this.currentHighlightedIndex];

		if (currentElement)
			currentElement.element.classList.add("active-highlighted");

		currentElement.element.scrollIntoViewSmart();
	},

	moreAvailableClicked: function(e) {
		e.preventDefault();
		if (typeof this.forceReload === "function")
			this.forceReload();
	},
	
	id: function() {
		if ( ! this.feed.id )
			return false;
		return {id: 'Posts', feed: this.feed.id};
	}
});

Screen.Posts.fromId = function(id) {
	var feed = app.user.feed(id.feed);
	if ( ! feed )
		return;
	return new Screen.Posts(feed, false, {active: id.active});
};