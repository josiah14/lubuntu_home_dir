Screen.RemoveSync = Controller.extend({
	template: 'screen#remove-sync',
	
	events: {
		'click .done': 'done',
		'click .info-link': 'openLink'
	},

	openLink: function(e) {
		UI.openTab(e.currentTarget.href);
	},
	
	start: function() {
		this.template.set('title', _('Removing Google Reader sync'));
		app.events.subscribe("unsync:status", this.setStatus);
		
		this.container = this.template.element.find('.remove-sync');
		this.list = this.template.element.find('.bad-feeds');
		this.withBadFeeds = this.template.element.find('.with-bad-feeds');
		this.doneButton = this.template.element.find('.done');
		
		this.doneButton.css('visibility', 'hidden');
		this.list.hide();
		this.withBadFeeds.hide();
	},
	
	destroy: function() {
		this._super();
		app.events.unsubscribe("unsync:status", this.setStatus);
	},
	
	setStatus: function(evt) {
		this.template.set('title', evt.text);
	},
	
	doneLoading: function() {
		this.doneButton.css('visibility', 'visible');	
		this.container.removeClass('loading');
	},

	setBadFeeds: function(feeds) {
		feeds.forEach(this.setItem);
		
		this.withBadFeeds.show();
		this.list.show();
	},
	
	setItem: function(feed) {
		this.template.addItem('bad-feeds', {
			title: feed.title,
			link: feed.path
		});
	},
	
	done: function() {
		this.vc.popScreen();
	}
});
