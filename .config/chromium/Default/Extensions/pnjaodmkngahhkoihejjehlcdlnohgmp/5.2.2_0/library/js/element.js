
Element.prototype.forEachElement = function(func, bind) {
	var el = this.firstElementChild;
	if ( ! el )
		return;
	
	var els = []; 
	do {
		els.push(el);
	} while (el = el.nextElementSibling);
	
	els.forEach(func, bind);
};

Element.prototype.getAllAttributes = function() {
	var attributes = {};
	for ( var attr, i = 0, attrs = this.attributes, l = attrs.length; i < l; i++ ){
	    attr = attrs.item(i)
		attributes[attr.nodeName] = attr.nodeValue;
	}
	return attributes;
};

Element.prototype.cloneChildrenFrom = function(from) {
	from.forEachElement(function(el) {
		this.appendChild(el.cloneNode(true));
	}, this);
};

Element.prototype.getParents = function() {
	var parents = [];
	var current = this.parentElement;
	do {
		parents.push(current);
	} while (current = current.parentElement);
	return parents;
};

Element.prototype.clearChildren = function() {
	while ( this.firstChild )
		this.removeChild(this.firstChild);
};

Element.prototype.hide = function() {
	this.style.display = "none";
};

Element.prototype.show = function() {
	this.style.display = "block";
};

Element.prototype.hasChild = function(element) {
	if ( ! this.firstElementChild )
		return false;
	
	var el = this.firstElementChild;
	do {
		if ( el === element )
			return true;
	} while (el = el.nextElementSibling);
	
	return false;
};

function addTransitionEndEvent(element, func) {
	if ( ! Modernizr.csstransitions )
		return;
	Modernizr._domPrefixes.forEach(function(prefix) {
		element.addEventListener(prefix + "TransitionEnd", func, false);
	});
}

function removeTransitionEndEvent(element, func) {
	if ( ! Modernizr.csstransitions )
		return;
	Modernizr._domPrefixes.forEach(function(prefix) {
		element.removeEventListener(prefix + "TransitionEnd", func, false);
	});
}

Element.prototype.inViewPort = function(margin) {
	margin = margin || {left: 0, right: 0, top: 0, bottom: 0};

	var top = this.offsetTop;
	var left = this.offsetLeft;
	var width = this.offsetWidth;
	var height = this.offsetHeight;

	var el = this;
	while(el.offsetParent) {
		el = el.offsetParent;
		top += el.offsetTop;
		left += el.offsetLeft;
	}
	
	return (
		top - margin.top >= window.pageYOffset &&
		left - margin.left >= window.pageXOffset &&
		(top + height) + margin.bottom <= (window.pageYOffset + window.innerHeight) &&
		(left + width) + margin.left <= (window.pageXOffset + window.innerWidth)
	);
}

Element.prototype.scrollIntoViewSmart = function() {
	if ( this.inViewPort({left: 0, right: 0, top: 50, bottom: 10}) )
		return;
	var el = this, top = this.offsetTop;
	while (el.offsetParent) {
		el = el.offsetParent;
		top += el.offsetTop;
	}
	window.scrollTo(0, this.offsetTop - 100);
}