var Platform = new (Class.extend({
	initialize: function() {
		if ( Ext.isChrome() )
			this.name = 'chrome';
		else if ( Ext.isSafari() )
			this.name = 'safari';
		else if ( Ext.isOnline() )
			this.name = 'online';
		this.loadCallbacks = [];
	},
	
	load: function(callback) {
		callback();
	}
}));

var PlatformEnv = Class.extend({
	initialize: function() {
		this.connectEvents = [];
		this.messageEvents = [];
	},
	
	onBackgroundConnect: function() { throw "implement PlatformEnv.onBackgroundConnect"; },
	
	connectToBackground: function() {
		return new (PlatformPort[Platform.name])();
	},
	
	makeCallback: function(type, originalCallback, callback) {
		callback['_' + type + 'originalCallback'] = originalCallback;
		this[type + 'Events'].push(callback);
		return callback;
	},
	
	getCallback: function(type, originalCallback) {
		var callbacks = this[type + 'Events'];
		for ( var i = 0, callback; callback = callbacks[i]; i++ )
			if ( callback['_' + type + 'originalCallback'] === originalCallback )
				return callback;
		return false;
	},
	
	fireCallback: function(type, args) {
		var callbacks = this[type + 'Events'];
		for ( var i = 0, callback; callback = callbacks[i]; i++ )
			callback.apply(this, args);
	},
	
	removeCallback: function(type, callback) {
		this[type + 'Events'].remove(callback);
	}
});

// Platform agnostic version of the chrome Port, created by chrome.extension.connect
var PlatformPort = Class.extend({
	postMessage: function(message) { throw "implement PlatformPort.postMessage"; },
	onMessage: function(callback) { throw "implement PlatformPort.onMessage"; },
	onDisconnect: function(callback) { throw "implement PlatformPort.onDisconnect"; },
	disconnect: function() { throw "implement PlatformPort.disconnect"; }
});

var UI = {};