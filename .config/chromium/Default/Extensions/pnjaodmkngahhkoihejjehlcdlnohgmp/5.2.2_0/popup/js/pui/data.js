/*
	Class:
		Data
	
	Represent a data store for an element using a predefined set of standards.
*/

PUI.Data = Class.extend({
	initialize: function(vc, el) {
		this.vc = vc;
		
		this.variables = {};
		this.data = {};
		
		if ( el ) 
			this.addFromElement(el);
	},
	
	destroy: function() {
		if ( this.model )
			this.vc.listener.removeModelListener(this.model, this.modelChanged);
	},
	
	addFromElement: function(el) {
		this.element = el;
		el.store = this;
		
		var children = el.querySelectorAll('[data]');
		for ( var i = 0, child; child = children[i]; i++ )
			this.add(child);
	},
	
	add: function(el) {
		var dataStr = el.getAttribute("data").split(";");
		
		for ( var i = 0, str; str = dataStr[i]; i++ ) {
			var d = str.split(":");
			this.variables[d[0]] = {el: el, attr: d[1]};
		}
	},
	
	set: function(key, value) {
		// Store in "model" storage
		this.data[key] = value;
		
		var data = this.variables[key];
		if ( ! data )
			return;
		
		var element = data.el;
		if ( data.attr == "text" )
			element.innerText = value;
		else if ( data.attr == "html" )
			element.innerHTML = value;
		else if ( data.attr == "background-image" )
			element.style.backgroundImage = 'url(' + value + ')';
		else if ( data.attr == "src-on-load") {
			var setImageSrc = function() {
				var img = new Image();
				img.onload = function() {
					element.setAttribute("src", value);
				}
				img.src = value;
			}
			
			if ( Ext.isChrome() ) {
				if (window.isLoadedDone ) {
					element.setAttribute("src", value);
				} else if (window.isLoaded) {
					setTimeout(setImageSrc, 50);
				} else {
					window.addEventListener('load', function() {
						setTimeout(setImageSrc, 50);
					}, false);
				}
			} else {
				element.setAttribute("src", value);
			}
		} else
			element.setAttribute(data.attr, value);
	
		// Fire an event, natively, because it should be fast.
		var event = document.createEvent("HTMLEvents");
		event.initEvent("data:change", true, true);
		element.dispatchEvent(event);
		
		// Run hook
		this.runHook(element, key, value);
	},
	
	runHook: function(element, key, value) {
		// In some weird cases this can be the case in Safari
		// It caused the popup to not load
		if ( ! window.PUI )
			return;
		
		if ( ! PUI.DataHooks[key] )
			return;
		var el = $(element);
		PUI.DataHooks[key].forEach(function(hook) {
			if ( el.is(hook.selector) )
				hook.func(value, element);
		});
	},
	
	setModel: function(model, callback) {
		this.model = model;
		this.vc.listener.addModelListener(model, this.modelChanged);
		
		this.setFromModel(callback);
	},
	
	setFromModel: function(callback) {
		chain(toTemplate, this.model)
		.then(this.setMany)
		.end(callback || function() {});
	},

	setMany: function(items, callback) {
		// If it is a model object
		if ( items.model )
			return this.setModel(items, callback);
			
		// If an object with key/values
		for ( var key in items ) if ( items.hasOwnProperty(key) )
			this.set(key, items[key]);

		fireCallback(callback);
	},
	
	get: function(key) {
		return this.data[key];
	},
	
	modelChanged: function(model) {
		this.model = model;
		this.setFromModel();
	}
});

PUI.DataHooks = {};

function dataHook(hookStr, func) {
	var selector = hookStr.split(" ");
	var key = selector.shift();
	selector = selector.join(" ");
	
	if ( ! PUI.DataHooks[key] )
		PUI.DataHooks[key] = [];
	PUI.DataHooks[key].push({selector: selector, func: func});
};

PUI.TranslateHooks = {};

function translateHook(model, func) {
	PUI.TranslateHooks[model] = func;
};

function toTemplate(model, callback) {
	PUI.TranslateHooks[model.model](model, callback);
}