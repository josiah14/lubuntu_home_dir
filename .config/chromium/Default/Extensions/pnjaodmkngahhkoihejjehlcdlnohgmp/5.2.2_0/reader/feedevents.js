var FeedEvents = Class.extend({
	initialize: function() {
		this.ports = [];
		
		Platform.env.onBackgroundConnect(this.portConnected);
		Platform.env.onMessage(this.onMessage);
	},
	
	destroy: function(callback) {
		Platform.env.removeOnBackgroundConnect(this.portConnected);
		Platform.env.removeOnMessage(this.onMessage);
		fireCallback(callback);
	},
	
	send: function(type, msg, force) {
		msg = msg || {};
		msg.name = type;

		if ( this.queue && ! force ) {
			this.queue.push(msg);
			return;
		}
		
		for ( var i = 0, port; port = this.ports[i]; i++ )
			port.postMessage(msg);
	},
	
	sendForced: function(type, msg) {
		this.send(type, msg, true);
	},
	
	portConnected: function(port) {
		this.ports.push(port);
		port.onDisconnect(this.portDisconnected);
	},
	
	portDisconnected: function(port) {
		this.ports.remove(port);
	},
	
	onMessage: function(msg, sender) {
		msg.tab = sender.tab.id;
		this.send(msg.type, msg);
	},
	
	subscribe: function(name, callback) {
		var fakePort = {
			name: name,
			callback: callback,
			postMessage: function(msg) {
				if ( msg.name !== name )
					return;
				callback(msg);
			}
		};
		this.ports.push(fakePort);
		return fakePort;
	},
	
	unsubscribe: function(name, callback) {
		for ( var i = 0, port; port = this.ports[i]; i++ ) {
			if ( port.name == name && port.callback == callback )
				this.ports.remove(port);
		}
	},
	
	hold: function() {
		this.queue = [];
	},
	
	release: function() {
		var queue = this.queue;
		this.queue = false;
		
		// Unique queue so we only send the same message once
		// this probably won't do anything right now
		// so
		// TODO: FIXME:
		//queue = queue.unique();
		
		for (var i = 0, msg; msg = queue[i]; i++) {
			this.send(msg.name, msg);
		}
	}
});
