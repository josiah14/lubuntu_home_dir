PlatformEnv.safari = PlatformEnv.extend({
	DBAdapter: 'WebSQLDatabase',
	
	initialize: function() {
		this._super();
		this.popoverEvents = [];

		// If a content scripts sends a message with the name "connect"
		// We add that to a special array where we'll then send events to
		// using "dispatchMessage" when app.events.send() is called

		// So it creates a PlaformPort.safari port, which calls the onBackgroundConnect event listener
		// and then it knows how to send native events to that tab using that message
		safari.application.addEventListener('message', function(e) {
			if (e.name !== "connect")
				return;
			var msg = e.message;
			new (PlatformPort[Platform.name])(e.target, msg.type);
		}.bind(this));
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
		var boundCallback = this.makeCallback('message', callback, function(e) {
			var msg = e.message;
			msg.type = e.name;
			callback(msg, {tab: new Platform.env.OpaqueTab(e.target)});
		});
		
		safari.application.addEventListener("message", boundCallback, false);
	},
	
	removeOnMessage: function(callback) {
		var wrappedCallback = this.getCallback('message', callback);
		this.removeCallback('message', wrappedCallback);
		safari.application.removeEventListener("message", wrappedCallback, false);
	},
	
	onPopoverVisible: function(callback) {
		var boundCallback = this.makeCallback('popover', callback, function() {
			callback();
		});
		
		safari.application.addEventListener("popover", boundCallback, true);
	},
	
	removePopoverVisible: function(callback) {
		var wrappedCallback = this.getCallback('popver', callback);
		this.removeCallback('popover', wrappedCallback);
		safari.application.removeEventListener("popover", wrappedCallback, false);
	},
	
	OpaqueTab: Class.extend({
		initialize: function(tab) {
			UI.__ensureId(tab);
			this.id = tab.__feederId;
			this.__tab = tab;
		}
	}),
	
	safariSubmitFormFromPopup: function(form) {
		var formData = this._formToObject(form);
		var data = {data: formData, action: form.action};
		
		var pingBackCallback = function(e) {
			if ( e.name != "safari:popupFormSubmit:ping" )
				return;
			safari.application.removeEventListener("message", pingBackCallback);
			e.target.page.dispatchMessage("safari:popupFormSubmit:contents", data);
		};
		safari.application.addEventListener("message", pingBackCallback);
		UI.openTab(Ext.path("options/form.html"));
	},
	
	_formToObject: function(form) {
		var inps = form.querySelectorAll("input, select");
		var data = {};
		[].slice.call(inps).forEach(function(el) {
			data[el.name] = el.value;
		})
		return data;
	}
});



PlatformPort.safari = Class.extend({
	initialize: function(tab, type) {
		if (tab) {
			this.tab = tab;
			this.type = type;

			this.tab.addEventListener("close", this.disconnect, false);
			this.tab.addEventListener("navigate", this.addNavigateAwayEventListener, false);
		} else {
			this.messageListeners = [];
		}
		
		this.disconnectListeners = [];

		Platform.env.fireCallback('connect', [this]);
	},
	
	onMessage: function(callback) {
		if (this.tab)
			1;//throw "not supported for PlatformPort.env.safari: onMessage";
		else
			this.messageListeners.push(callback);
	},
	
	onDisconnect: function(callback) {
		this.disconnectListeners.push(callback);
	},
	
	postMessage: function(message) {
		if (this.tab) {
			if (message.name == this.type)
				this.tab.page.dispatchMessage(this.type, message);
		} else {
			for ( var i = 0, callback; callback = this.messageListeners[i]; i++ )
				callback(message, this);
		}
	},
	
	disconnect: function() {
		for ( var i = 0, callback; callback = this.disconnectListeners[i]; i++ )
			callback(this);

		if (this.tab) {
			this.tab.removeEventListener("close", this.disconnect, false);
			this.tab.removeEventListener("navigate", this.disconnect, false);
			this.tab.removeEventListener("navigate", this.addNavigateAwayEventListener, false);
		}
	},

	// An initial "navigate" event will be sent to this Port which is when the content script it originated from
	// has finished loading. So what we do is attach this method for the first navigate event, which adds the disconnect
	// event and removes this initial event
	addNavigateAwayEventListener: function(e) {
		this.tab.addEventListener("navigate", this.disconnect, false);
		this.tab.removeEventListener("navigate", this.addNavigateAwayEventListener, false);
	}
});
