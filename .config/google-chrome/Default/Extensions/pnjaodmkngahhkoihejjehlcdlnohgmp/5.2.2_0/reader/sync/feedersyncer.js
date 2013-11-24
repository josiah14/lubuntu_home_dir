var FeederSyncer = Syncer.extend({
	startListening: function() {
		this._super.apply(this, arguments);
		
		app.events.subscribe("feeder:connect", this.receivedConnectRequest);
		app.events.subscribe("feeder:fetchFeeds", this.receivedFetchFeedsRequest);

		this.checkToken();
		
		if (Ext.isSafari())
			safari.extension.addContentScriptFromURL(Ext.path("content/feeder_api.js"), ["http://*.feeder.co/*"], [], true);
	},
	
	destroy: function() {
		this._super.apply(this, arguments);
		
		app.events.unsubscribe("feeder:connect", this.receivedConnectRequest);
		
		if (Ext.isSafari())
			safari.extension.removeContentScriptFromURL(Ext.path("content/feeder_api.js"));
	},
	
	uninstall: function(callback) {
		var oldToken = app.user.preferences.get("feeder:token");

		var removeTokenRequest = new Request({url: Config.feeder.destroyTokenURL, method: "POST"});
		removeTokenRequest.send({
			post: {
				client_id: app.user.preferences.get("client_id"),
				token: oldToken
			}
		});

		app.user.preferences.remove("feeder:token");
		app.user.preferences.remove("feeder:email");

		app.sync.removeSyncer("online");

		chain(app.user.moveToLocalDatabase)
		.and(app.user.reloadFeeds)
		.and(app.sync.reloadSyncers)
		.end(callback);
	},
	
	receivedConnectRequest: function(evt) {
		var connectURL = evt.connectURL;
		this.doMerge = evt.doMerge;

		var clientId = app.user.preferences.get("client_id");

		var req = new Request({
			url: connectURL,
			onComplete: this.connectRequestComplete.andArguments(evt.tab)
		});
		
		req.send({
			get: {
				client_id: clientId
			}
		});
	},
	
	connectRequestComplete: function(status, text, xml, tab) {
		var resp = tryToParseJSON(text);
		if ( ! resp || resp.error || ! resp.token )
			return alert(resp.error || "Could not connect to Feeder account");
		this.unconnectOtherServices();
		this.receivedToken(resp.token, resp.email);
		this.syncFeeds(this.connectDone.withArguments(tab, resp.redirect));
	},

	connectDone: function(tab, redirect) {
		UI.tabChangeURL(tab, redirect)
		app.events.send("feeder:connected");
	},
	
	receivedToken: function(token, email) {
		app.user.preferences.set("feeder:token", token);
		app.user.preferences.set("feeder:email", email);
	},
	
	checkToken: function(callback) {
		var token = app.user.preferences.get("feeder:token");
		var clientId = app.user.preferences.get("client_id");
		
		if ( ! token )
			return fireCallback(callback, false);
		
		var req = new Request({
			url: app.config.feeder.checkURL,
			onComplete: this.checkedToken.withCallback(callback)
		});
		
		req.send({
			get: {
				token: token,
				client_id: clientId
			}
		});
	},
	
	checkedToken: function(status, responseText, responseXML, callback) {
		var response = tryToParseJSON(responseText);
		if ( response && response.is_pro ) {
			app.user.preferences.set("feeder:email", response.email);
			fireCallback(callback, true);
			return;
		} else if ( response && response.no_pro_for_token ) {
			app.user.preferences.remove("feeder:token");
			app.user.switchToLocalDatabase();
			console.log(response, "indicated invalid feeder pro account");
		}
		app.events.send("feeder:connected");
		fireCallback(callback, false);
	},
	
	syncFeeds: function(callback) {
		var opml = ExportImport.Export.exportFeeds();
		var importer = new ExportImport.Import(opml);

		var unreads = ExportImport.Export.exportUnreads();

		chain(ExportImport.Export.exportUnreads)
		.thenSync(function(unreadContainer) {
			app.sync.get("feeder").unreadContainer = unreadContainer;
		})
		.and(app.user.moveToAPIDatabase)
		.and(app.sync.addOnline)
		.and(app.user.hasFeeds() && this.doMerge ? importer.load : function(next) { next(true); })
		.thenSync(function(success) {
			if ( ! success )
				alert("There was a problem syncing your feeds");
		})
		.and(this.doMerge ? this.syncUnreads : function(next) { next(true); })
		.thenSync(function(success) {
			if ( ! success )
				alert("There was a problem syncing your feeds")
		})
		.and(app.user.forceCountUnread)
		.end(callback);
	},
	
	unconnectOtherServices: function() {
		app.sync.unconnectSyncer("google");
	},

	syncUnreads: function(callback) {
		var data = this.unreadContainer.toJSON();

		// Reroute request to API
		var request = new Request({
			method: 'POST',
			url: OnlineSyncer.path('/api/sync-posts-of-interest.json'),
			onComplete: this.syncUnreadsComplete.withCallback(callback),
			addFeederAuthorization: true
		});
		
		request.send({post: {feeds: data}});
	},

	syncUnreadsComplete: function(status, text, xml, callback) {
		callback(status == 200);
	},

	processFeed: function(feed, callback) { fireCallback(callback); },
	preferencesChanged: function(callback) { fireCallback(callback); },
	feedAdded: function(evt, callback) { fireCallback(callback); },
	feedUpdated: function(evt, callback) { fireCallback(callback); },
	feedRemoved: function(evt, callback) { fireCallback(callback); },
	postUpdated: function(evt, callback) { fireCallback(callback); },
	folderUpdated: function(evt, callback) { fireCallback(callback); },
	folderAdded: function(evt, callback) { fireCallback(callback); },
	folderRemoved: function(evt, callback) { fireCallback(callback); },
	fetchUpstream: function(callback) { fireCallback(callback); },
	
	pushUp: function(order, callback) { fireCallback(callback); },

	getEmail: function() {
		return app.user.preferences.get("feeder:email");
	},

	receivedFetchFeedsRequest: function(evt) {
		var container = app.user.structure.base.toContainer().toJSON();
		app.events.send("feeder:feedsFetched", {feeds: container});
	}
});
