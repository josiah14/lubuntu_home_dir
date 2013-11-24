PlatformEnv.online = PlatformEnv.extend({
	DBAdapter: 'APIDatabase',
	
	initialize: function() {
		this._super();
	},
	
	onBackgroundConnect: function(callback) {
		this.makeCallback('connect', callback, function(port) {
			callback(port);
		});
	},
	
	removeOnBackgroundConnect: function(originalCallback) {
		var wrappedCallback = this.getCallback('connect', originalCallback);
		this.removeCallback('connect', wrappedCallback);
	},
	
	onMessage: function(callback) {
		this.makeCallback('message', callback, function(message, sender) {
			callback(message, sender);
		});
	},
	
	removeOnMessage: function(originalCallback) {
		var wrappedCallback = this.getCallback('message', originalCallback);
		this.removeCallback('message', wrappedCallback);
	},
	
	onPopoverVisible: function(callback) {},
	removePopoverVisible: function(callback) {}
});

PlatformPort.online = Class.extend({
	initialize: function() {
		this.messageListeners = [];
		this.disconnectListeners = [];
		Platform.env.fireCallback('connect', [this]);
	},
	
	onMessage: function(callback) {
		this.messageListeners.push(callback);
	},
	
	onDisconnect: function(callback) {
		this.disconnectListeners.push(callback);
	},
	
	postMessage: function(message) {
		for ( var i = 0, callback; callback = this.messageListeners[i]; i++ )
			callback(message, this);
	},
	
	disconnect: function() {
		for ( var i = 0, callback; callback = this.disconnectListeners[i]; i++ )
			callback();
	}
});
