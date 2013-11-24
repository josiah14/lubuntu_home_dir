Screen.SyncSelect = Controller.extend({
	template: 'screen#feeds-sync-select',
	
	events: {
		
	},
	
	start: function() {
		this.template.set('title', _('Syncing...'));
		app.events.subscribe("syncsetup:status", this.setStatus);
		
		this.merge();
	},

	destroy: function() {
		this._super();
		app.events.unsubscribe("syncsetup:status", this.setStatus);
	},
	
	checkResults: function(container, callback) {
		if ( container.nestedFolders.length > 0 ) {
			PUI.alert(_("Whoa!\n\nWe noticed that you have folders that contain other folders. Google Reader does not support this.\n\nSo we flattened your folders a bit. Sorry about this."))
			.ok(callback);
		} else
			callback();
	},
	
	merge: function() {
		this.showLoading();
		
		var googleSync = app.sync.addGoogle();
		
		chain(app.sync.push, googleSync)
		.then(this.checkResults)
		.and(googleSync.install)
		.and(app.poller.forceUpdate)
		.end(this.mergeDone);
	},
	
	mergeDone: function() {
		this.hideLoading();
		var googleSync = app.sync.get("google");
		if ( googleSync.badFeeds.length ) {
			PUI.alert("Something went wrong with " + googleSync.badFeeds.length + " feeds");
			return;
		}
		this.vc.toHome();
	},
		
	showLoading: function() {
		this.template.element.find('form').addClass("loading");
	},
	
	hideLoading: function() {
		this.template.element.find('form').removeClass("loading");
	},
	
	setStatus: function(evt) {
		this.template.set('title', evt.text);
	}
});
