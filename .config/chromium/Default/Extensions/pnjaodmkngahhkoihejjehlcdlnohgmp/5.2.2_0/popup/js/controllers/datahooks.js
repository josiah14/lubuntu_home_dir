dataHook('count .tpl-count-group .count', function(count, element) {
	if ( ! count )
		$(element).closest('.tpl-count-group').hide();
	else
		$(element).closest('.tpl-count-group').show();
	
	$(element).closest('.list-item')[!count ? 'removeClass' : 'addClass']('has-unread');
});

dataHook('starred .item', function(starred, element) {
	$(element)[starred ? 'addClass' : 'removeClass']('is-starred');
});

translateHook('post', function(post, callback) {
	callback({
		title: post.title,
		link: post.link,
		count: post.is_read ? "" : _("NEW"),
		starred: post.is_starred,
		favicon: app.user.feed(post.feed_id) ? app.user.feed(post.feed_id).favicon : app.config.defaultFavicon()
	});
});

translateHook('feed', function(feed, callback) {
	var data = {
		title: feed.title || "error",
		favicon: feed.favicon || "",
		link: feed.link || "",
		count: 0
	};
	
	if (feed.isStale)
		return callback(data);
	
	chain(feed.countUnread)
	.then(function(unread) {
		data.count = unread;
		callback(data);
	});
});

translateHook('folder', function(folder, callback) {
	chain(folder.countUnread)
	.then(function(unread) {
		callback({
			folder: folder,
			title: folder.name,
			favicon: app.config.images.folder,
			count: unread
		});
	});
});