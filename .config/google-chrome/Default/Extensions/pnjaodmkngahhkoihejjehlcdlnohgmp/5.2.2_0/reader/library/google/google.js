var Google = new (Class.extend({
	path: 'https://www.google.com/reader',
	client: 'feeder.co',
	source: 'Rootof -feeder.co-4.0',
	
	tokenURL: '/api/0/token',
	userInfoURL: '/api/0/user-info',
	feedLoadURL: '/api/0/stream/contents/$streamId?n=30',
	listSubscriptionsURL: '/api/0/subscription/list',
	listTagsURL: '/api/0/tag/list',
	quickAddURL: '/api/0/subscription/quickadd',
	orderPreferenceURL: '/api/0/preference/stream/list',
	postEditURL: '/api/0/stream/items/edit',
	editTagURL: '/api/0/edit-tag',
	markAllAsReadURL: '/api/0/mark-all-as-read',
	editFeedURL: '/api/0/subscription/edit',
	disableTagURL: '/api/0/disable-tag',
	renameTagURL: '/api/0/rename-tag',
	setStreamPreferenceURL: '/api/0/preference/stream/set',
	
	tags: {
		read: "user/-/state/com.google/read",
		unread: "user/-/state/com.google/kept-unread",
		starred: "user/-/state/com.google/starred",
		like: "user/-/state/com.google/like",
		label: "user/-/label/",
		fresh: "user/-/state/com.google/fresh",
		share: "user/-/state/com.google/broadcast",
		readingList: "user/-/state/com.google/reading-list"
	},
	
	categories: {
		root: 'user/-/state/com.google/root'
	},
	
	initialize: function() {
		this.userId = '-';
		this.subscription = {};
		this.unsyncedFolders = [];
	},
	
	ensureUser: function(callback) {
		this.isLoggedIn({
			yes: function() {
				callback(true);
			},
			no: function() {
				Google.authenticate(callback);
			}
		});
	},
	
	// Open the OAuth2 popup and wait for the signal from the contentscript
	authenticate: function(callback) {
		this._authCallback = callback;
		app.events.subscribe("google:auth", this._authReturn);
		
		var url = GoogleOAuth2.requestAuthURL();
		
		UI.addGoogleReaderContentScript();
		
		// Open auth dialog
		if ( Ext.isSafari() ) {
			UI.openTab(url);
			UI.closePopup();
		}
		else
			UI.openPopup(url);
	},
	
	_authReturn: function(evt) {
		UI.removeGoogleReaderContentScript();
		
		if ( Ext.isSafari() )
			UI.showPopup();
		
		UI.closeTab(evt.tab);
		
		app.events.unsubscribe("google:auth", this._authReturn);
		var callback = this._authCallback;
		
		if ( ! evt.title.contains("code=") )
			return callback(false);
		
		GoogleOAuth2.code = evt.title.replace(/.*code=/, '');
		
		chain(GoogleOAuth2.verifyCode)
		.and(this.fetchSelf)
		.end(callback, true);
	},

	// Check if user is logged in to Google Reader
	// does this by attempting a request to user-info
	isLoggedIn: function(callbacks) {
		callbacks.yes = callbacks.yes || function() {};
		callbacks.no = callbacks.no || function() {};

		GoogleOAuth2.checkToken(function(success) {
			if (success) {
				chain(Google.fetchSelf)
				.end(callbacks.yes);
			} else
				callbacks.no();
		});
	},
		
	fetchSelf: function(callback) {
		return new Google.Request({
			url: Google.userInfoURL,
			onComplete: this._fetchSelfComplete.withCallback(callback)
		}).start();
	},
	
	_fetchSelfComplete: function(data, status, goog, callback) {
		this.userId = data.userId;
		this.userProfileId = data.userProfileId;
		this.profileData = data;
		
		fireCallback(callback);
	},
	
	// Fetch all the users feeds in a nice standard format
	fetchFeeds: function(callback) {
		return new Google.Request({
			url: Google.listSubscriptionsURL,
			type: 'json',
			params: {
				get: {output: 'json'}
			},
			onComplete: this._fetchFeedsComplete.withCallback(callback)
		}).start();
	},
	
	_fetchFeedsComplete: function(data, status, req, callback) {
		this.subscription = {
			feeds: [],
			categories: []
		};
		

		if ( ! data )
			return callback(false);
		
		// data = {
		// 	subscriptions: [{feed}, {feed}]
		// }
		//
		// feed = {
		// 	id, title, categories = [{category}], sortid, firstitemmsec, htmlUrl	
		// }
		//
		// category = { id, label }
		
		if ( ! data.subscriptions || data.subscriptions.constructor !== Array )
			return callback(false);
		
		this.foundCategories = {};
		
		// Go through each subscription (feed) and
		// make a copy of the data, just to make it "safer"
		data.subscriptions.forEach(this._copySubscription);
		
		var sub = this.subscription;
		
		chain(this.fetchTags)
		.and(this.fetchOrder)
		.then(function() {
			callback(sub);
		});
	},
	
	_copySubscription: function(sub) {
		// Make the copy, with categories intact
		this.subscription.feeds.push({
			id: sub.id,
			title: sub.title,
			sortid: sub.sortid,
			firstitemmsec: sub.firstitemmsec,
			htmlUrl: sub.htmlUrl,
			href: this.unFeedStream(sub.id),
			categories: sub.categories,
			isFeed: true
		});
		
		// Get categories and don't add the same category twice
		sub.categories.forEach(this._copyCategory);
	},
	
	_copyCategory: function(category) {
		if ( this.foundCategories[category.id] )
			return;
		
		// Mark the category as found
		this.foundCategories[category.id] = true;
		
		// "Copy" it
		this.subscription.categories.push({
			id: category.id,
			label: category.label,
			isCategory: true
		});
	},
	
	// Fetch "tags" (categories and more)
	fetchTags: function(callback) {
		return new Google.Request({
			url: Google.listTagsURL,
			type: 'json',
			params: {
				get: {output: 'json'}
			},
			onComplete: this._fetchTagsComplete.withCallback(callback)
		}).start();
	},
	
	_fetchTagsComplete: function(data, status, goog, callback) {
		(data.tags || []).forEach(this._fetchSortidFromTag);
		callback(this.subscription);
	},
	
	_fetchSortidFromTag: function(tag) {
		this.subscription.categories.forEach(function(cat) {
			if ( cat.id === tag.id )
				cat.sortid = tag.sortid;
		});
	},
	
	// Fetch order preferences
	fetchOrder: function(callback) {
		return new Google.Request({
			url: Google.orderPreferenceURL,
			type: 'json',
			params: {
				get: {output: 'json'}
			},
			onComplete: this._fetchOrderComplete.withCallback(callback)
		}).start();
	},
	
	_fetchOrderComplete: function(data, status, req, callback) {
		// returns a couple of structures relating to sorting of feeds
		// data.streamprefs["user/%d/state/com.google/root"]
		streamprefs = this._transformUserIds(data.streamprefs);
		
		var keys = Object.keys(streamprefs);
		
		var usid = this.genericUserStreamId();
		keys = keys.filter(function(key) {
			return key.indexOf(usid) === 0; 
		});
		
		// keys now contains the root folder and other folders
		// start by sorting root category
		var root = this._applySortOrder(streamprefs[usid + '/state/com.google/root'], false, true);
		
		var categories = this.subscription.categories.map(function(cat) {
			return {order: this._applySortOrder(streamprefs[cat.id], cat.id), id: cat.id, label: cat.label, sortid: cat.sortid};
		}, this);
		
		this.subscription.order = {root: root, categories: categories};
		
		callback(this.subscription);
	},
	
	_transformUserIds: function(data) {
		var keys = Object.keys(data);
		var ret = {};
		keys.forEach(function(k) {
			ret[Google.toNiceStreamId(k)] = data[k];
		});
		return ret;
	},
	
	_applySortOrder: function(streamObject, categoryId, isRoot) {
		if ( ! streamObject && ! isRoot ) {
			// Make sure we have all feeds in this category, since if no sorting has been made, a sortid will not be present
			// in /api/0/preference/stream/list, so it's assumed to be alphabetical
			return this._makeSureAllFeedsAreInCategory([], categoryId);
		}
		
		// We can't just ignore the root folder, so create a fake streamObject
		if ( ! streamObject && isRoot )
			streamObject = [{id: "subscription-ordering", value: ""}];
		
		var sortString = streamObject.filter(function(obj) {
			return obj.id === "subscription-ordering";
		});
		sortString = sortString[0] ? sortString[0].value : "";
		
		if ( isRoot ) {
			sortString = this._addAllCategoriesToRoot(sortString);
			sortString = this._addAllFeedsToRoot(sortString);
		}
		
		sortString = this.splitSortString(sortString).unique().join("");
		
		var almostAll = this.splitSortString(sortString).map(function(sortId) {
			return this.bySortId(sortId, categoryId);
		}, this).filter(function(obj) {
			return !! obj;
		});
		
		return this._makeSureAllFeedsAreInCategory(almostAll, categoryId);
	},

	// Make sure all categories have a base in root, since there only is one level of categories in Google Reader
	_addAllCategoriesToRoot: function(sortString) {
		var order = this.splitSortString(sortString);
		
		for ( var i = 0, cat; cat = this.subscription.categories[i]; i++ )
			if ( ! order.contains(cat.sortid) )
				order.push(cat.sortid)
		
		return order.join("");
	},
	
	// Add orphaned feeds to root folder
	_addAllFeedsToRoot: function(sortString) {
		var order = this.splitSortString(sortString);
		
		for ( var i = 0, subscription; subscription = this.subscription.feeds[i]; i++ ) {
			// Sortstrings are fucked up things. It sucks that we're relying on them so much.
			// A feed can be in many categories, but not a category and root at the same time
			// If a feed is in categories, but also said to be in root by the root sortstring
			// we remove it from the root sortstring, since that is how google reader deals with it
			// Deal with it.
			if ( subscription.categories.length && order.contains(subscription.sortid) ) {
				order.remove(subscription.sortid)
				continue;
			}
			
			if ( subscription.categories.length || order.contains(subscription.sortid) )
				continue;
			order.push(subscription.sortid);
		}
		
		return order.join("");
	},
	
	_makeSureAllFeedsAreInCategory: function(arr, categoryId) {
		// No categoryId specified, probably root, don't do anything
		if ( ! categoryId )
			return arr;
		
		for ( var i = 0, feed; feed = this.subscription.feeds[i]; i++ ) {
			if ( categoryHasFeed(feed) && ! arr.contains(feed) )
				arr.push(feed);
		}
		
		function categoryHasFeed(feed) {
			return feed.categories.some(function(cat) {
				return cat.id == categoryId;
			});
		}
		
		return arr;
	},
	
	bySortId: function(id, categoryId) {
		for ( var i = 0, feed; feed = this.subscription.feeds[i]; i++ ) {
			if ( feed.sortid === id ) {
				// Check that feed really is in that category, since sortid doesn't always update
				if ( categoryId && this.feedIsInCategory(feed, categoryId) )
					return feed;
				else if ( categoryId )
					return false;
				return feed;
			}
		}
		for ( var i = 0, category; category = this.subscription.categories[i]; i++ )
			if ( category.sortid === id )
				return category;
		return false;
	},
	
	feedIsInCategory: function(feed, categoryId) {
		return feed.categories.some(function(cat) {
			return cat.id == categoryId;
		});
	},
	
	// Add a feed
	addFeed: function(feed, callback) {
		return new Google.Request({
			url: Google.quickAddURL,
			method: 'POST',
			token: true,
			params: {
				post: {
					quickadd: feed.path
				}
			},
			onComplete: this._addFeedComplete.withCallback(callback)
		}).start();
	},
	
	_addFeedComplete: function(data, status, req, callback) {
		if ( ! data.streamId )
			return fireCallback(callback, false);
		
		// Mark all posts in this feed as read
		chain(this.markAllAsRead, data.streamId)
		.end(callback || function() {}, {streamId: data.streamId});
	},
	
	// Update a feed
	updateFeed: function(feed, callback) {
		return new Google.Request({
			url: Google.editFeedURL,
			method: 'POST',
			token: true,
			params: {
				post: {
					ac: 'edit',
					s: feed.guid,
					t: feed.title
				}
			},
			onComplete: function(data, status, req) {
				fireCallback(callback);
			}
		}).start();
	},
	
	// Remove a feed
	removeFeed: function(feedId, callback) {
		return new Google.Request({
			url: Google.editFeedURL,
			method: 'POST',
			token: true,
			params: {
				post: {
					s: feedId,
					ac: 'unsubscribe'
				}
			},
			onComplete: function() {
				fireCallback(callback);
			}
		}).start();
	},
	
	// Remove a folder
	removeFolder: function(folderId, callback) {
		return new Google.Request({
			url: Google.disableTagURL,
			method: 'POST',
			token: true,
			params: {
				post: {
					s: folderId
				}
			},
			onComplete: function() {
				fireCallback(callback);
			}
		}).start();
	},
	
	renameFolder: function(prev, current, callback) {
		return new Google.Request({
			url: Google.renameTagURL,
			method: 'POST',
			token: true,
			params: {
				post: {
					s: Google.toLabelName(prev),
					t: prev,
					dest: Google.toLabelName(current)
				}
			},
			onComplete: this._renameFolderComplete.andArguments(current, callback)
		}).start();
	},
	
	_renameFolderComplete: function(data, status, req, newName, callback) {
		this.pushFakeCategory(newName);
		this.fetchTags(callback);
	},
	
	// Update a post
	updatePost: function(post, callback) {
		var tags = [];
		
		if ( post.is_read )
			tags.push(Google.tags.read);
		if ( !post.is_read)
			tags.push(Google.tags.unread);
		if ( post.is_starred )
			tags.push(Google.tags.starred);
		
		return new Google.Request({
			url: Google.editTagURL,
			method: 'POST',
			token: true,
			params: {
				post: {
					a: tags,
					i: post.guid
				}
			},
			onComplete: function(data, status, req) {
				fireCallback(callback);
			}
		}).start();
	},
	
	// Add single tag to feed
	addTag: function(feedId, tagStreamName, callback) {
		return new Google.Request({
			url: Google.editFeedURL,
			method: 'POST',
			token: true,
			params: {
				post: {
					a: tagStreamName,
					s: feedId,
					ac: 'edit'
				}
			},
			onComplete: function(data, status, req) {
				fireCallback(callback);
			}
		}).start();
	},
	
	removeTag: function(feedId, tagStreamName, callback) {
		return new Google.Request({
			url: Google.editFeedURL,
			method: 'POST',
			token: true,
			params: {
				post: {
					r: tagStreamName,
					s: feedId,
					ac: 'edit'
				}
			},
			onComplete: function(data, status, req) {
				fireCallback(callback);
			}
		}).start();
	
	},
	
	updateOrder: function(sortstring, folderId, callback) {
		return new Google.Request({
			url: Google.setStreamPreferenceURL,
			method: 'POST',
			token: true,
			params: {
				post: {
					s: folderId,
					v: sortstring,
					k: "subscription-ordering"
				}
			},
			onComplete: function(data, status, req) {
				fireCallback(callback);
			}
		}).start();
	},
	
	markAllAsRead: function(streamId, callback) {
		return new Google.Request({
			url: Google.markAllAsReadURL,
			method: 'POST',
			token: true,
			params: {
				post: {
					s: streamId
				}
			},
			onComplete: function(data, status, req) {
				fireCallback(callback);
			}
		}).start();
	},

	markAllFeedsAsRead: function(callback) {
		return new Google.Request({
			url: Google.markAllAsReadURL,
			method: 'POST',
			token: true,
			params: {
				post: {
					s: Google.tags.readingList
				}
			}
		}).start();
	},

	// If a new empty folder is created, it cannot be created in Google Reader at the same time
	// therefor we have to keep a list of folders that are unsynced, and when a feed is added
	// to that folder, we fetch the tags again so we can get that folder's sortid.
	checkFolderSyncStatus: function(label, callback) {
		if ( ! this.unsyncedFolders.contains(label) )
			return fireCallback(callback);
		
		this.unsyncedFolders.remove(label);
		
		// Refetch tags
		this.pushFakeCategory(label);
		
		this.fetchTags(function() {
			callback();
		});
	},
	
	pushFakeCategory: function(label) {
		this.subscription.categories.push({
			id: this.toLabelName(label),
			label: label,
			isCategory: true
		});
	},
	
	// Data methods
	
	feedLoadPath: function(streamId) {
		return Google.path + Google.feedLoadURL.replace('$streamId', encodeURIComponent(streamId));
	},
	
	userStreamId: function() {
		return 'user/' + this.userId;
	},

	genericUserStreamId: function() {
		return 'user/-';
	},
	
	toNiceStreamId: function(id) {
		return id.replace(/user\/\d*\//, "user\/-\/");
	},
	
	toStreamId: function(id) {
		return id.replace(/user\/-\//, this.userStreamId() + "/");
	},
	
	toLabelName: function(label) {
		return this.userStreamId() + "/label/" + label.replace(/"|\^|<|>|\?|\&|\/|\,|\./g, '');
	},
	
	toFeedId: function(link) {
		return 'feed/' + link;
	},
	
	splitSortString: function(str) {
		return str.split(/(........)/).filter(function(a) {
			return !! a;
		});
	},
	
	unFeedStream: function(streamId) {
		return streamId.replace(/^(feed\/)/, '');
	},
	
	hasTag: function(tag, item) {
		tag = Google.tags[tag];
		return item.categories.map(this.toNiceStreamId).contains(tag);
	},
	
	sortIdFor: function(feed) {
		return (this.subscription.feeds.filter(function(sub) {
			return sub.id == feed;
		})[0] || {sortid: ""}).sortid;
	},
	
	sortIdForFolder: function(label) {
		var ret = (this.subscription.categories.filter(function(sub) {
			return sub.label == label;
		})[0] || {sortid: ""}).sortid;
		
		return ret;
	}
}));
