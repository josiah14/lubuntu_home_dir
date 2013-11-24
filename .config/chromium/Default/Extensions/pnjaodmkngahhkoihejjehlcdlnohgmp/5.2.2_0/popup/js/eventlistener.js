var EventListener = Class.extend({
	initialize: function(element) {
		this.element = element;
		
		this.port = Platform.env.connectToBackground();
		this.port.onMessage(this.onMessage);
		
		this.listeners = {};
		this.simpleListeners = {};

		window.addEventListener('unload', this.onUnload, false);
	},
	
	onUnload: function() {
		this.port.disconnect();
		this.listeners = {};
		this.simpleListeners = {};
	},
	
	onMessage: function(evt) {
		if (this.disable)
			return;
		
		var method = evt.name.replace(/(:\w)/, function(a) { return a.charAt(1).toUpperCase() });
		
		this.fireSimpleEvent(evt.name, evt);
		
		// If don't support the event, abort
		if ( typeof this[method] !== "function" )
			return;
		
		var params = {};
		
		if ( evt.feed )
			params.feed = app.store.feed(evt.feed);
		
		if ( evt.folder )
			params.folder = app.store.folder(evt.folder);
				
		if ( evt.post )
			params.post = app.store.post(evt.post);

		this[method](params);
	},
	
	feedUpdated: function(evt) {
		this.fireEvent('feed', evt.feed);
	},
	
	feedAdded: function(evt) {
		
	},
	
	feedRemoved: function(evt) {
	
	},
	
	postUpdated: function(evt) {
		this.fireEvent('post', evt.post);
	},
	
	folderUpdated: function(evt) {
		this.fireEvent('folder', evt.folder);
	},
	
	listen: function(key, func) {
		if ( ! this.simpleListeners[key] )
			this.simpleListeners[key] = [];
	
		this.simpleListeners[key].push(func);
	},
	
	unlisten: function(key, func) {
		if (this.simpleListeners[key])
			this.simpleListeners[key].remove(func);
	},
	
	fireSimpleEvent: function(key, obj) {
		if ( ! this.simpleListeners[key] )
			return;

		this.simpleListeners[key].forEach(function(func) {
			func(obj);
		});
	},
	
	fireEvent: function(model, obj) {
		if ( ! this.listeners[model] || ! this.listeners[model][obj.id] )
			return;

		this.listeners[model][obj.id].forEach(function(func) {
			func(obj);
		});
	},
	
	addModelListener: function(model, func) {
		if ( ! this.listeners[model.model] )
			this.listeners[model.model] = {};
		if ( ! this.listeners[model.model][model.id] )
			this.listeners[model.model][model.id] = [];
	
		this.listeners[model.model][model.id].push(func);
	},
	
	removeModelListener: function(model, func) {
		if (!model)
			return;
		this.listeners[model.model][model.id].remove(func);
	},
	
	send: function(type, data) {
		if (typeof window.CustomEvent === 'undefined') {
			var event;
			if (document.createEvent) {
				event = document.createEvent("HTMLEvents");
				event.initEvent(type, true, true);
			} else {
				event = document.createEventObject();
				event.eventType = type;
			}

			event.eventName = type;
			for (var key in data) if (data.hasOwnProperty(key))
				event[key] = data[key];

			if (document.createEvent) {
				this.element.dispatchEvent(event);
			} else {
				this.element.fireEvent("on" + event.eventType, event);
			}
			return;
		}

		var event = new CustomEvent(type, data);
		event.initCustomEvent(type, true, true, data);
		this.element.dispatchEvent(event);
	}
});