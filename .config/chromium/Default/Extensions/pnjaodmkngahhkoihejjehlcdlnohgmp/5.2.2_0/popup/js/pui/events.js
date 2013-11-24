PUI.Events = Class.extend({
	initialize: function(baseElement, callbackObject) {
		this.element = baseElement;
		this.callbackObject = callbackObject;
	},
	
	add: function(key, method) {
		var events = {};
		if ( typeof key === "object" )
			events = key;
		else
			events[key] = method;

		for ( var key in events ) if ( events.hasOwnProperty(key) )
			this.addEvent(key, events[key]);
	},
	
	addEvent: function(key, method) {
		var selector = key.split(" ");
		var type = selector.shift();
		selector = selector.join(" ");
		
		var el = $(this.element);

		var metaObj = {};

		if (type === "click-or-touch") {
			type = Ext.isMobile() ? "touchend" : "click";

			if (Ext.isMobile()) {
				var checkDragFunc = function() {
					$(window).on("touchmove", onMove).on("touchend", onEnd).on("scroll", onEnd);

					function onMove() { PUI.Events.metaObj.abort = true; }
					function onEnd() { $(window).off("touchmove", onMove).off("touchend", onEnd); }
				};

				bindFunc("touchstart", checkDragFunc);
			}
		}

		var func = this.delegateEventFor(this.callbackObject[method], method, type, metaObj);

		bindFunc(type, func);

		function bindFunc(type, fun) {
			if ( ! selector )
				el.on(type, fun);
			else
				el.on(type, selector, fun);
		}
	},
	
	delegateEventFor: function(method, key, type, metaObj) {
		if ( typeof method !== 'function' )
			throw new Error("event callback method not found: " + key);
		
		return function(e) {
			if (type === "click" || type === "touchend") {
				e.preventDefault();
			}

			if (PUI.Events.metaObj.abort === true) {
				e.stopPropagation();
				PUI.Events.metaObj.abort = false;
				return;
			}

			e.item = this.fetchDataStoreFromEvent(e);
			if (e.originalEvent && e.originalEvent.detail ) {
				for (var key in e.originalEvent.detail ) if (e.originalEvent.detail.hasOwnProperty(key)) {
					e[key] = e.originalEvent.detail[key];
				}
			}
			method(e);
		}.bind(this);
	},
	
	fetchDataStoreFromEvent: function(e) {
		var element = e.target;
		
		do {
			if ( element.store )
				return element.store;
		} while (element = element.parentElement);
		
		// Assume base store?
		return this.callbackObject.template.data;
	}
});

PUI.Events.metaObj = {};