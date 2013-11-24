PlatformEnv.chrome = PlatformEnv.extend({
	DBAdapter: 'WebSQLDatabase',
	
	initialize: function() {
		this._super();
	},
	
	onBackgroundConnect: function(callback) {
		var boundCallback = this.makeCallback('connect', callback, function(port) {
			callback(new PlatformPort.chrome(port));
		});
		
		chrome.extension.onConnect.addListener(boundCallback);
	},
	
	removeOnBackgroundConnect: function(originalCallback) {
		var wrappedCallback = this.getCallback('connect', originalCallback);
		this.removeCallback('connect', wrappedCallback);
		chrome.extension.onConnect.removeListener(wrappedCallback);
	},
	
	onMessage: function(callback) {
		var boundCallback = this.makeCallback('message', callback, function(msg, sender) {
			callback(msg, sender);
		});
		
		chrome.extension.onRequest.addListener(boundCallback);
	},
	
	removeOnMessage: function(callback) {
		var wrappedCallback = this.getCallback('message', callback);
		this.removeCallback('message', wrappedCallback);
		chrome.extension.onRequest.removeListener(wrappedCallback);
	},
	
	onPopoverVisible: function(callback) {},
	removePopoverVisible: function(callback) {}
});

PlatformPort.chrome = Class.extend({
	initialize: function(port) {
		this.port = port || chrome.extension.connect();
	},
	
	onMessage: function(callback) {
		this.port.onMessage.addListener(function(message) {
			callback(message);
		});
	},
	
	onDisconnect: function(callback) {
		var port = this;
		this.port.onDisconnect.addListener(function() {
			callback(port);
		});
	},
	
	postMessage: function(message) {
		this.port.postMessage(message);
	},
	
	disconnect: function() {
		this.port.disconnect();
	}
});