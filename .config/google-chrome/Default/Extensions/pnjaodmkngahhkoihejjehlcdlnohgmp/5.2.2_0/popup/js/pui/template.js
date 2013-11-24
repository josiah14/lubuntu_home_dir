PUI.Template = Class.extend({
	initialize: function(rootTemplate, attributes) {
		var uiDoc = Ext.getBackgroundPage().document;
		var uiElement = uiDoc.getElementById('ui');

		this.root = uiDoc.getElementById(rootTemplate);
		if ( ! this.root )
			throw new Error(rootTemplate + " template not found");
		
		this.makeContainer(attributes);
		this.prepare();
		
		this.stores = [];
		this.many = {};
		
		this.element = $(this.container);
	},
	
	destroy: function() {
		this.data.destroy();
		this.stores.forEach(function(store) {
			store.destroy();
		});
		if (this.container.parentNode)
			this.container.parentNode.removeChild(this.container);
	},
	
	prepareVariables: function(vc) {
		this.data = new PUI.Data(vc);
		this.vc = vc;
		
		var allWithVariables = this.container.querySelectorAll('[data]');
		for (var i = 0, el; el = allWithVariables[i]; i++)
			this.addVariableFromElement(el);
		
		var allWithMany = this.container.querySelectorAll('[many]');
		for (var i = 0, el; el = allWithMany[i]; i++ )
			this.addManyFromElement(el);
	},
	
	getComponents: function(fromElement) {
		var all = (fromElement || this.container).querySelectorAll('[pui]');
		var components = {};
		for ( var i = 0, el; el = all[i]; i++ )
			components[el.getAttribute('key').replace(/(-\w)/g, function(a) { return a.charAt(1).toUpperCase()})] = new (PUI[el.getAttribute('pui')])(el);
		return components;
	},
	
	getControllers: function() {
		var controllers = this.container.querySelectorAll('controller, context');
		this.controllers = {};
		
		for ( var i = 0, el; el = controllers[i]; i++ )
			this[el.tagName === "CONTEXT" ? 'parseContext' : 'parseController'](el);
		
		return this.controllers;
	},
	
	addVariableFromElement: function(el) {
		var hasManyParent = el.getParents().some(function(e) {
			return typeof e.getAttribute('many') === "string";
		});
		
		if ( hasManyParent )
			return;
		
		this.data.add(el);
	},
	
	addManyFromElement: function(el) {
		var placeholder = document.createElement('div');
		placeholder.className = /*el.className + */'placeholder';
		el.parentNode.replaceChild(placeholder, el);
		this.many[el.getAttribute('many')] = {reference: el, placeholder: placeholder};
	},
	
	makeContainer: function(defaultAttributes) {
		defaultAttributes = defaultAttributes || {};

		var attributes = this.root.getAllAttributes();

		this.container = document.createElement('div');
		this.temp = document.createElement('tmp');
		this.temp.innerHTML = this.root.innerHTML;

		if (attributes.id.contains("screen#")) {
			this.innerContainer = document.createElement('div');
			this.container.appendChild(this.innerContainer);
		} else {
			this.innerContainer = this.container;
		}
		
		// Copy all attributes, except ID
		delete defaultAttributes.from;

		if ( attributes.id ) {
			var id = 'tpl-' + attributes.id.replace('#', '-');
			attributes['class'] = attributes['class'] ? attributes['class'] + ' ' + id : id;
			delete attributes.id;
		}

		for ( var key in defaultAttributes ) if ( defaultAttributes.hasOwnProperty(key) )
			setAttribute(this.container, key, defaultAttributes[key]);

		for ( var key in attributes ) if ( attributes.hasOwnProperty(key) )
			setAttribute(this.container, key, attributes[key]);

		function setAttribute(element, key, value) {
			if ( key === "class" )
				element.className = (element.className + " " + value).trim();
			else
				element.setAttribute(key, value);
		}

		// Add children to container
		this.innerContainer.cloneChildrenFrom(this.temp);
	},
		
	prepare: function() {
		this.traverseAndParse(this.container);
	},
	
	traverseAndParse: function(element) {
		element.forEachElement(this.parseChild);
	},
	
	parseChild: function(child) {
		// Is it a tpl reference?
		if ( child.tagName === "TPL" )
			return this.parseTPL(child);
		
		// Just consider it as a normal child
		this.traverseAndParse(child);
	},
	
	parseTPL: function(el) {
		var tpl = new PUI.Template(el.getAttribute('from'), el.getAllAttributes());
		el.parentNode.replaceChild(tpl.container, el);
	},
	
	parseController: function(el) {
		var name = el.getAttribute('name');
		var controller = Screen[name];
		
		if ( ! controller )
			throw new Error("Controller Screen." + name + " not found");
		
		var key = this.toKey(name);
		
		var inst = new controller(el);
		
		this.controllers[key] = inst;
		el.parentNode.replaceChild(inst.template.container, el);
		
		// This shouldn't be here...
		inst.onVisible();
	},
	
	parseContext: function(el) {
		var ctx = new Context(el);
		var key = this.toKey(el.getAttribute('name'));
		
		this.controllers[key] = ctx;
		el.parentNode.replaceChild(ctx.container, el);
		
		// This should not be here either
		ctx.start();
	},
	
	toKey: function(name) {
		return name.replace(/^./, function(a) {
			return a.toLowerCase();
		});
	},
	
	set: function(key, value) {
		this.data.set(key, value);
	},
	
	setItems: function(key, items) {
		if ( ! this.many[key] )
			throw new Error("could not set many " + key + ", not found");
		
		var data = this.many[key];
		
		// Remove old children
		data.placeholder.forEachElement(function(el) {
			if ( el.store )
				el.store.destroy();
		});
		
		var container = document.createDocumentFragment();
		
		// Add children
		var add = function(callback) {
			if ( ! items.length )
				return callback();
			this.addItem(key, items.shift(), container, add.withCallback(callback));
		}.bind(this);
		
		chain(add)
		.and(function() {
			data.placeholder.clearChildren();
			data.placeholder.appendChild(container);
		});
	},
	
	addItem: function(key, item, container, callback) {
		if ( ! callback && typeof container === "function" ) {
			callback = container;
			container = false;
		}
		
		var data = this.many[key];
		var newElement = data.reference.cloneNode(true);

		container = container || data.placeholder;

		var store = new PUI.Data(this.vc, newElement);
		store.setMany(item);
		this.stores.push(store);
		store.ui = this.getComponents(newElement);
		
		container.appendChild(newElement);
		fireCallback(callback);
		
		return store;
	},
	
	el: function(sel) {
		return this.element.find(sel);
	}
});