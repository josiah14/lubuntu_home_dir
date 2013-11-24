PUI.LinkQueue = Class.extend({
	initialize: function(el) {
		this.element = $(el);
		
		this.closeElement = this.element.find('.close');
		this.numElement = this.element.find('.num');
		this.pluralElement = this.element.find('.one');
		
		this.queue = [];
		this.setCount();
		
		this.closeElement.on('click', this.closeClick);
		this.element.on('click', this.pump);
		
		this.listeners = [];
	},
	
	setListener: function(listener) {
		this.listeners.push(listener);
	},
	
	removeListener: function(listener) {
		this.listeners.remove(listener);
	},
	
	toggle: function(obj) {
		if ( this.queue.contains(obj) )
			return this.remove(obj);
		return this.add(obj);
	},
	
	add: function(obj) {
		if ( this.queue.contains(obj) )
			return;
		
		this.queue.push(obj);
		this.setCount();
		
		this.fireListener(obj, true);
		
		return true;
	},
	
	remove: function(obj) {
		this.queue.remove(obj);
		this.setCount();
		
		this.fireListener(obj, false);
		
		return false;
	},
	
	fireListener: function(obj, isNew) {
		this.listeners.forEach(function(listener) {
			fireCallback(listener, obj, isNew);
		});
	},
	
	setCount: function() {
		this.numElement.text(this.queue.length);
		
		if ( this.queue.length === 1 )
			this.pluralElement.hide();
		else
			this.pluralElement.show();
	
		if ( this.queue.length === 0 )
			this.element.hide();
		else
			this.element.show();
			
		$(document.body)[this.queue.length ? 'addClass' : 'removeClass']('in-queue');
	},
	
	contains: function(obj) {
		return this.queue.contains(obj);
	},
	
	closeClick: function(e) {
		e.preventDefault();
		e.stopPropagation();
		this.close();
	},
	
	close: function() {
		this.queue.slice(0).forEach(this.remove);
		this.queue = [];
	},
	
	pump: function() {
		if ( ! this.queue.length )
			return;
		
		var ids = this.queue.slice(0);
		this.close();
		app.ui.openManyById(ids);
	},
	
	isEmpty: function() {
		return ! this.queue.length;
	}
});
