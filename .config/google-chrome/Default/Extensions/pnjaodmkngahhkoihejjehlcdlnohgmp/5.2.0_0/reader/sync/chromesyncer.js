var ChromeSyncer = Syncer.extend({
	startListening: function() {
		this._super.apply(this, arguments);
		
		chrome.storage.onChanged.addListener(this.onChanged);
	},
	
	destroy: function() {
		this._super.apply(this, arguments);
		chrome.storage.onChanged.removeListener(this.onChanged);
	},
	
	onChanged: function(changes, namespace) {
		console.log("CHANGED DETECTED", arguments);
		
		if ( changes.preferences )
			this.loadPreferencesFromState({preferences: changes.preferences.newValue});
	},
	
	processFeed: function(feed, callback) { fireCallback(callback); },
	
	preferencesChanged: function(callback) {
		this.pushUpdatesTo(['preferences']);
		fireCallback(callback);
	},
	
	feedAdded: function(evt, callback) {
		fireCallback(callback);
	},
	
	feedUpdated: function(evt, callback) {
		fireCallback(callback);
	},
	
	feedRemoved: function(evt, callback) {
		fireCallback(callback);
	},
	
	postUpdated: function(evt, callback) { fireCallback(callback); },
	
	folderUpdated: function(evt, callback) {
		fireCallback(callback);
	},
	
	folderAdded: function(evt, callback) {
		fireCallback(callback);
	},
	
	folderRemoved: function(evt, callback) {
		this.pushUpdatesTo(['folders']);
		fireCallback(callback);
	},
	
	fetchUpstream: function(callback) {
		chrome.storage.sync.get(this.gotLatest.withCallback(callback));
	},
	
	gotLatest: function(state, callback) {
		// update preferences
		chain(this.loadPreferencesFromState, state)
		.end(callback || function() {});
	},
	
	loadPreferencesFromState: function(state, callback) {
		if ( ! state.preferences )
			return fireCallback(callback);
		
		for ( var key in state.preferences ) if ( state.preferences.hasOwnProperty(key) )
			localStorage[key] = state.preferences[key];
		
		fireCallback(callback);
	},
	
	pushUp: function(order, callback) {
		chrome.storage.sync.set(this.serializeState(), function() {
			fireCallback(callback);
		});
	},
	
	serializeState: function(callback) {
		this.state = {};
		this.state.preferences = this.serializePreferences();
		return this.state;
	},
	
	serializePreferences: function() {
		return app.user.preferences.getAll();
	},
	
	pushUpdatesTo: function(keys) {
		this.recentlyPushedUpdates = keys;
		
		var state = this.serializeState();
		
		var update = {};
		keys.forEach(function(key) {
			if ( state[key] )
				update[key] = state[key];
		});
		
		if ( Object.keys(update).length === 0 )
			return;
		
		chrome.storage.sync.set(update);
	}
});
