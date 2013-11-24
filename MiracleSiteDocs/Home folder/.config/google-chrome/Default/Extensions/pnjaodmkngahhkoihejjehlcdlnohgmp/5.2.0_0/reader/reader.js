//
// Ext.js
//     Static things, that we don't want to separate into files because that would
//     be a pain to separate into different files.
//

var Ext = {
	getBackgroundPage: function() {
		if ( Ext.isSafari() )
			return safari.extension.globalPage.contentWindow;
		else if ( Ext.isOnline() ) {
			if (window.isBackground)
				return window;
			if (this.onlineBgPage)
				return this.onlineBgPage;
			var levels = [window];
			var current = window;
			while (window.top !== current) {
			    current = current.parent;
				levels.push(current);
			}

			var bgPage;
			for (var i = levels.length-1; i >= 0; i-- ) {
				var currentLevel = levels[i];
				bgPage = currentLevel.document && currentLevel.document.getElementById('__background-page');
				if (bgPage)
					break;
			}
			if ( ! bgPage ) {
				var backgroundIframe = document.createElement("iframe");
				backgroundIframe.src = "../reader/main.html";
				backgroundIframe.id = '__background-page';
				backgroundIframe.style.display = "none";
				document.body.appendChild(backgroundIframe);
				
				bgPage = backgroundIframe;
			}
			this.onlineBgPage = bgPage.contentWindow;
			return this.onlineBgPage;
		}
		return chrome.extension.getBackgroundPage();
	},
	
	isChrome: function() {
		return !!(window.chrome && window.chrome.extension);
	},
	
	isSafari: function() {
		return !!(window.safari && window.safari.extension);
	},
	
	isOnline: function() {
		return ! this.isChrome() && ! this.isSafari();
	},

	isMobile: function() {
		return screen.width <= 480;
	},
	
	path: function(path) {
		if ( Ext.isChrome() )
			return chrome.extension.getURL(path);
		if ( Ext.isSafari() )
			return safari.extension.baseURI + path;
		if ( Ext.isOnline() )
			return "/reader/" + path;
	}
};

if ( window.document && document.documentElement ) {
	var platform;
	if ( Ext.isSafari() )
		platform = "safari";
	else if ( Ext.isChrome() )
		platform = "chrome";
	else if ( Ext.isOnline() )
		platform = "online";
	document.body.classList.add("platform-" + platform);
	if (platform === "safari") {
		document.documentElement.classList.add("html-platform-safari");
	} else if (Ext.isMobile()) 
		document.documentElement.classList.add("html-platform-mobile");
}
;
window.__lastError = false;

function sendErrorReport(e, extraData) {
	if (Ext.isOnline())
		return;
	if (window.__lastError && Date.now() - window.__lastError < 500)
		return;
	window.__lastError = Date.now();
	try {
		if ( e.message.toString().contains("__taken_care_of__") )
			return;
		
		var file = e.filename;
		var line = e.lineno;
		
		if ( ! line ) {
			try {
				var caller_line = e.stack.split("\n")[4];
				var index = caller_line.indexOf("at ");
				var clean = caller_line.slice(index+2, caller_line.length);
				pieces = clean.substr(clean.lastIndexOf("(")).replace(/\(|\)/g, '').split(":");
				var charNo = pieces.pop();
				line = pieces.pop();
				file = pieces.join(":");
			} catch (e) {}
		}
		
		// Fetch feeds
		var feeds = [];
		try {
			app.user.forEachFeed(function(feed) {
				feeds.push({
					id: feed.id,
					title: feed.title,
					link: feed.link,
					path: feed.path,
					numposts: feed.numposts,
					usenotifications: feed.usenotifications,
					forceupdate: feed.forceupdate
				})
			});
		} catch (e) {}
		
		// Fetch preferences (localStorage)
		var preferences = {};
		for ( var key in localStorage ) if ( localStorage.hasOwnProperty(key) )
			preferences[key] = localStorage[key];
	
		var versionNumber = "-1";
		try { versionNumber = chrome.app.getDetails().version }
		catch (e) {}
	
		var dataWhat = "n/a";
		try { dataWhat = document.getElementById('__is-what').getAttribute('data-type'); }
		catch (e) {}
	
		var data = {
			message: e.message,
			feeds: feeds,
			preferences: preferences,
			stack: e.stack,
			version: versionNumber,
			what: dataWhat,
			platform: navigator.userAgent,
			url: document.location.href,
			extraData: extraData
		};

		var req = new XMLHttpRequest();
		req.open("POST", "http://old.feeder.co/error/", true );
		req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');
		
		try {
			req.send("report="+encodeURIComponent(JSON.stringify(data))+'&file='+encodeURIComponent(file)+'&line='+encodeURIComponent(line));
		} catch(e) {}
	} catch (e) { console.log("failed to send error report", e); }
}

window.addEventListener('error', function(e) {
	sendErrorReport(e);
}, false);

function TRYIT(fn, b, extraData) {
	extraData = extraData || {};

	var ret;
	try {
		ret = fn.call(b);
	} catch (e) {
		sendErrorReport(e, extraData);
		throw new Error("__taken_care_of__: " + e.message);
	}
	return ret;
}


function TRYITGETSTACK() {
	var stack = "n/a";
	try {
		throw new Error("just for stacktrack");
	} catch (e) { stack = e.stack; }
	return stack;
}
;
Function.prototype.withCallback = function(callback) {
	var func = this;
	return function() {
		var args = Array.prototype.slice.call(arguments);
		args.push(callback);
		return func.apply(this, args);
	};
};

Function.prototype.andArguments = function() {
	var addedArgs = Array.prototype.slice.call(arguments);
	var func = this;
	return function() {
		var args = Array.prototype.slice.call(arguments);
		args = [].concat(args, addedArgs);
		return func.apply(this, args);
	};
};

Function.prototype.withArguments = function() {
	var args = Array.prototype.slice.call(arguments);
	var func = this;
	return function() {
		return func.apply(this, args);
	};
};

Function.prototype.delay = function(ms) {
	var args = Array.prototype.slice.call(arguments, 1);
	var func = this;
	setTimeout(function() {
		func.apply(this, args);
	}, ms);
	return this;
};

/* FOR DEBUGGING PURPOSES */
var nativeBind = Function.prototype.bind;
Function.prototype.bind = function(b) {
	var func = this;
	var ret = nativeBind.call(func, b);/*function() {
		return func.apply(b, arguments);
	};*/
	ret.toString = function() {
		return 'BOUND(' + func.toString() + ')';
	};
	return ret;
};

function toOptions(params, defaults) {
	params = params || {};
	for ( var key in defaults ) if ( defaults.hasOwnProperty(key) ) {
		if ( typeof params[key] === 'undefined' )
			params[key] = defaults[key];
	}
	return params;
}

function fireCallback(callback) {
	if ( callback && typeof callback === "function" )
		callback.apply(this, Array.prototype.slice.call(arguments, 1));
}

function objectToQueryString(params, arrayedParamsToMultipleKey) {
	arrayedParamsToMultipleKey = arrayedParamsToMultipleKey || false;
	
	var pairs = [];
	for ( var key in params ) if ( params.hasOwnProperty(key) ) {
		var val = params[key];
		if ( typeof val === "object" && val.constructor === Array ) {
			val.forEach(function(a) {
				pairs.push(encodeURIComponent(key) + (arrayedParamsToMultipleKey ? '' : '[]') + '=' + encodeURIComponent(a));
			});
		} else {
			pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
		}
	}
	return pairs.join("&");
}
;
/*
	PUT EXTERNAL LIBS HERE
*/

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
	var initializing = false;
	var fnTest = /\b_super\b/;
	
	// The base Class implementation (does nothing)
	this.Class = function(){};
	
	// Create a new Class that inherits from this class
	Class.extend = function(prop) {
		var parent = this.prototype;
		
		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;
		
		// Copy the properties over onto the new prototype
		for (var name in prop) {
			// Check if we're overwriting an existing function
			if ( typeof prop[name] === "function" &&  typeof parent[name] == "function" && fnTest.test(prop[name]) )
				prototype[name] = (function(name, fn){
					return function() {
						var tmp = this._super;
						
						// Add a new ._super() method that is the same method
						// but on the super-class
						this._super = parent[name];
						
						// The method only need to be bound temporarily, so we
						// remove it when we're done executing
						var ret = fn.apply(this, arguments);				
						this._super = tmp;
						
						return ret;
					};
				})(name, prop[name]);
			else
				prototype[name] = prop[name];
		}
		
		// The dummy class constructor
		function Class() {
			// All construction is actually done in the init method
			if ( !initializing ) {
				var self = this;
				
				// Bind all methods to this
				for ( var name in prototype ) if ( typeof prototype[name] === "function" && ["constructor"].indexOf(name) === -1 ) (function(name) {
					this[name] = this[name].bind ? this[name].bind(this) : function() {
						return self[name].apply(self, arguments);
					};
				}).call(this, name);
				
				if ( this.initialize )
					this.initialize.apply(this, arguments);
			}
		}
		
		// Populate our constructed prototype object
		Class.prototype = prototype;
		
		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;

		// And make this class extendable
		Class.extend = arguments.callee;
		
		return Class;
	};
})();

/**
*
*  https://gist.github.com/1287361
*
**/
 
function crc32(s/*, polynomial = 0x04C11DB7, initialValue = 0xFFFFFFFF, finalXORValue = 0xFFFFFFFF*/) {
  s = String(s);
  var polynomial = arguments.length < 2 ? 0x04C11DB7 : arguments[1],
      initialValue = arguments.length < 3 ? 0xFFFFFFFF : arguments[2],
      finalXORValue = arguments.length < 4 ? 0xFFFFFFFF : arguments[3],
      crc = initialValue,
      table = [], i, j, c;

  function reverse(x, n) {
    var b = 0;
    while (n) {
      b = b * 2 + x % 2;
      x /= 2;
      x -= x % 1;
      n--;
    }
    return b;
  }

  for (i = 255; i >= 0; i--) {
    c = reverse(i, 32);

    for (j = 0; j < 8; j++) {
      c = ((c * 2) ^ (((c >>> 31) % 2) * polynomial)) >>> 0;
    }

    table[i] = reverse(c, 32);
  }

  for (i = 0; i < s.length; i++) {
    c = s.charCodeAt(i);
    if (c > 255) {
      throw new RangeError();
    }
    j = (crc % 256) ^ c;
    crc = ((crc / 256) ^ table[j]) >>> 0;
  }

  return ((crc ^ finalXORValue) >>> 0).toString(16);
}
;
function Chainable(func, args) {
	this.stack = [];
	this.isRunning = false;
	if ( func ) {
		this.stack.push([func, args]);
		this.run();
	}
}

Chainable.prototype.run = function() {
	this.next();
	return this;
};

// Then passes the result of the previous function into the arguments
Chainable.prototype.then = Chainable.prototype.chain = function(func) {
	return this.add(func, arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : false);
};

// And doesn't pass anything back from the previous function
Chainable.prototype.and = function(func) {
	return this.add(func, arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : []);
};

// End a chain, calls a function without any arguments at all
Chainable.prototype.end = function(func) {
	return this.add(func || function() {}, arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : [], chain.ending);
};

// A synchronous call, without worrying about callbacks
Chainable.prototype.andSync = function(func) {
	var link = this;
	
	return this.add(function() {
		func.apply(this, [].slice.call(arguments, 0, -1));
		link.callbackWasCalled = true;
		link.next();
	}, arguments.length > 1 ? [].slice.call(arguments, 1) : []);
};

Chainable.prototype.thenSync = function(func) {
	var link = this;
	
	return this.add(function() {
		func.apply(this, [].slice.call(arguments, 0, -1));
		link.callbackWasCalled = true;
		link.next();
	}, arguments.length > 1 ? [].slice.call(arguments, 1) : false);
};

Chainable.prototype.add = function(func, args, meta) {
	if ( typeof func !== "function" )
		throw new Error("func in chainable not valid callback");
	this.stack.push([func, args, meta]);
	if ( ! this.isRunning )
		this.next();
	return this;
};

Chainable.prototype.makeArgs = function(args, meta) {
	if ( meta === chain.ending )
		return args;
	args = Array.prototype.slice.call(args || []);
	args.push(this.callback.bind(this));
	return args;
};

Chainable.prototype.callback = function() {
	this.callbackWasCalled = true;
	this.currentArgs = arguments;
	
	if ( ! this.wasSynchronous )
		this.next();
};

/*
	Run through the chain. The algorithm is as follows:
	
	1. Pop from stack
	2. Run
	3. Was callback called?
	    4a. Yes? Repeat
	    4b. No?  Wait, then repeat
*/

Chainable.prototype.next = function() {
	if ( this.isAborted )
		return;
	
	var current = this.stack.shift();
	
	// Chain is now empty. Maybe something is added after this though?
	if ( ! current ) {
		this.isRunning = false;
		return;
	}
	
	var func = current[0], args = current[1], meta = current[2];
	
	this.isRunning = true;
	this.wasSynchronous = true;
	this.callbackWasCalled = false;
	
	var ret = func.apply(this, this.makeArgs(args || this.currentArgs, meta));
	
	// If a function returns the exit method of chain, stop execution
	if ( ret === chain.exit )
		return;
	
	if ( ! this.callbackWasCalled )
		this.wasSynchronous = false;
	else {
		this.next(); // repeat
	}
};

Chainable.prototype.abort = function() {
	this.stack = [];
	this.isAborted = true;
};

function chain(func) {
	return new Chainable(func, Array.prototype.slice.call(arguments, 1));
}

chain.exit = function() { /* exit */ };
chain.ending = function() { /* ending */ };

;
Array.prototype.remove = function(item) {
	for (var i = this.length; i--;)
		if (this[i] === item) this.splice(i, 1);
	return this;
};

Array.prototype.contains = function(search) {
	return this.indexOf(search) !== -1;
};

// Uses a reverse-unique-algorithm for Google Reader
Array.prototype.unique = function(){
   var u = {}, a = [];
   for(var l = 0, i = this.length-1; i >= 0; --i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.unshift(this[i]);
      u[this[i]] = 1;
   }
   return a;
};

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
;
String.prototype.trimChars = function(charlist) {
	charlist = charlist || ' \r\n\t';
    var l = 0, i = 0;
    
    var ret = this;
    
    l = ret.length;
    for (i = 0; i < l; i++) {
        if (charlist.indexOf(ret.charAt(i)) === -1) {
            ret = ret.substring(i);
            break;
        }
    }
    
    l = ret.length;
    for (i = l - 1; i >= 0; i--) {
        if (charlist.indexOf(ret.charAt(i)) === -1) {
            ret = ret.substring(0, i + 1);
            break;
        }
    }
    
    return charlist.indexOf(ret.charAt(0)) === -1 ? ret : '';
};

String.prototype.contains = function(str) {
	return this.indexOf(str) !== -1;
};

String.prototype.cleanData = function() {
	return this.replace(/<!\[CDATA\[(.*)\]\]>/, function(a, b) { return b; }).trim();
};

String.prototype.upperCaseFirst = function() {
	return this.replace(/^./, function(a) {
		return a.toUpperCase();
	});
};

String.prototype.stripHTMLEntities = function() {
	var el = document.createElement("div");
	var html = this.replace(/<img/g, '<x-img');
	el.innerHTML = html;
	return el.innerText;
}
;

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
;
var Request = Class.extend({
	initialize: function(params) {
		this.params = toOptions(params, {
			method: 'GET',
			onComplete: function() {},
			onError: function() {},
			arrayedParamsToMultipleKey: false,
			timeout: false,
			addFeederAuthorization: false
		});
		
		this.headers = {};
		
		if (this.params.addFeederAuthorization) {
			this.addFeederAuthorization();
		}
		
		this.request = new XMLHttpRequest();
	},
	
	addHeader: function(key, value) {
		this.headers[key] = value;
	},
	
	send: function(options) {
		options = toOptions(options, {get: {}, post: {}});
		options.get = options.get || {};
		options.post = options.post || {};
		
		var paramsPost = this.makeParams(options.post);
		var paramsGet = this.makeParams(options.get);
		var url = this.params.url;
		
		if ( paramsGet ) {
			TRYIT(function() {
				url += (url.contains('?') ? '&' : '?') + paramsGet;
			}, this, {url: url});
		}
		
		this.request.open(this.params.method, url);
		if ( this.params.method === 'POST' )
			this.request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');
		
		for ( var key in this.headers ) if ( this.headers.hasOwnProperty(key) )
			this.request.setRequestHeader(key, this.headers[key]);
		
		this.request.onreadystatechange = this.requestReadyStateChange;
		this.request.onerror = this.requestError;
		
		if ( this.params.timeout ) {
			this.request.timeout = this.params.timeout;
			this.request.ontimeout = this.requestError;
		}
	
		TRYIT(function() {
			this.request.send(paramsPost || null);
		}, this, {url: this.params.url, params: options});
	},
	
	abort: function() {
		this.request.abort();
	},
	
	requestReadyStateChange: function() {
		if ( this.request.readyState != 4 ) return;
		
		this.params.onComplete.call(this, this.request.status, this.request.responseText, this.request.responseXML);
	},
	
	requestError: function() {
		this.params.onError.call(this);
	},
	
	makeParams: function(data) {
		if ( ! data )
			return null;
		return objectToQueryString(data, this.params.arrayedParamsToMultipleKey);
	},
	
	addFeederAuthorization: function() {
		if ( ! localStorage["feeder:token"] )
			return;
		this.addHeader("Authorization", btoa(JSON.parse(localStorage["feeder:token"]) + ":" + JSON.parse(localStorage["client_id"])));
	},
	
	getHeader: function(header) {
		return this.request.getResponseHeader(header);
	}
});

function tryToParseJSON(data) {
	try {
		return JSON.parse(data);
	} catch (e) {}
	
	return null;
}

function objectLength(obj) {
	return Object.keys(obj).length;
}

function queryStringGet(key) {
	var str = window.location.search.substring(1);
	var pieces = str.split("&");
	for ( var i = 0; i < pieces.length; i++ ) {
		keyValue = pieces[i].split("=");
		if ( keyValue[0] == key )
			return keyValue[1];
	}
	return "";
}

function readFileInput(fileinput, callback) {
	var filereader = new FileReader();
		
	filereader.onload = function(event) {
		fireCallback(callback, event.target.result);
	};
		
	filereader.onerror = function() {
		fireCallback(callback, false);
	};
		
	if ( ! fileinput.files[0] ) {
		fireCallback(callback, false);
		return;
	}
		
	filereader.readAsText(fileinput.files[0]);
}

Object.values = function (obj) {
    var vals = [];
    for( var key in obj ) {
        if ( obj.hasOwnProperty(key) ) {
            vals.push(obj[key]);
        }
    }
    return vals;
}

/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-csstransitions-touch-teststyles-testprop-testallprops-prefixes-domprefixes
 */
;window.Modernizr=function(a,b,c){function y(a){i.cssText=a}function z(a,b){return y(l.join(a+";")+(b||""))}function A(a,b){return typeof a===b}function B(a,b){return!!~(""+a).indexOf(b)}function C(a,b){for(var d in a){var e=a[d];if(!B(e,"-")&&i[e]!==c)return b=="pfx"?e:!0}return!1}function D(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:A(f,"function")?f.bind(d||b):f}return!1}function E(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+n.join(d+" ")+d).split(" ");return A(b,"string")||A(b,"undefined")?C(e,b):(e=(a+" "+o.join(d+" ")+d).split(" "),D(e,b,c))}var d="2.6.2",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l=" -webkit- -moz- -o- -ms- ".split(" "),m="Webkit Moz O ms",n=m.split(" "),o=m.toLowerCase().split(" "),p={},q={},r={},s=[],t=s.slice,u,v=function(a,c,d,e){var h,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:g+(d+1),l.appendChild(j);return h=["&#173;",'<style id="s',g,'">',a,"</style>"].join(""),l.id=g,(m?l:n).innerHTML+=h,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=f.style.overflow,f.style.overflow="hidden",f.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),f.style.overflow=k),!!i},w={}.hasOwnProperty,x;!A(w,"undefined")&&!A(w.call,"undefined")?x=function(a,b){return w.call(a,b)}:x=function(a,b){return b in a&&A(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=t.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(t.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(t.call(arguments)))};return e}),p.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:v(["@media (",l.join("touch-enabled),("),g,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},p.csstransitions=function(){return E("transition")};for(var F in p)x(p,F)&&(u=F.toLowerCase(),e[u]=p[F](),s.push((e[u]?"":"no-")+u));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)x(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},y(""),h=j=null,e._version=d,e._prefixes=l,e._domPrefixes=o,e._cssomPrefixes=n,e.testProp=function(a){return C([a])},e.testAllProps=E,e.testStyles=v,e}(this,this.document);
;
/*!
 * URI.js - Mutating URLs
 * Second Level Domain (SLD) Support
 *
 * Version: 1.8.3
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.com/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 */

(function (root, factory) {
    // https://github.com/umdjs/umd/blob/master/returnExports.js
    if (typeof exports === 'object') {
        // Node
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals (root is window)
        root.SecondLevelDomains = factory();
    }
}(this, function () {
"use strict";

var hasOwn = Object.prototype.hasOwnProperty;
var SLD = {
    // list of known Second Level Domains
    // converted list of SLDs from https://github.com/gavingmiller/second-level-domains
    // ----
    // publicsuffix.org is more current and actually used by a couple of browsers internally.
    // downside is it also contains domains like "dyndns.org" - which is fine for the security
    // issues browser have to deal with (SOP for cookies, etc) - but is way overboard for URI.js
    // ----
    list: {
        "ac":"com|gov|mil|net|org",
        "ae":"ac|co|gov|mil|name|net|org|pro|sch",
        "af":"com|edu|gov|net|org",
        "al":"com|edu|gov|mil|net|org",
        "ao":"co|ed|gv|it|og|pb",
        "ar":"com|edu|gob|gov|int|mil|net|org|tur",
        "at":"ac|co|gv|or",
        "au":"asn|com|csiro|edu|gov|id|net|org",
        "ba":"co|com|edu|gov|mil|net|org|rs|unbi|unmo|unsa|untz|unze",
        "bb":"biz|co|com|edu|gov|info|net|org|store|tv",
        "bh":"biz|cc|com|edu|gov|info|net|org",
        "bn":"com|edu|gov|net|org",
        "bo":"com|edu|gob|gov|int|mil|net|org|tv",
        "br":"adm|adv|agr|am|arq|art|ato|b|bio|blog|bmd|cim|cng|cnt|com|coop|ecn|edu|eng|esp|etc|eti|far|flog|fm|fnd|fot|fst|g12|ggf|gov|imb|ind|inf|jor|jus|lel|mat|med|mil|mus|net|nom|not|ntr|odo|org|ppg|pro|psc|psi|qsl|rec|slg|srv|tmp|trd|tur|tv|vet|vlog|wiki|zlg",
        "bs":"com|edu|gov|net|org",
        "bz":"du|et|om|ov|rg",
        "ca":"ab|bc|mb|nb|nf|nl|ns|nt|nu|on|pe|qc|sk|yk",
        "ck":"biz|co|edu|gen|gov|info|net|org",
        "cn":"ac|ah|bj|com|cq|edu|fj|gd|gov|gs|gx|gz|ha|hb|he|hi|hl|hn|jl|js|jx|ln|mil|net|nm|nx|org|qh|sc|sd|sh|sn|sx|tj|tw|xj|xz|yn|zj",
        "co":"com|edu|gov|mil|net|nom|org",
        "cr":"ac|c|co|ed|fi|go|or|sa",
        "cy":"ac|biz|com|ekloges|gov|ltd|name|net|org|parliament|press|pro|tm",
        "do":"art|com|edu|gob|gov|mil|net|org|sld|web",
        "dz":"art|asso|com|edu|gov|net|org|pol",
        "ec":"com|edu|fin|gov|info|med|mil|net|org|pro",
        "eg":"com|edu|eun|gov|mil|name|net|org|sci",
        "er":"com|edu|gov|ind|mil|net|org|rochest|w",
        "es":"com|edu|gob|nom|org",
        "et":"biz|com|edu|gov|info|name|net|org",
        "fj":"ac|biz|com|info|mil|name|net|org|pro",
        "fk":"ac|co|gov|net|nom|org",
        "fr":"asso|com|f|gouv|nom|prd|presse|tm",
        "gg":"co|net|org",
        "gh":"com|edu|gov|mil|org",
        "gn":"ac|com|gov|net|org",
        "gr":"com|edu|gov|mil|net|org",
        "gt":"com|edu|gob|ind|mil|net|org",
        "gu":"com|edu|gov|net|org",
        "hk":"com|edu|gov|idv|net|org",
        "id":"ac|co|go|mil|net|or|sch|web",
        "il":"ac|co|gov|idf|k12|muni|net|org",
        "in":"ac|co|edu|ernet|firm|gen|gov|i|ind|mil|net|nic|org|res",
        "iq":"com|edu|gov|i|mil|net|org",
        "ir":"ac|co|dnssec|gov|i|id|net|org|sch",
        "it":"edu|gov",
        "je":"co|net|org",
        "jo":"com|edu|gov|mil|name|net|org|sch",
        "jp":"ac|ad|co|ed|go|gr|lg|ne|or",
        "ke":"ac|co|go|info|me|mobi|ne|or|sc",
        "kh":"com|edu|gov|mil|net|org|per",
        "ki":"biz|com|de|edu|gov|info|mob|net|org|tel",
        "km":"asso|com|coop|edu|gouv|k|medecin|mil|nom|notaires|pharmaciens|presse|tm|veterinaire",
        "kn":"edu|gov|net|org",
        "kr":"ac|busan|chungbuk|chungnam|co|daegu|daejeon|es|gangwon|go|gwangju|gyeongbuk|gyeonggi|gyeongnam|hs|incheon|jeju|jeonbuk|jeonnam|k|kg|mil|ms|ne|or|pe|re|sc|seoul|ulsan",
        "kw":"com|edu|gov|net|org",
        "ky":"com|edu|gov|net|org",
        "kz":"com|edu|gov|mil|net|org",
        "lb":"com|edu|gov|net|org",
        "lk":"assn|com|edu|gov|grp|hotel|int|ltd|net|ngo|org|sch|soc|web",
        "lr":"com|edu|gov|net|org",
        "lv":"asn|com|conf|edu|gov|id|mil|net|org",
        "ly":"com|edu|gov|id|med|net|org|plc|sch",
        "ma":"ac|co|gov|m|net|org|press",
        "mc":"asso|tm",
        "me":"ac|co|edu|gov|its|net|org|priv",
        "mg":"com|edu|gov|mil|nom|org|prd|tm",
        "mk":"com|edu|gov|inf|name|net|org|pro",
        "ml":"com|edu|gov|net|org|presse",
        "mn":"edu|gov|org",
        "mo":"com|edu|gov|net|org",
        "mt":"com|edu|gov|net|org",
        "mv":"aero|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro",
        "mw":"ac|co|com|coop|edu|gov|int|museum|net|org",
        "mx":"com|edu|gob|net|org",
        "my":"com|edu|gov|mil|name|net|org|sch",
        "nf":"arts|com|firm|info|net|other|per|rec|store|web",
        "ng":"biz|com|edu|gov|mil|mobi|name|net|org|sch",
        "ni":"ac|co|com|edu|gob|mil|net|nom|org",
        "np":"com|edu|gov|mil|net|org",
        "nr":"biz|com|edu|gov|info|net|org",
        "om":"ac|biz|co|com|edu|gov|med|mil|museum|net|org|pro|sch",
        "pe":"com|edu|gob|mil|net|nom|org|sld",
        "ph":"com|edu|gov|i|mil|net|ngo|org",
        "pk":"biz|com|edu|fam|gob|gok|gon|gop|gos|gov|net|org|web",
        "pl":"art|bialystok|biz|com|edu|gda|gdansk|gorzow|gov|info|katowice|krakow|lodz|lublin|mil|net|ngo|olsztyn|org|poznan|pwr|radom|slupsk|szczecin|torun|warszawa|waw|wroc|wroclaw|zgora",
        "pr":"ac|biz|com|edu|est|gov|info|isla|name|net|org|pro|prof",
        "ps":"com|edu|gov|net|org|plo|sec",
        "pw":"belau|co|ed|go|ne|or",
        "ro":"arts|com|firm|info|nom|nt|org|rec|store|tm|www",
        "rs":"ac|co|edu|gov|in|org",
        "sb":"com|edu|gov|net|org",
        "sc":"com|edu|gov|net|org",
        "sh":"co|com|edu|gov|net|nom|org",
        "sl":"com|edu|gov|net|org",
        "st":"co|com|consulado|edu|embaixada|gov|mil|net|org|principe|saotome|store",
        "sv":"com|edu|gob|org|red",
        "sz":"ac|co|org",
        "tr":"av|bbs|bel|biz|com|dr|edu|gen|gov|info|k12|name|net|org|pol|tel|tsk|tv|web",
        "tt":"aero|biz|cat|co|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel",
        "tw":"club|com|ebiz|edu|game|gov|idv|mil|net|org",
        "mu":"ac|co|com|gov|net|or|org",
        "mz":"ac|co|edu|gov|org",
        "na":"co|com",
        "nz":"ac|co|cri|geek|gen|govt|health|iwi|maori|mil|net|org|parliament|school",
        "pa":"abo|ac|com|edu|gob|ing|med|net|nom|org|sld",
        "pt":"com|edu|gov|int|net|nome|org|publ",
        "py":"com|edu|gov|mil|net|org",
        "qa":"com|edu|gov|mil|net|org",
        "re":"asso|com|nom",
        "ru":"ac|adygeya|altai|amur|arkhangelsk|astrakhan|bashkiria|belgorod|bir|bryansk|buryatia|cbg|chel|chelyabinsk|chita|chukotka|chuvashia|com|dagestan|e-burg|edu|gov|grozny|int|irkutsk|ivanovo|izhevsk|jar|joshkar-ola|kalmykia|kaluga|kamchatka|karelia|kazan|kchr|kemerovo|khabarovsk|khakassia|khv|kirov|koenig|komi|kostroma|kranoyarsk|kuban|kurgan|kursk|lipetsk|magadan|mari|mari-el|marine|mil|mordovia|mosreg|msk|murmansk|nalchik|net|nnov|nov|novosibirsk|nsk|omsk|orenburg|org|oryol|penza|perm|pp|pskov|ptz|rnd|ryazan|sakhalin|samara|saratov|simbirsk|smolensk|spb|stavropol|stv|surgut|tambov|tatarstan|tom|tomsk|tsaritsyn|tsk|tula|tuva|tver|tyumen|udm|udmurtia|ulan-ude|vladikavkaz|vladimir|vladivostok|volgograd|vologda|voronezh|vrn|vyatka|yakutia|yamal|yekaterinburg|yuzhno-sakhalinsk",
        "rw":"ac|co|com|edu|gouv|gov|int|mil|net",
        "sa":"com|edu|gov|med|net|org|pub|sch",
        "sd":"com|edu|gov|info|med|net|org|tv",
        "se":"a|ac|b|bd|c|d|e|f|g|h|i|k|l|m|n|o|org|p|parti|pp|press|r|s|t|tm|u|w|x|y|z",
        "sg":"com|edu|gov|idn|net|org|per",
        "sn":"art|com|edu|gouv|org|perso|univ",
        "sy":"com|edu|gov|mil|net|news|org",
        "th":"ac|co|go|in|mi|net|or",
        "tj":"ac|biz|co|com|edu|go|gov|info|int|mil|name|net|nic|org|test|web",
        "tn":"agrinet|com|defense|edunet|ens|fin|gov|ind|info|intl|mincom|nat|net|org|perso|rnrt|rns|rnu|tourism",
        "tz":"ac|co|go|ne|or",
        "ua":"biz|cherkassy|chernigov|chernovtsy|ck|cn|co|com|crimea|cv|dn|dnepropetrovsk|donetsk|dp|edu|gov|if|in|ivano-frankivsk|kh|kharkov|kherson|khmelnitskiy|kiev|kirovograd|km|kr|ks|kv|lg|lugansk|lutsk|lviv|me|mk|net|nikolaev|od|odessa|org|pl|poltava|pp|rovno|rv|sebastopol|sumy|te|ternopil|uzhgorod|vinnica|vn|zaporizhzhe|zhitomir|zp|zt",
        "ug":"ac|co|go|ne|or|org|sc",
        "uk":"ac|bl|british-library|co|cym|gov|govt|icnet|jet|lea|ltd|me|mil|mod|national-library-scotland|nel|net|nhs|nic|nls|org|orgn|parliament|plc|police|sch|scot|soc",
        "us":"dni|fed|isa|kids|nsn",
        "uy":"com|edu|gub|mil|net|org",
        "ve":"co|com|edu|gob|info|mil|net|org|web",
        "vi":"co|com|k12|net|org",
        "vn":"ac|biz|com|edu|gov|health|info|int|name|net|org|pro",
        "ye":"co|com|gov|ltd|me|net|org|plc",
        "yu":"ac|co|edu|gov|org",
        "za":"ac|agric|alt|bourse|city|co|cybernet|db|edu|gov|grondar|iaccess|imt|inca|landesign|law|mil|net|ngo|nis|nom|olivetti|org|pix|school|tm|web",
        "zm":"ac|co|com|edu|gov|net|org|sch"
    },
    // SLD expression for each TLD
    //expressions: {},
    // SLD expression for all TLDs
    has_expression: null,
    is_expression: null,
    // validate domain is a known SLD
    has: function(domain) {
        return !!domain.match(SLD.has_expression);
    },
    is: function(domain) {
        return !!domain.match(SLD.is_expression);
    },
    get: function(domain) {
        var t = domain.match(SLD.has_expression);
        return t && t[1] || null;
    },
    init: function() {
        var t = '';
        for (var tld in SLD.list) {
            if (!hasOwn.call(SLD.list, tld)) {
                continue;
            }

            var expression = '(' + SLD.list[tld] + ')\.' + tld;
            //SLD.expressions[tld] = new RegExp('\.' + expression + '$', 'i');
            t += '|(' + expression + ')';
        }

        SLD.has_expression = new RegExp('\\.(' + t.substr(1) + ')$', 'i');
        SLD.is_expression = new RegExp('^(' + t.substr(1) + ')$', 'i');
    }
};

SLD.init();

return SLD;
}));
/*!
 * URI.js - Mutating URLs
 *
 * Version: 1.8.3
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.com/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 */
(function (root, factory) {
    // https://github.com/umdjs/umd/blob/master/returnExports.js
    if (typeof exports === 'object') {
        // Node
        module.exports = factory(require('./punycode'), require('./IPv6'), require('./SecondLevelDomains'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./punycode', './IPv6', './SecondLevelDomains'], factory);
    } else {
        // Browser globals (root is window)
        root.URI = factory(root.punycode, root.IPv6, root.SecondLevelDomains);
    }
}(this, function (punycode, IPv6, SLD) {
"use strict";

function URI(url, base) {
    // Allow instantiation without the 'new' keyword
    if (!(this instanceof URI)) {
        return new URI(url, base);
    }

    if (url === undefined) {
        if (typeof location !== 'undefined') {
            url = location.href + "";
        } else {
            url = "";
        }
    }
	
	if (url === null)
		url = "";

    this.href(url);

    // resolve to base according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#constructor
    if (base !== undefined) {
        return this.absoluteTo(base);
    }

    return this;
};

var p = URI.prototype;
var hasOwn = Object.prototype.hasOwnProperty;

function escapeRegEx(string) {
    // https://github.com/medialize/URI.js/commit/85ac21783c11f8ccab06106dba9735a31a86924d#commitcomment-821963
    return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}

function isArray(obj) {
    return String(Object.prototype.toString.call(obj)) === "[object Array]";
}

function filterArrayValues(data, value) {
    var lookup = {};
    var i, length;

    if (isArray(value)) {
        for (i = 0, length = value.length; i < length; i++) {
            lookup[value[i]] = true;
        }
    } else {
        lookup[value] = true;
    }

    for (i = 0, length = data.length; i < length; i++) {
        if (lookup[data[i]] !== undefined) {
            data.splice(i, 1);
            length--;
            i--;
        }
    }

    return data;
}

URI._parts = function() {
    return {
        protocol: null,
        username: null,
        password: null,
        hostname: null,
        urn: null,
        port: null,
        path: null,
        query: null,
        fragment: null,
        // state
        duplicateQueryParameters: URI.duplicateQueryParameters
    };
};
// state: allow duplicate query parameters (a=1&a=1)
URI.duplicateQueryParameters = false;
// static properties
URI.protocol_expression = /^[a-z][a-z0-9-+-]*$/i;
URI.idn_expression = /[^a-z0-9\.-]/i;
URI.punycode_expression = /(xn--)/i;
// well, 333.444.555.666 matches, but it sure ain't no IPv4 - do we care?
URI.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
// credits to Rich Brown
// source: http://forums.intermapper.com/viewtopic.php?p=1096#1096
// specification: http://www.ietf.org/rfc/rfc4291.txt
URI.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/ ;
// gruber revised expression - http://rodneyrehm.de/t/url-regex.html
URI.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?]))/ig;
// http://www.iana.org/assignments/uri-schemes.html
// http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Well-known_ports
URI.defaultPorts = {
    http: "80",
    https: "443",
    ftp: "21",
    gopher: "70",
    ws: "80",
    wss: "443"
};
// allowed hostname characters according to RFC 3986
// ALPHA DIGIT "-" "." "_" "~" "!" "$" "&" "'" "(" ")" "*" "+" "," ";" "=" %encoded
// I've never seen a (non-IDN) hostname other than: ALPHA DIGIT . -
URI.invalid_hostname_characters = /[^a-zA-Z0-9\.-]/;
// encoding / decoding according to RFC3986
function strictEncodeURIComponent(string) {
    // see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURIComponent
    return encodeURIComponent(string)
        .replace(/[!'()*]/g, escape)
        .replace(/\*/g, "%2A");
}
URI.encode = strictEncodeURIComponent;
URI.decode = decodeURIComponent;
URI.iso8859 = function() {
    URI.encode = escape;
    URI.decode = unescape;
};
URI.unicode = function() {
    URI.encode = strictEncodeURIComponent;
    URI.decode = decodeURIComponent;
};
URI.characters = {
    pathname: {
        encode: {
            // RFC3986 2.1: For consistency, URI producers and normalizers should
            // use uppercase hexadecimal digits for all percent-encodings.
            expression: /%(24|26|2B|2C|3B|3D|3A|40)/ig,
            map: {
                // -._~!'()*
                "%24": "$",
                "%26": "&",
                "%2B": "+",
                "%2C": ",",
                "%3B": ";",
                "%3D": "=",
                "%3A": ":",
                "%40": "@"
            }
        },
        decode: {
            expression: /[\/\?#]/g,
            map: {
                "/": "%2F",
                "?": "%3F",
                "#": "%23"
            }
        }
    },
    reserved: {
        encode: {
            // RFC3986 2.1: For consistency, URI producers and normalizers should
            // use uppercase hexadecimal digits for all percent-encodings.
            expression: /%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/ig,
            map: {
                // gen-delims
                "%3A": ":",
                "%2F": "/",
                "%3F": "?",
                "%23": "#",
                "%5B": "[",
                "%5D": "]",
                "%40": "@",
                // sub-delims
                "%21": "!",
                "%24": "$",
                "%26": "&",
                "%27": "'",
                "%28": "(",
                "%29": ")",
                "%2A": "*",
                "%2B": "+",
                "%2C": ",",
                "%3B": ";",
                "%3D": "="
            }
        }
    }
};
URI.encodeQuery = function(string) {
    return URI.encode(string + "").replace(/%20/g, '+');
};
URI.decodeQuery = function(string) {
    return URI.decode((string + "").replace(/\+/g, '%20'));
};
URI.recodePath = function(string) {
    var segments = (string + "").split('/');
    for (var i = 0, length = segments.length; i < length; i++) {
        segments[i] = URI.encodePathSegment(URI.decode(segments[i]));
    }

    return segments.join('/');
};
URI.decodePath = function(string) {
    var segments = (string + "").split('/');
    for (var i = 0, length = segments.length; i < length; i++) {
        segments[i] = URI.decodePathSegment(segments[i]);
    }

    return segments.join('/');
};
// generate encode/decode path functions
var _parts = {'encode':'encode', 'decode':'decode'};
var _part;
var generateAccessor = function(_group, _part) {
    return function(string) {
        return URI[_part](string + "").replace(URI.characters[_group][_part].expression, function(c) {
            return URI.characters[_group][_part].map[c];
        });
    };
};

for (_part in _parts) {
    URI[_part + "PathSegment"] = generateAccessor("pathname", _parts[_part]);
}

URI.encodeReserved = generateAccessor("reserved", "encode");

URI.parse = function(string, parts) {
    var pos, t;
    if (!parts) {
        parts = {};
    }
    // [protocol"://"[username[":"password]"@"]hostname[":"port]"/"?][path]["?"querystring]["#"fragment]

    // extract fragment
    pos = string.indexOf('#');
    if (pos > -1) {
        // escaping?
        parts.fragment = string.substring(pos + 1) || null;
        string = string.substring(0, pos);
    }

    // extract query
    pos = string.indexOf('?');
    if (pos > -1) {
        // escaping?
        parts.query = string.substring(pos + 1) || null;
        string = string.substring(0, pos);
    }

    // extract protocol
    if (string.substring(0, 2) === '//') {
        // relative-scheme
        parts.protocol = '';
        string = string.substring(2);
        // extract "user:pass@host:port"
        string = URI.parseAuthority(string, parts);
    } else {
        pos = string.indexOf(':');
        if (pos > -1) {
            parts.protocol = string.substring(0, pos);
            if (parts.protocol && !parts.protocol.match(URI.protocol_expression)) {
                // : may be within the path
                parts.protocol = undefined;
            } else if (parts.protocol === 'file') {
                // the file scheme: does not contain an authority
                string = string.substring(pos + 3);
            } else if (string.substring(pos + 1, pos + 3) === '//') {
                string = string.substring(pos + 3);

                // extract "user:pass@host:port"
                string = URI.parseAuthority(string, parts);
            } else {
                string = string.substring(pos + 1);
                parts.urn = true;
            }
        }
    }

    // what's left must be the path
    parts.path = string;

    // and we're done
    return parts;
};
URI.parseHost = function(string, parts) {
    // extract host:port
    var pos = string.indexOf('/');
    var bracketPos;
    var t;

    if (pos === -1) {
        pos = string.length;
    }

    if (string[0] === "[") {
        // IPv6 host - http://tools.ietf.org/html/draft-ietf-6man-text-addr-representation-04#section-6
        // I claim most client software breaks on IPv6 anyways. To simplify things, URI only accepts
        // IPv6+port in the format [2001:db8::1]:80 (for the time being)
        bracketPos = string.indexOf(']');
        parts.hostname = string.substring(1, bracketPos) || null;
        parts.port = string.substring(bracketPos+2, pos) || null;
    } else if (string.indexOf(':') !== string.lastIndexOf(':')) {
        // IPv6 host contains multiple colons - but no port
        // this notation is actually not allowed by RFC 3986, but we're a liberal parser
        parts.hostname = string.substring(0, pos) || null;
        parts.port = null;
    } else {
        t = string.substring(0, pos).split(':');
        parts.hostname = t[0] || null;
        parts.port = t[1] || null;
    }

    if (parts.hostname && string.substring(pos)[0] !== '/') {
        pos++;
        string = "/" + string;
    }

    return string.substring(pos) || '/';
};
URI.parseAuthority = function(string, parts) {
    string = URI.parseUserinfo(string, parts);
    return URI.parseHost(string, parts);
};
URI.parseUserinfo = function(string, parts) {
    // extract username:password
    var pos = string.indexOf('@');
    var firstSlash = string.indexOf('/');
    var t;

    // authority@ must come before /path
    if (pos > -1 && (firstSlash === -1 || pos < firstSlash)) {
        t = string.substring(0, pos).split(':');
        parts.username = t[0] ? URI.decode(t[0]) : null;
        t.shift();
        parts.password = t[0] ? URI.decode(t.join(':')) : null;
        string = string.substring(pos + 1);
    } else {
        parts.username = null;
        parts.password = null;
    }

    return string;
};
URI.parseQuery = function(string) {
    if (!string) {
        return {};
    }

    // throw out the funky business - "?"[name"="value"&"]+
    string = string.replace(/&+/g, '&').replace(/^\?*&*|&+$/g, '');

    if (!string) {
        return {};
    }

    var items = {};
    var splits = string.split('&');
    var length = splits.length;
    var v, name, value;

    for (var i = 0; i < length; i++) {
        v = splits[i].split('=');
        name = URI.decodeQuery(v.shift());
        // no "=" is null according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#collect-url-parameters
        value = v.length ? URI.decodeQuery(v.join('=')) : null;

        if (items[name]) {
            if (typeof items[name] === "string") {
                items[name] = [items[name]];
            }

            items[name].push(value);
        } else {
            items[name] = value;
        }
    }

    return items;
};

URI.build = function(parts) {
    var t = "";

    if (parts.protocol) {
        t += parts.protocol + ":";
    }

    if (!parts.urn && (t || parts.hostname)) {
        t += '//';
    }

    t += (URI.buildAuthority(parts) || '');

    if (typeof parts.path === "string") {
        if (parts.path[0] !== '/' && typeof parts.hostname === "string") {
            t += '/';
        }

        t += parts.path;
    }

    if (typeof parts.query === "string" && parts.query) {
        t += '?' + parts.query;
    }

    if (typeof parts.fragment === "string" && parts.fragment) {
        t += '#' + parts.fragment;
    }
    return t;
};
URI.buildHost = function(parts) {
    var t = "";

    if (!parts.hostname) {
        return "";
    } else if (URI.ip6_expression.test(parts.hostname)) {
        if (parts.port) {
            t += "[" + parts.hostname + "]:" + parts.port;
        } else {
            // don't know if we should always wrap IPv6 in []
            // the RFC explicitly says SHOULD, not MUST.
            t += parts.hostname;
        }
    } else {
        t += parts.hostname;
        if (parts.port) {
            t += ':' + parts.port;
        }
    }

    return t;
};
URI.buildAuthority = function(parts) {
    return URI.buildUserinfo(parts) + URI.buildHost(parts);
};
URI.buildUserinfo = function(parts) {
    var t = "";

    if (parts.username) {
        t += URI.encode(parts.username);

        if (parts.password) {
            t += ':' + URI.encode(parts.password);
        }

        t += "@";
    }

    return t;
};
URI.buildQuery = function(data, duplicates) {
    // according to http://tools.ietf.org/html/rfc3986 or http://labs.apache.org/webarch/uri/rfc/rfc3986.html
    // being Â»-._~!$&'()*+,;=:@/?Â« %HEX and alnum are allowed
    // the RFC explicitly states ?/foo being a valid use case, no mention of parameter syntax!
    // URI.js treats the query string as being application/x-www-form-urlencoded
    // see http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type

    var t = "";
    var unique, key, i, length;
    for (key in data) {
        if (hasOwn.call(data, key) && key) {
            if (isArray(data[key])) {
                unique = {};
                for (i = 0, length = data[key].length; i < length; i++) {
                    if (data[key][i] !== undefined && unique[data[key][i] + ""] === undefined) {
                        t += "&" + URI.buildQueryParameter(key, data[key][i]);
                        if (duplicates !== true) {
                            unique[data[key][i] + ""] = true;
                        }
                    }
                }
            } else if (data[key] !== undefined) {
                t += '&' + URI.buildQueryParameter(key, data[key]);
            }
        }
    }

    return t.substring(1);
};
URI.buildQueryParameter = function(name, value) {
    // http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type -- application/x-www-form-urlencoded
    // don't append "=" for null values, according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#url-parameter-serialization
    return URI.encodeQuery(name) + (value !== null ? "=" + URI.encodeQuery(value) : "");
};

URI.addQuery = function(data, name, value) {
    if (typeof name === "object") {
        for (var key in name) {
            if (hasOwn.call(name, key)) {
                URI.addQuery(data, key, name[key]);
            }
        }
    } else if (typeof name === "string") {
        if (data[name] === undefined) {
            data[name] = value;
            return;
        } else if (typeof data[name] === "string") {
            data[name] = [data[name]];
        }

        if (!isArray(value)) {
            value = [value];
        }

        data[name] = data[name].concat(value);
    } else {
        throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
    }
};
URI.removeQuery = function(data, name, value) {
    var i, length, key;
    
    if (isArray(name)) {
        for (i = 0, length = name.length; i < length; i++) {
            data[name[i]] = undefined;
        }
    } else if (typeof name === "object") {
        for (key in name) {
            if (hasOwn.call(name, key)) {
                URI.removeQuery(data, key, name[key]);
            }
        }
    } else if (typeof name === "string") {
        if (value !== undefined) {
            if (data[name] === value) {
                data[name] = undefined;
            } else if (isArray(data[name])) {
                data[name] = filterArrayValues(data[name], value);
            }
        } else {
            data[name] = undefined;
        }
    } else {
        throw new TypeError("URI.addQuery() accepts an object, string as the first parameter");
    }
};

URI.commonPath = function(one, two) {
    var length = Math.min(one.length, two.length);
    var pos;

    // find first non-matching character
    for (pos = 0; pos < length; pos++) {
        if (one[pos] !== two[pos]) {
            pos--;
            break;
        }
    }

    if (pos < 1) {
        return one[0] === two[0] && one[0] === '/' ? '/' : '';
    }

    // revert to last /
    if (one[pos] !== '/') {
        pos = one.substring(0, pos).lastIndexOf('/');
    }

    return one.substring(0, pos + 1);
};

URI.withinString = function(string, callback) {
    // expression used is "gruber revised" (@gruber v2) determined to be the best solution in
    // a regex sprint we did a couple of ages ago at
    // * http://mathiasbynens.be/demo/url-regex
    // * http://rodneyrehm.de/t/url-regex.html

    return string.replace(URI.find_uri_expression, callback);
};

URI.ensureValidHostname = function(v) {
    // Theoretically URIs allow percent-encoding in Hostnames (according to RFC 3986)
    // they are not part of DNS and therefore ignored by URI.js

    if (v.match(URI.invalid_hostname_characters)) {
        // test punycode
        if (!punycode) {
            throw new TypeError("Hostname '" + v + "' contains characters other than [A-Z0-9.-] and Punycode.js is not available");
        }

        if (punycode.toASCII(v).match(URI.invalid_hostname_characters)) {
            throw new TypeError("Hostname '" + v + "' contains characters other than [A-Z0-9.-]");
        }
    }
};

p.build = function(deferBuild) {
    if (deferBuild === true) {
        this._deferred_build = true;
    } else if (deferBuild === undefined || this._deferred_build) {
        this._string = URI.build(this._parts);
        this._deferred_build = false;
    }

    return this;
};

p.clone = function() {
    return new URI(this);
};

p.valueOf = p.toString = function() {
    return this.build(false)._string;
};

// generate simple accessors
_parts = {protocol: 'protocol', username: 'username', password: 'password', hostname: 'hostname',  port: 'port'};
generateAccessor = function(_part){
    return function(v, build) {
        if (v === undefined) {
            return this._parts[_part] || "";
        } else {
            this._parts[_part] = v;
            this.build(!build);
            return this;
        }
    };
};

for (_part in _parts) {                                                                                                                                                                                        
    p[_part] = generateAccessor(_parts[_part]);
}

// generate accessors with optionally prefixed input
_parts = {query: '?', fragment: '#'};
generateAccessor = function(_part, _key){
    return function(v, build) {
        if (v === undefined) {
            return this._parts[_part] || "";
        } else {
            if (v !== null) {
                v = v + "";
                if (v[0] === _key) {
                    v = v.substring(1);
                }
            }

            this._parts[_part] = v;
            this.build(!build);
            return this;
        }
    };
};

for (_part in _parts) {
    p[_part] = generateAccessor(_part, _parts[_part]);
}

// generate accessors with prefixed output
_parts = {search: ['?', 'query'], hash: ['#', 'fragment']};
generateAccessor = function(_part, _key){
    return function(v, build) {
        var t = this[_part](v, build);
        return typeof t === "string" && t.length ? (_key + t) : t;
    };
};

for (_part in _parts) {
    p[_part] = generateAccessor(_parts[_part][1], _parts[_part][0]);
}

p.pathname = function(v, build) {
    if (v === undefined || v === true) {
        var res = this._parts.path || (this._parts.urn ? '' : '/');
        return v ? URI.decodePath(res) : res;
    } else {
        this._parts.path = v ? URI.recodePath(v) : "/";
        this.build(!build);
        return this;
    }
};
p.path = p.pathname;
p.href = function(href, build) {
    var key;
    
    if (href === undefined) {
        return this.toString();
    }

    this._string = "";
    this._parts = URI._parts();

    var _URI = href instanceof URI;
    var _object = typeof href === "object" && (href.hostname || href.path);

    
    // window.location is reported to be an object, but it's not the sort
    // of object we're looking for: 
    // * location.protocol ends with a colon
    // * location.query != object.search
    // * location.hash != object.fragment
    // simply serializing the unknown object should do the trick 
    // (for location, not for everything...)
    if (!_URI && _object && Object.prototype.toString.call(href) !== "[object Object]") {
        href = href.toString();
    }

    if (typeof href === "string") {
        this._parts = URI.parse(href, this._parts);
    } else if (_URI || _object) {
        var src = _URI ? href._parts : href;
        for (key in src) {
            if (hasOwn.call(this._parts, key)) {
                this._parts[key] = src[key];
            }
        }
    } else {
        throw new TypeError("invalid input");
    }

    this.build(!build);
    return this;
};

// identification accessors
p.is = function(what) {
    var ip = false;
    var ip4 = false;
    var ip6 = false;
    var name = false;
    var sld = false;
    var idn = false;
    var punycode = false;
    var relative = !this._parts.urn;

    if (this._parts.hostname) {
        relative = false;
        ip4 = URI.ip4_expression.test(this._parts.hostname);
        ip6 = URI.ip6_expression.test(this._parts.hostname);
        ip = ip4 || ip6;
        name = !ip;
        sld = name && SLD && SLD.has(this._parts.hostname);
        idn = name && URI.idn_expression.test(this._parts.hostname);
        punycode = name && URI.punycode_expression.test(this._parts.hostname);
    }

    switch (what.toLowerCase()) {
        case 'relative':
            return relative;

        case 'absolute':
            return !relative;

        // hostname identification
        case 'domain':
        case 'name':
            return name;

        case 'sld':
            return sld;

        case 'ip':
            return ip;

        case 'ip4':
        case 'ipv4':
        case 'inet4':
            return ip4;

        case 'ip6':
        case 'ipv6':
        case 'inet6':
            return ip6;

        case 'idn':
            return idn;

        case 'url':
            return !this._parts.urn;

        case 'urn':
            return !!this._parts.urn;

        case 'punycode':
            return punycode;
    }

    return null;
};

// component specific input validation
var _protocol = p.protocol;
var _port = p.port;
var _hostname = p.hostname;

p.protocol = function(v, build) {
    if (v !== undefined) {
        if (v) {
            // accept trailing ://
            v = v.replace(/:(\/\/)?$/, '');

            if (v.match(/[^a-zA-z0-9\.+-]/)) {
                throw new TypeError("Protocol '" + v + "' contains characters other than [A-Z0-9.+-]");
            }
        }
    }
    return _protocol.call(this, v, build);
};
p.scheme = p.protocol;
p.port = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v !== undefined) {
        if (v === 0) {
            v = null;
        }

        if (v) {
            v += "";
            if (v[0] === ":") {
                v = v.substring(1);
            }

            if (v.match(/[^0-9]/)) {
                throw new TypeError("Port '" + v + "' contains characters other than [0-9]");
            }
        }
    }
    return _port.call(this, v, build);
};
p.hostname = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v !== undefined) {
        var x = {};
        URI.parseHost(v, x);
        v = x.hostname;
    }
    return _hostname.call(this, v, build);
};

// compound accessors
p.host = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined) {
        return this._parts.hostname ? URI.buildHost(this._parts) : "";
    } else {
        URI.parseHost(v, this._parts);
        this.build(!build);
        return this;
    }
};
p.authority = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined) {
        return this._parts.hostname ? URI.buildAuthority(this._parts) : "";
    } else {
        URI.parseAuthority(v, this._parts);
        this.build(!build);
        return this;
    }
};
p.userinfo = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined) {
        if (!this._parts.username) {
            return "";
        }

        var t = URI.buildUserinfo(this._parts);
        return t.substring(0, t.length -1);
    } else {
        if (v[v.length-1] !== '@') {
            v += '@';
        }

        URI.parseUserinfo(v, this._parts);
        this.build(!build);
        return this;
    }
};
p.resource = function(v, build) {
    var parts;
    
    if (v === undefined) {
        return this.path() + this.search() + this.hash();
    }
    
    parts = URI.parse(v);
    this._parts.path = parts.path;
    this._parts.query = parts.query;
    this._parts.fragment = parts.fragment;
    this.build(!build);
    return this;
};

// fraction accessors
p.subdomain = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    // convenience, return "www" from "www.example.org"
    if (v === undefined) {
        if (!this._parts.hostname || this.is('IP')) {
            return "";
        }

        // grab domain and add another segment
        var end = this._parts.hostname.length - this.domain().length - 1;
        return this._parts.hostname.substring(0, end) || "";
    } else {
        var e = this._parts.hostname.length - this.domain().length;
        var sub = this._parts.hostname.substring(0, e);
        var replace = new RegExp('^' + escapeRegEx(sub));

        if (v && v[v.length - 1] !== '.') {
            v += ".";
        }

        if (v) {
            URI.ensureValidHostname(v);
        }

        this._parts.hostname = this._parts.hostname.replace(replace, v);
        this.build(!build);
        return this;
    }
};
p.domain = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (typeof v === 'boolean') {
        build = v;
        v = undefined;
    }

    // convenience, return "example.org" from "www.example.org"
    if (v === undefined) {
        if (!this._parts.hostname || this.is('IP')) {
            return "";
        }

        // if hostname consists of 1 or 2 segments, it must be the domain
        var t = this._parts.hostname.match(/\./g);
        if (t && t.length < 2) {
            return this._parts.hostname;
        }

        // grab tld and add another segment
        var end = this._parts.hostname.length - this.tld(build).length - 1;
        end = this._parts.hostname.lastIndexOf('.', end -1) + 1;
        return this._parts.hostname.substring(end) || "";
    } else {
        if (!v) {
            throw new TypeError("cannot set domain empty");
        }

        URI.ensureValidHostname(v);

        if (!this._parts.hostname || this.is('IP')) {
            this._parts.hostname = v;
        } else {
            var replace = new RegExp(escapeRegEx(this.domain()) + "$");
            this._parts.hostname = this._parts.hostname.replace(replace, v);
        }

        this.build(!build);
        return this;
    }
};
p.tld = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (typeof v === 'boolean') {
        build = v;
        v = undefined;
    }

    // return "org" from "www.example.org"
    if (v === undefined) {
        if (!this._parts.hostname || this.is('IP')) {
            return "";
        }

        var pos = this._parts.hostname.lastIndexOf('.');
        var tld = this._parts.hostname.substring(pos + 1);

        if (build !== true && SLD && SLD.list[tld.toLowerCase()]) {
            return SLD.get(this._parts.hostname) || tld;
        }

        return tld;
    } else {
        var replace;
        
        if (!v) {
            throw new TypeError("cannot set TLD empty");
        } else if (v.match(/[^a-zA-Z0-9-]/)) {
            if (SLD && SLD.is(v)) {
                replace = new RegExp(escapeRegEx(this.tld()) + "$");
                this._parts.hostname = this._parts.hostname.replace(replace, v);
            } else {
                throw new TypeError("TLD '" + v + "' contains characters other than [A-Z0-9]");
            }
        } else if (!this._parts.hostname || this.is('IP')) {
            throw new ReferenceError("cannot set TLD on non-domain host");
        } else {
            replace = new RegExp(escapeRegEx(this.tld()) + "$");
            this._parts.hostname = this._parts.hostname.replace(replace, v);
        }

        this.build(!build);
        return this;
    }
};
p.directory = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
        if (!this._parts.path && !this._parts.hostname) {
            return '';
        }

        if (this._parts.path === '/') {
            return '/';
        }

        var end = this._parts.path.length - this.filename().length - 1;
        var res = this._parts.path.substring(0, end) || (this._parts.hostname ? "/" : "");

        return v ? URI.decodePath(res) : res;

    } else {
        var e = this._parts.path.length - this.filename().length;
        var directory = this._parts.path.substring(0, e);
        var replace = new RegExp('^' + escapeRegEx(directory));

        // fully qualifier directories begin with a slash
        if (!this.is('relative')) {
            if (!v) {
                v = '/';
            }

            if (v[0] !== '/') {
                v = "/" + v;
            }
        }

        // directories always end with a slash
        if (v && v[v.length - 1] !== '/') {
            v += '/';
        }

        v = URI.recodePath(v);
        this._parts.path = this._parts.path.replace(replace, v);
        this.build(!build);
        return this;
    }
};
p.filename = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
        if (!this._parts.path || this._parts.path === '/') {
            return "";
        }

        var pos = this._parts.path.lastIndexOf('/');
        var res = this._parts.path.substring(pos+1);

        return v ? URI.decodePathSegment(res) : res;
    } else {
        var mutatedDirectory = false;
        
        if (v[0] === '/') {
            v = v.substring(1);
        }

        if (v.match(/\.?\//)) {
            mutatedDirectory = true;
        }

        var replace = new RegExp(escapeRegEx(this.filename()) + "$");
        v = URI.recodePath(v);
        this._parts.path = this._parts.path.replace(replace, v);

        if (mutatedDirectory) {
            this.normalizePath(build);
        } else {
            this.build(!build);
        }

        return this;
    }
};
p.suffix = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
        if (!this._parts.path || this._parts.path === '/') {
            return "";
        }

        var filename = this.filename();
        var pos = filename.lastIndexOf('.');
        var s, res;

        if (pos === -1) {
            return "";
        }

        // suffix may only contain alnum characters (yup, I made this up.)
        s = filename.substring(pos+1);
        res = (/^[a-z0-9%]+$/i).test(s) ? s : "";
        return v ? URI.decodePathSegment(res) : res;
    } else {
        if (v[0] === '.') {
            v = v.substring(1);
        }

        var suffix = this.suffix();
        var replace;

        if (!suffix) {
            if (!v) {
                return this;
            }

            this._parts.path += '.' + URI.recodePath(v);
        } else if (!v) {
            replace = new RegExp(escapeRegEx("." + suffix) + "$");
        } else {
            replace = new RegExp(escapeRegEx(suffix) + "$");
        }

        if (replace) {
            v = URI.recodePath(v);
            this._parts.path = this._parts.path.replace(replace, v);
        }

        this.build(!build);
        return this;
    }
};
p.segment = function(segment, v, build) {
    var separator = this._parts.urn ? ':' : '/';
    var path = this.path();
    var absolute = path.substring(0, 1) === '/';
    var segments = path.split(separator);

    if (typeof segment !== 'number') {
        build = v;
        v = segment;
        segment = undefined;
    }

    if (segment !== undefined && typeof segment !== 'number') {
        throw new Error("Bad segment '" + segment + "', must be 0-based integer");
    }

    if (absolute) {
        segments.shift();
    }

    if (segment < 0) {
        // allow negative indexes to address from the end
        segment = Math.max(segments.length + segment, 0);
    }

    if (v === undefined) {
        return segment === undefined
            ? segments
            : segments[segment];
    } else if (segment === null || segments[segment] === undefined) {
        if (isArray(v)) {
            segments = v;
        } else if (v || (typeof v === "string" && v.length)) {
            if (segments[segments.length -1] === "") {
                // empty trailing elements have to be overwritten
                // to prefent results such as /foo//bar
                segments[segments.length -1] = v;
            } else {
                segments.push(v);
            }
        }
    } else {
        if (v || (typeof v === "string" && v.length)) {
            segments[segment] = v;
        } else {
            segments.splice(segment, 1);
        }
    }

    if (absolute) {
        segments.unshift("");
    }

    return this.path(segments.join(separator), build);
};

// mutating query string
var q = p.query;
p.query = function(v, build) {
    if (v === true) {
        return URI.parseQuery(this._parts.query);
    } else if (v !== undefined && typeof v !== "string") {
        this._parts.query = URI.buildQuery(v, this._parts.duplicateQueryParameters);
        this.build(!build);
        return this;
    } else {
        return q.call(this, v, build);
    }
};
p.addQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query);
    URI.addQuery(data, name, value === undefined ? null : value);
    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters);
    if (typeof name !== "string") {
        build = value;
    }

    this.build(!build);
    return this;
};
p.removeQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query);
    URI.removeQuery(data, name, value);
    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters);
    if (typeof name !== "string") {
        build = value;
    }

    this.build(!build);
    return this;
};
p.addSearch = p.addQuery;
p.removeSearch = p.removeQuery;

// sanitizing URLs
p.normalize = function() {
    if (this._parts.urn) {
        return this
            .normalizeProtocol(false)
            .normalizeQuery(false)
            .normalizeFragment(false)
            .build();
    }

    return this
        .normalizeProtocol(false)
        .normalizeHostname(false)
        .normalizePort(false)
        .normalizePath(false)
        .normalizeQuery(false)
        .normalizeFragment(false)
        .build();
};
p.normalizeProtocol = function(build) {
    if (typeof this._parts.protocol === "string") {
        this._parts.protocol = this._parts.protocol.toLowerCase();
        this.build(!build);
    }

    return this;
};
p.normalizeHostname = function(build) {
    if (this._parts.hostname) {
        if (this.is('IDN') && punycode) {
            this._parts.hostname = punycode.toASCII(this._parts.hostname);
        } else if (this.is('IPv6') && IPv6) {
            this._parts.hostname = IPv6.best(this._parts.hostname);
        }

        this._parts.hostname = this._parts.hostname.toLowerCase();
        this.build(!build);
    }

    return this;
};
p.normalizePort = function(build) {
    // remove port of it's the protocol's default
    if (typeof this._parts.protocol === "string" && this._parts.port === URI.defaultPorts[this._parts.protocol]) {
        this._parts.port = null;
        this.build(!build);
    }

    return this;
};
p.normalizePath = function(build) {
    if (this._parts.urn) {
        return this;
    }

    if (!this._parts.path || this._parts.path === '/') {
        return this;
    }

    var _was_relative;
    var _was_relative_prefix;
    var _path = this._parts.path;
    var _parent, _pos;

    // handle relative paths
    if (_path[0] !== '/') {
        if (_path[0] === '.') {
            _was_relative_prefix = _path.substring(0, _path.indexOf('/'));
        }
        _was_relative = true;
        _path = '/' + _path;
    }
    // resolve simples
    _path = _path.replace(/(\/(\.\/)+)|\/{2,}/g, '/');
    // resolve parents
    while (true) {
        _parent = _path.indexOf('/../');
        if (_parent === -1) {
            // no more ../ to resolve
            break;
        } else if (_parent === 0) {
            // top level cannot be relative...
            _path = _path.substring(3);
            break;
        }

        _pos = _path.substring(0, _parent).lastIndexOf('/');
        if (_pos === -1) {
            _pos = _parent;
        }
        _path = _path.substring(0, _pos) + _path.substring(_parent + 3);
    }
    // revert to relative
    if (_was_relative && this.is('relative')) {
        if (_was_relative_prefix){
            _path = _was_relative_prefix + _path;
        } else {
            _path = _path.substring(1);
        }
    }

    _path = URI.recodePath(_path);
    this._parts.path = _path;
    this.build(!build);
    return this;
};
p.normalizePathname = p.normalizePath;
p.normalizeQuery = function(build) {
    if (typeof this._parts.query === "string") {
        if (!this._parts.query.length) {
            this._parts.query = null;
        } else {
            this.query(URI.parseQuery(this._parts.query));
        }

        this.build(!build);
    }

    return this;
};
p.normalizeFragment = function(build) {
    if (!this._parts.fragment) {
        this._parts.fragment = null;
        this.build(!build);
    }

    return this;
};
p.normalizeSearch = p.normalizeQuery;
p.normalizeHash = p.normalizeFragment;

p.iso8859 = function() {
    // expect unicode input, iso8859 output
    var e = URI.encode;
    var d = URI.decode;

    URI.encode = escape;
    URI.decode = decodeURIComponent;
    this.normalize();
    URI.encode = e;
    URI.decode = d;
    return this;
};

p.unicode = function() {
    // expect iso8859 input, unicode output
    var e = URI.encode;
    var d = URI.decode;

    URI.encode = strictEncodeURIComponent;
    URI.decode = unescape;
    this.normalize();
    URI.encode = e;
    URI.decode = d;
    return this;
};

p.readable = function() {
    var uri = this.clone();
    // removing username, password, because they shouldn't be displayed according to RFC 3986
    uri.username("").password("").normalize();
    var t = '';
    if (uri._parts.protocol) {
        t += uri._parts.protocol + '://';
    }

    if (uri._parts.hostname) {
        if (uri.is('punycode') && punycode) {
            t += punycode.toUnicode(uri._parts.hostname);
            if (uri._parts.port) {
                t += ":" + uri._parts.port;
            }
        } else {
            t += uri.host();
        }
    }

    if (uri._parts.hostname && uri._parts.path && uri._parts.path[0] !== '/') {
        t += '/';
    }

    t += uri.path(true);
    if (uri._parts.query) {
        var q = '';
        for (var i = 0, qp = uri._parts.query.split('&'), l = qp.length; i < l; i++) {
            var kv = (qp[i] || "").split('=');
            q += '&' + URI.decodeQuery(kv[0])
                .replace(/&/g, '%26');

            if (kv[1] !== undefined) {
                q += "=" + URI.decodeQuery(kv[1])
                    .replace(/&/g, '%26');
            }
        }
        t += '?' + q.substring(1);
    }

    t += uri.hash();
    return t;
};

// resolving relative and absolute URLs
p.absoluteTo = function(base) {
    var resolved = this.clone();
    var properties = ['protocol', 'username', 'password', 'hostname', 'port'];
    var basedir, i, p;

    if (this._parts.urn) {
        throw new Error('URNs do not have any generally defined hierachical components');
    }

    if (this._parts.hostname) {
        return resolved;
    }

    if (!(base instanceof URI)) {
        base = new URI(base);
    }

    for (i = 0, p; p = properties[i]; i++) {
        resolved._parts[p] = base._parts[p];
    }
    
    properties = ['query', 'path'];
    for (i = 0, p; p = properties[i]; i++) {
        if (!resolved._parts[p] && base._parts[p]) {
            resolved._parts[p] = base._parts[p];
        }
    }

    if (resolved.path()[0] !== '/') {
        basedir = base.directory();
        resolved._parts.path = (basedir ? (basedir + '/') : '') + resolved._parts.path;
        resolved.normalizePath();
    }

    resolved.build();
    return resolved;
};
p.relativeTo = function(base) {
    var relative = this.clone();
    var properties = ['protocol', 'username', 'password', 'hostname', 'port'];
    var common, _base, _this, _base_diff, _this_diff;

    if (this._parts.urn) {
        throw new Error('URNs do not have any generally defined hierachical components');
    }

    if (!(base instanceof URI)) {
        base = new URI(base);
    }

    if (this.path()[0] !== '/' || base.path()[0] !== '/') {
        throw new Error('Cannot calculate common path from non-relative URLs');
    }

    // determine common sub path
    common = URI.commonPath(relative.path(), base.path());
    
    // no relation if there's nothing in common 
    if (!common || common === '/') {
        return relative;
    }
    
    // relative paths don't have authority
    for (var i = 0, p; p = properties[i]; i++) {
        relative._parts[p] = null;
    }
    
    _base = base.directory();
    _this = this.directory();
    
    // base and this are on the same level
    if (_base === _this) {
        relative._parts.path = './' + relative.filename();
        return relative.build();
    }
    
    _base_diff = _base.substring(common.length);
    _this_diff = _this.substring(common.length);
    
    // this is a descendant of base
    if (_base + '/' === common) {
        if (_this_diff) {
            _this_diff += '/';
        }
        
        relative._parts.path = './' + _this_diff + relative.filename();
        return relative.build();
    } 

    // this is a descendant of base
    var parents = '../';
    var _common = new RegExp('^' + escapeRegEx(common));
    var _parents = _base.replace(_common, '/').match(/\//g).length -1;

    while (_parents--) {
        parents += '../';
    }

    relative._parts.path = relative._parts.path.replace(_common, parents);
    return relative.build();
};

// comparing URIs
p.equals = function(uri) {
    var one = this.clone();
    var two = new URI(uri);
    var one_map = {};
    var two_map = {};
    var checked = {};
    var one_query, two_query, key;

    one.normalize();
    two.normalize();

    // exact match
    if (one.toString() === two.toString()) {
        return true;
    }

    // extract query string
    one_query = one.query();
    two_query = two.query();
    one.query("");
    two.query("");

    // definitely not equal if not even non-query parts match
    if (one.toString() !== two.toString()) {
        return false;
    }

    // query parameters have the same length, even if they're permutated
    if (one_query.length !== two_query.length) {
        return false;
    }

    one_map = URI.parseQuery(one_query);
    two_map = URI.parseQuery(two_query);

    for (key in one_map) {
        if (hasOwn.call(one_map, key)) {
            if (!isArray(one_map[key])) {
                if (one_map[key] !== two_map[key]) {
                    return false;
                }
            } else {
                if (!isArray(two_map[key])) {
                    return false;
                }

                // arrays can't be equal if they have different amount of content
                if (one_map[key].length !== two_map[key].length) {
                    return false;
                }

                one_map[key].sort();
                two_map[key].sort();

                for (var i = 0, l = one_map[key].length; i < l; i++) {
                    if (one_map[key][i] !== two_map[key][i]) {
                        return false;
                    }
                }
            }

            checked[key] = true;
        }
    }

    for (key in two_map) {
        if (hasOwn.call(two_map, key)) {
            if (!checked[key]) {
                // two contains a parameter not present in one
                return false;
            }
        }
    }

    return true;
};

// state
p.duplicateQueryParameters = function(v) {
    this._parts.duplicateQueryParameters = !!v;
    return this;
};

return URI;
}));
;
/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/
   Version: 0.9
	Author:  Stefan Goessner/2006
	Web:     http://goessner.net/ 
*/

function json2xml(o, tab) {
   var toXml = function(v, name, ind) {
      var xml = "";
      if (v instanceof Array) {
         for (var i=0, n=v.length; i<n; i++)
            xml += ind + toXml(v[i], name, ind+"\t") + "\n";
      }
      else if (typeof(v) == "object") {
         var hasChild = false;
         xml += ind + "<" + name;
         for (var m in v) {
            if (m.charAt(0) == "@") {
			   if ( v[m] )
			   	xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
            } else
               hasChild = true;
         }
         xml += hasChild ? ">" : "/>";
         if (hasChild) {
            for (var m in v) {
               if (m == "#text")
                  xml += v[m];
               else if (m == "#cdata")
                  xml += "<![CDATA[" + v[m] + "]]>";
               else if (m.charAt(0) != "@")
                  xml += toXml(v[m], m, ind+"\t");
            }
            xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
         }
      }
      else {
         xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";
      }
      return xml;
   }, xml="";
   for (var m in o)
      xml += toXml(o[m], m, "");
   return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
}

if (!String.prototype.encodeHTML) {
  String.prototype.encodeHTML = function () {
    return this.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;');
  };
}

/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/
   Version: 0.9
	Author:  Stefan Goessner/2006
	Web:     http://goessner.net/ 
*/
function xml2json(xml, tab) {
   var X = {
      toObj: function(xml) {
         var o = {};
         if (xml.nodeType==1) {   // element node ..
            if (xml.attributes.length)   // element with attributes  ..
               for (var i=0; i<xml.attributes.length; i++)
                  o["@"+xml.attributes[i].nodeName.toLowerCase()] = (xml.attributes[i].nodeValue||"").toString();
            if (xml.firstChild) { // element has child nodes ..
               var textChild=0, cdataChild=0, hasElementChild=false;
               for (var n=xml.firstChild; n; n=n.nextSibling) {
                  if (n.nodeType==1) hasElementChild = true;
                  else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                  else if (n.nodeType==4) cdataChild++; // cdata section node
               }
               if (hasElementChild) {
                  if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                     X.removeWhite(xml);
                     for (var n=xml.firstChild; n; n=n.nextSibling) {
                        if (n.nodeType == 3)  // text node
                           o["#text"] = X.escape(n.nodeValue);
                        else if (n.nodeType == 4)  // cdata node
                           o["#cdata"] = X.escape(n.nodeValue);
                        else if (o[n.nodeName]) {  // multiple occurence of element ..
                           if (o[n.nodeName] instanceof Array)
                              o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                           else
                              o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                        }
                        else  // first occurence of element..
                           o[n.nodeName] = X.toObj(n);
                     }
                  }
                  else { // mixed content
                     if (!xml.attributes.length)
                        o = X.escape(X.innerXml(xml));
                     else
                        o["#text"] = X.escape(X.innerXml(xml));
                  }
               }
               else if (textChild) { // pure text
                  if (!xml.attributes.length)
                     o = X.escape(X.innerXml(xml));
                  else
                     o["#text"] = X.escape(X.innerXml(xml));
               }
               else if (cdataChild) { // cdata
                  if (cdataChild > 1)
                     o = X.escape(X.innerXml(xml));
                  else
                     for (var n=xml.firstChild; n; n=n.nextSibling)
                        o["#cdata"] = X.escape(n.nodeValue);
               }
            }
            if (!xml.attributes.length && !xml.firstChild) o = null;
         }
         else if (xml.nodeType==9) { // document.node
            o = X.toObj(xml.documentElement);
         }
         else
            alert("unhandled node type: " + xml.nodeType);
         return o;
      },
      toJson: function(o, name, ind) {
         var json = name ? ("\""+name+"\"") : "";
         if (o instanceof Array) {
            for (var i=0,n=o.length; i<n; i++)
               o[i] = X.toJson(o[i], "", ind+"\t");
            json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
         }
         else if (o == null)
            json += (name&&":") + "null";
         else if (typeof(o) == "object") {
            var arr = [];
            for (var m in o)
               arr[arr.length] = X.toJson(o[m], m, ind+"\t");
            json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
         }
         else if (typeof(o) == "string")
            json += (name&&":") + "\"" + o.toString() + "\"";
         else
            json += (name&&":") + o.toString();
         return json;
      },
      innerXml: function(node) {
         var s = "";
         if ("innerHTML" in node)
            s = node.innerHTML;
         else {
            var asXml = function(n) {
               var s = "";
               if (n.nodeType == 1) {
                  s += "<" + n.nodeName;
                  for (var i=0; i<n.attributes.length;i++)
                     s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
                  if (n.firstChild) {
                     s += ">";
                     for (var c=n.firstChild; c; c=c.nextSibling)
                        s += asXml(c);
                     s += "</"+n.nodeName+">";
                  }
                  else
                     s += "/>";
               }
               else if (n.nodeType == 3)
                  s += n.nodeValue;
               else if (n.nodeType == 4)
                  s += "<![CDATA[" + n.nodeValue + "]]>";
               return s;
            };
            for (var c=node.firstChild; c; c=c.nextSibling)
               s += asXml(c);
         }
         return s;
      },
      escape: function(txt) {
         return txt.replace(/[\\]/g, "\\\\")
                   .replace(/[\"]/g, '\\"')
                   .replace(/[\n]/g, '\\n')
                   .replace(/[\r]/g, '\\r');
      },
      removeWhite: function(e) {
         e.normalize();
         for (var n = e.firstChild; n; ) {
            if (n.nodeType == 3) {  // text node
               if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                  var nxt = n.nextSibling;
                  e.removeChild(n);
                  n = nxt;
               }
               else
                  n = n.nextSibling;
            }
            else if (n.nodeType == 1) {  // element node
               X.removeWhite(n);
               n = n.nextSibling;
            }
            else                      // any other node
               n = n.nextSibling;
         }
         return e;
      }
   };
   if (xml.nodeType == 9) // document node
      xml = xml.documentElement;


   // I don't need json.......
   return X.toObj(X.removeWhite(xml));


   var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
   return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
}



if (!String.prototype.decodeHTML) {
  String.prototype.decodeHTML = function () {
    return this.replace(/&quot;/g, '"')
               .replace(/&gt;/g, '>')
               .replace(/&lt;/g, '<')
               .replace(/&amp;/g, '&');
  };
}
;
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
;
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
;
// Application host UI methods
// Chrome

UI.chrome = {
	initialize: function() {},
	
	openTab: function(url, callback) {
		callback = callback || function() {};
		
		chrome.tabs.create({
			url: url
		}, function(tab) {
			callback(tab.id);
		});
	},
	
	closeTab: function(tabId, callback) {
		callback = callback || function() {};
		chrome.tabs.remove(tabId, function() {
			callback();
		});
	},
	
	onTabRemoved: function(callback) {
		chrome.tabs.onRemoved.addListener(callback);
	},
	
	removeOnTabRemoved: function(callback) {
		chrome.tabs.onRemoved.removeListener(callback);
	},
	
	setBadge: function(text) {
		chrome.browserAction.setBadgeText({text: text.toString()});
	},
	
	setBadgeIcon: function(img, tab) {
		var params = {
			path: img
		};
		
		if ( tab )
			params.tabId = tab;
		
		chrome.browserAction.setIcon(params);
	},
	
	currentTab: function(callback) {
		try {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				callback(tabs[0]);
			});
		} catch (e) {
			chrome.tabs.getSelected(null, function(tab) {
				callback(tab);
			});
		}
	},
	
	tabChangeURL: function(tabId, url) {
		chrome.tabs.update(tabId, {url: url});
	},
	
	getTab: function(tabId, callback) {
		chrome.tabs.get(tabId, function(tab) {
			callback({
				url: tab.url,
				title: tab.title
			});
		});
	},
	
	selectTab: function(tabId, callback) {
		chrome.tabs.update(tabId, {active: true}, function() {
			fireCallback(callback);
		});
	},
	
	openPopup: function(url, callback) {
		var win = window.open(url, null, 'width=500,height=400');
		fireCallback(callback, win);
	},
	
	getIntentFeedURL: function() {
		var intent = window.webkitIntent;
		var url;
		if (intent && intent.getExtra) {
		  // handle the old path
		  url = intent.getExtra("url");
		} else if ( intent ) {
		  // the new path
		  url = intent.data[0].url;
		}
		if ( !url )
			return "ERROR";
		return url;
	},
	
	setPopupSize: function(w, h) {
		// NoOp
	},
	
	closePopup: function() {
		// NoOp
	},
	
	showPopup: function() {
		// NoOp :'(
	},
	
	// Specified in manifest.json
	addGoogleReaderContentScript: function() {},
	removeGoogleReaderContentScript: function() {}
};

UI.chrome.Notifications = new (Class.extend({
	initialize: function() {},
	
	image: '/icons/icon48x48.png',
	duration: 15000,
	
	can: function() {
		return window.webkitNotifications.checkPermission() == 0;
	},
	
	// Has to be triggered from user action
	ask: function(callback) {
		window.webkitNotifications.requestPermission(callback || function() {});
	},
	
	show: function(title, message, options) {
		options = options || {};
		options.link = options.link || function() {};
		
		var note = window.webkitNotifications.createNotification(this.image, title, message);
		note.onclick = function() {
			window.focus();
			options.link();
			note.cancel();
		};
		
		note.show();
		
		setTimeout(function() {
			note.cancel();
		}, this.duration);
		
		return note;
	}
}))();
;
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

;
// Application host UI methods
// Safari

UI.safari = {
	tabGUID: 1,
	
	initialize: function() {
		safari.application.addEventListener("activate", this.onTabChangedState, true);
		safari.application.addEventListener("open", this.onTabChangedState, true);
		safari.application.addEventListener("navigate", this.onTabChangedState, true);
		this.__tabImages = {};
		this.__tabImageUrls = {};
	},
	
	onTabChangedState: function(e) {
		var tab = e.target;
		if ( tab.activeTab )
			tab = tab.activeTab;
		UI.__ensureId(tab);
		if ( UI.__tabImages[tab.__feederId] && UI.__tabImageUrls[tab.__feederId] == tab.url )
			UI.setBadgeIcon(UI.__tabImages[tab.__feederId], tab.__feederId);
		else
			UI.setBadgeIcon(Config.icon.standard, tab.__feederId)
	},
	
	openTab: function(url, callback) {
		callback = callback || function() {};
		
		var tab = safari.application.activeBrowserWindow.openTab();
		tab.url = url;
		UI.__ensureId(tab);
		
		callback(tab);
	},
	
	closeTab: function(tab, callback) {
		callback = callback || function() {};
		this.__getNativeTab(tab).close();
		callback();
	},
	
	onTabRemoved: function(callback) {
		callback._uiWrapped = function(e) {
			if (e.command != "close-tab")
				return;
			callback();
		};
		safari.application.addEventListener("command", callback._uiWrapped, false);
	},
	
	removeOnTabRemoved: function(callback) {
		safari.application.removeEventListener("command", callback._uiWrapped, false);
	},
	
	setBadge: function(text) {
		safari.extension.toolbarItems.forEach(function(bar) {
			bar.badge = parseInt(text, 10);
		});
	},
	
	setBadgeIcon: function(img, tabId) {
		var tab = false;
		if ( typeof tabId !== "undefined" ) {
			tab = this.getTab(tabId);
			if ( ! tab )
				return;
			UI.__tabImages[tab.id] = img;
			UI.__tabImageUrls[tab.id] = this.__getNativeTab(tabId).url;
		}
		
		UI.currentTab(function(currentTab) {
			if ( ! tab || currentTab.id == tabId ) {
				safari.extension.toolbarItems.forEach(function(bar) {
					bar.image = img;
				});
			}
		});
	},
	
	currentTab: function(callback) {
		callback(new Platform.env.OpaqueTab(safari.application.activeBrowserWindow.activeTab));
	},
	
	tabChangeURL: function(tabId, url) {
		this.__getNativeTab(tabId).url = url;
	},
	
	// The return is only for Safari, making my life easier
	getTab: function(tabId, callback) {
		var t = false;
		for ( var i = 0, win; win = safari.application.browserWindows[i]; i++) {
			if ( ! win.tabs )
				continue;
			
			for ( var x = 0, tab; tab = win.tabs[x]; x++ )
				if ( tab.__feederId === tabId ) {
					var t = new Platform.env.OpaqueTab(tab);
					fireCallback(callback, new Platform.env.OpaqueTab(tab));
					return t;
				}
		}
		fireCallback(callback, false);
		return false;
	},
	
	__getNativeTab: function(tabId) {
		return this.getTab(tabId).__tab;
	},
	
	selectTab: function(tabId, callback) {
		this.__getNativeTab(tabId).active();
		fireCallback(callback);
	},
	
	openPopup: function(url, callback) {
		var win = window.open(url, null, 'width=500,height=400');
		fireCallback(callback, win);
	},
	
	getIntentFeedURL: function() {
		return false;
	},
		
	setPopupSize: function(w, h) {
		safari.extension.popovers[0].width = w;
		safari.extension.popovers[0].height = h;
	},
	
	closePopup: function() {
		safari.extension.popovers[0].hide();
	},
	
	showPopup: function() {
		safari.extension.toolbarItems.forEach(function(bar) {
			bar.showPopover();
		})
	},
	
	addGoogleReaderContentScript: function() {
		safari.extension.addContentScriptFromURL(Ext.path("content/googlereader.js"), ["https://accounts.google.com/o/oauth2/approval*"]);
	},
	
	removeGoogleReaderContentScript: function() {
		safari.extension.removeContentScript(Ext.path("content/googlereader.js"));
	},
	
	__ensureId: function(tab) {
		if ( typeof tab.__feederId !== "undefined" )
			return tab;
		tab.__feederId = UI.tabGUID++;
		return tab;
	}
};

UI.safari.Notifications = new (Class.extend({
	initialize: function() {},
	
	image: '/icons/icon48x48.png',
	duration: 15000,
	
	can: function() {
		return window.webkitNotifications.checkPermission() == 0;
	},
	
	// Has to be trigger from user action
	ask: function(callback) {
		window.webkitNotifications.requestPermission(callback || function() {});
	},
	
	show: function(title, message, options) {
		options.link = options.link || function() {};
		
		var note = window.webkitNotifications.createNotification(this.image, title, message);
		note.onclick = function() {
			window.focus();
			options.link();
			note.cancel();
		};
		
		note.show();
		
		setTimeout(function() {
			note.cancel();
		}, this.duration);
		
		return note;
	}
}))();
;
PlatformEnv.online = PlatformEnv.extend({
	DBAdapter: 'APIDatabase',
	
	initialize: function() {
		this._super();
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
		this.makeCallback('message', callback, function(message, sender) {
			callback(message, sender);
		});
	},
	
	removeOnMessage: function(originalCallback) {
		var wrappedCallback = this.getCallback('message', originalCallback);
		this.removeCallback('message', wrappedCallback);
	},
	
	onPopoverVisible: function(callback) {},
	removePopoverVisible: function(callback) {}
});

PlatformPort.online = Class.extend({
	initialize: function() {
		this.messageListeners = [];
		this.disconnectListeners = [];
		Platform.env.fireCallback('connect', [this]);
	},
	
	onMessage: function(callback) {
		this.messageListeners.push(callback);
	},
	
	onDisconnect: function(callback) {
		this.disconnectListeners.push(callback);
	},
	
	postMessage: function(message) {
		for ( var i = 0, callback; callback = this.messageListeners[i]; i++ )
			callback(message, this);
	},
	
	disconnect: function() {
		for ( var i = 0, callback; callback = this.disconnectListeners[i]; i++ )
			callback();
	}
});

;
// Application host UI methods
// Online

UI.online = {
	initialize: function() {
		
	},
	
	openTab: function(url, callback) {
		window.open(url);
		fireCallback(callback);
	},
	
	closeTab: function(tab, callback) {
		callback = callback || function() {};
		callback();
	},
	
	onTabRemoved: function(callback) {
		// NoOp...
	},
	
	removeOnTabRemoved: function(callback) {
		// NoOp...
	},
	
	setBadge: function(text) {
		// NoOp...
	},
	
	setBadgeIcon: function(img, tab) {
		// NoOp...
	},
	
	currentTab: function(callback) {
		callback({id: 1});
	},
	
	tabChangeURL: function(tabId, url) {
		// NoOp...?
	},
	
	getTab: function(tabId, callback) {
		callback({id: tabId});
	},
	
	selectTab: function(tabId, callback) {
		fireCallback(callback);
	},
	
	openPopup: function(url, callback) {
		var win = window.open(url, null, 'width=500,height=400');
		fireCallback(callback, win);
	},
	
	getIntentFeedURL: function() {
		return false;
	}
};

UI.online.Notifications = new (Class.extend({
	initialize: function() {},
	
	image: '/icons/icon48x48.png',
	duration: 15000,
	
	can: function() {
		return window.webkitNotifications.checkPermission() == 0;
	},
	
	// Has to be trigger from user action
	ask: function(callback) {
		window.webkitNotifications.requestPermission(callback || function() {});
	},
	
	show: function(title, message, options) {
		options.link = options.link || function() {};
		
		var note = window.webkitNotifications.createNotification(this.image, title, message);
		note.onclick = function() {
			window.focus();
			options.link();
			note.cancel();
		};
		
		note.show();
		
		setTimeout(function() {
			note.cancel();
		}, this.duration);
		
		return note;
	}
}))();
;
var Database = Class.extend({
	initialize: function(name) {
		this.connect(name);
	},
	
	run: function(type, args, callback) {
		callback = callback || function() {};
		
		// Camelcase method type
		var typeMethod = type.charAt(0).toUpperCase() + type.substring(1).toLowerCase();
		
		// Build implementation dependant query object 
		if ( ! this['build' + typeMethod] )
			throw type + " not permitted";
		
		var queryObject = this['build' + typeMethod].apply(this, args);
		
		// Run query with callback
		this.executeQuery(queryObject, callback);
		
		return this;
	},
	
	onError: function(queryObject, message, callback) {
		// Just log error for now
		console.error("SQLERROR " + message);
		console.error(queryObject.sql, "failed with error", message);
		
		// Fire callback anyway? Errors should never happen in production (but they will)
		callback(false, false);
	},
	
	connect: function(name) { throw "implement"; },
	executeQuery: function(queryObject) { throw "implement"; },
	
	/*
		Method:
			makeTable
		
		Create table from schema.
		
		Format of schema:
			A key-value object where the keys are the name of the columns,
			and values are objects which describe the column. Possible values are:
			
			* type (mandatory): type to be stored. Can be either: int, text or float
			* mandatory (optional): true if field is mandatory. Default is true.
			* standard (optional): Default value.
		
		Parameters:
			name - The name of the table
			primaryKey - The primary key to use, defaults to ID
			schema - See above for description of schema
			callback - Callback when complete
	*/
	
	makeTable: function(name, primaryKey, schema, callback) { throw "implement"; },
	
	/*
		Method:
			dropTable
		
		Drop table from database. Should not fail if table doesn't exist
		
		Parameters:
			name - Name of table
			callback - Callback when complete
	*/
	
	dropTable: function(name, callback) { throw "implement"; },
	
	/*
		Method:
			tableExists
		
		Check if table exists
		
		Parameters:
			name - Name of table
			callback - Callback when called, first parameter is a boolean which is true/false depnding on if the table exists
	*/
	
	tableExists: function(name, callback) { throw "implement"; },
	
	/*
		Method:
			addIndex
			
		Add index to column
	*/
	
	addIndex: function(table, column, callback) { throw "implement"; },
	
	/*
		Method:
			addField
			
		Add a field using a schema object, by alterint table
		
		Parameters:
			table
			fieldName
			fieldData
			callback
	*/
	
	addField: function(table, fieldName, fieldData, callback) { throw "implement"; },
	
	/*
		Method:
			buildFind
		
		Build a query for finding objects. The parameters are:
		
		where:
		
			"where" can either be the string "all" or an object. An empty object has
			the same effect as "all", i.e. don't filter anything.
		
			If an object, the keys are fields and the values are values to match by.
		
			The format of the keys can be either just the field name, e.g. "id", "title",
			or it can also contain the operand to use, e.g. "id >", "id !=".
		
			Example where:
				{id: 10} => id = 10
				{'id >': 10} => id > 10
				{title: "hello world", "published >": 1331985271237} => title = "hello world" and published > 1331985271237
		
			If the value is an array it will be used to OR together several expressions for the same field.
		
			Example:
				{id: [1, 1, 2, 3, 5, 8]} => (id = 1 or id = 1 or id = 2 or id = 3 or id = 5 or id = 8)
				{'id =': [1, 2]} => (id = 10 or id = 2)
		
			Available operands are:
				=, >, <, %, !=
		
		how:
			An optional object specifying:
		
				* limit: Either one number with the count, or an array with two elements specifing the offset and count
				* by: Order by. The format is a string with: "<field> <asc|desc>", where
				                 the second argument is optional defaulting to asc.
		
			Example how:
				{limit: 10} => The first 10 from the result
				{limit 10, by: 'id'} => The first 10 order by the field name id, ascending
				{limit: 1, by: 'id desc'} => One, ordering the result set by id descending
		
		Parameters:
			Standard -build* parameters.
	*/
	
	buildFind:   function(table, primaryKey, where, how) { throw "implement"; },
	
	/*
		Method:
			buildUpdate
	*/
	
	buildUpdate: function(table, primaryKey, object) { throw "implement"; },

	/*
		Method:
			buildInsert
	*/

	buildInsert: function(table, primaryKey, object) { throw "implement"; },

	/*
		Method:
			buildDelete
	*/

	buildDelete: function(table, primaryKey, where) { throw "implement"; },
	
	/*
		Method:
			buildCount
	*/
	
	buildCount: function(table, primaryKey, where) { throw "implement"; }
});

Database.instances = {};

Database.getInstance = function(name, adapter) {
	if ( ! Database.instances[name] )
		Database.instances[name] = new window[adapter || Platform.env.DBAdapter](name);
	
	return Database.instances[name];
};

Database.switchDatabase = function(name) {
	Database.current = Database.getInstance(name);
}

function dbLog() {
	//console.log.apply(console, arguments);
}
;
if ( ! ("bind" in Function.prototype) ) {
	Function.prototype.bind = function(bound) {
		var func = this;
		return function() {
			return func.apply(bound, arguments);
		};
	};
}

var WebSQLDatabase = Database.extend({
	connect: function(name) {
		this.db = openDatabase(name, '0.1', name.toLowerCase(), 5 * 1024 * 1024);
	},
	
	executeQuery: function(queryObject, callback) {
		dbLog("=== Running query\n" + queryObject.sql + ' ' + queryObject.args.join(", "));
		this.db.transaction(function(tx) {
			tx.executeSql(
				queryObject.sql,
				queryObject.args,
				function(tx, res) {
					dbLog("=== Query success");
					this.isError = false;
					this.querySuccess(queryObject, callback, tx, res);
				}.bind(this),
				function(tx, e) {
					dbLog("=== Query error", queryObject);
					this.isError = true;
					this.onError(queryObject, e.message, callback);
				}.bind(this)
			);
		}.bind(this));
	},
	
	querySuccess: function(query, callback, tx, res) {
		// Turn result into a nice array of objects
		var rows = [];
		for ( var i = 0; i < res.rows.length; i++ ) {
			var copy = {};
			var row = res.rows.item(i);
			for ( var key in row ) if ( row.hasOwnProperty(key) )
				copy[key] = row[key];
			rows.push(copy); // This creates a clone of the row object, since it was previously immutable
		}
		
		// Get some information about the query
		
		// Fetching insertId when not present throws an exception.
		var insertId = false;
		try { insertId = res.insertId; } catch (e) {}
		
		var meta = {
			insertId: insertId,
			affectedRows: res.rowsAffected
		};
		
		callback(rows, meta);
	},
	
	makeTable: function(name, primaryKey, schema, callback) {
		primaryKey = primaryKey || 'id';
		
		var query = 'CREATE TABLE IF NOT EXISTS `' + name + '`';
		var args = [];
		
		// Build fields
		var fields = [];
		
		// Add id column
		fields.push("`" + primaryKey + "` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT");
		
		// Run through schema
		for ( var field in schema ) if ( schema.hasOwnProperty(field) )
			fields.push(this.makeColumnDefinition(field, schema[field]));
		
		query += ' (' + fields.join(',\n') + ')';
		
		this.executeQuery({
			sql: query,
			args: args
		}, callback);
	},
	
	makeColumnDefinition: function(field, params) {
		var typeTranslationTable = {
			"int": "integer",
			"float": "real",
			"text": "text"
		};
		
		var paramQuery = '`' + field + '` ';
			
		// Specified type
		paramQuery += ' ' + typeTranslationTable[params.type];
			
		// Default value
		if ( typeof params.standard !== 'undefined' ) {
			paramQuery += ' DEFAULT ' + this._escapeDefaultValue(params.standard);
		}
			
		// Is mandatory
		paramQuery += ' ' + (typeof params.mandatory === 'undefined' || params.mandatory ? 'NOT NULL' : '');
		
		return paramQuery;
	},
	
	addIndex: function(table, column, callback) {
		this.executeQuery({
			sql: 'CREATE INDEX IF NOT EXISTS `' + column + '` ON `' + table + '` (`' + column + '`)',
			args: []
		}, callback);
	},
	
	addField: function(table, fieldName, fieldData, callback) {
		var query = "ALTER TABLE `" + table + "` ADD COLUMN ";
		query += this.makeColumnDefinition(fieldName, fieldData);
		
		this.executeQuery({
			sql: query,
			args: []
		}, callback);
	},
	
	dropTable: function(name, callback) {
		this.executeQuery({
			sql: 'DROP TABLE IF EXISTS `' + name + '`',
			args: []
		}, callback);
	},
	
	tableExists: function(name, callback) {
		this.executeQuery({
			sql: 'SELECT * FROM `' + name + '` LIMIT 1',
			args: []
		}, function() {
			dbLog("===== %s %s", name, this.isError ? "didn't exist" : "did exist");
			callback(!this.isError);
		}.bind(this));
	},
	
	buildFind: function(table, primaryKey, where, how) {
		return this.buildSelect(table, primaryKey, where, how, '*');
	},
	
	buildSelect: function(table, primaryKey, where, how, select) {
		var query = 'SELECT ' + select + ' FROM `' + table + '`\n';
		var args = [];
		
		if ( where === "all" )
			where = {};
		
		// Build where
		var sqlWhere = this.buildWhere(where);
		query += sqlWhere.sql;
		
		sqlWhere.args.forEach(function(a) {
			args.push(a);
		});
		
		// Build order by
		if ( typeof how.by !== "undefined" ) {
			query += 'ORDER BY ';
			
			var bys = [];
			if ( typeof how.by === "string" )
				bys.push(how.by)
			else
				bys = how.by;
			
			bys.map(function(by) {
				var pieces = by.split(" ");
				var field = pieces[0];
				var order = pieces[1] || "asc";
			
				return "`" + field + "` " + order.toUpperCase();
			});
			
			query += bys.join(", ") + "\n";
		}
		
		// Build groupby
		
		if ( typeof how.groupby !== "undefined" ) {
			query += "GROUP BY ";
			
			query += how.groupby.map(function(table) {
				return "`" + table + "`";
			}).join(", ");
			
			query += "\n";
		}
		
		// Build limit
		if ( typeof how.limit !== "undefined" ) {
			query += 'LIMIT ';
			
			if ( how.limit.constructor === Array ) {
				query += '?, ?';
				args.push(how.limit[0]);
				args.push(how.limit[1]);
			} else {
				query += '?';
				args.push(how.limit);
			}
			query += '\n';
		}
		
		return {
			sql: query,
			args: args
		};
	},
	
	buildWhere: function(where) {
		var ws = []; 
		var args = [];
		
		for ( var key in where ) if ( where.hasOwnProperty(key) && typeof where[key] !== "undefined" ) {
			// Ensure values is an array so we can concatenate several with OR
			var values = where[key].constructor === Array ? where[key] : [where[key]];
			
			// Fetch field name and operand, defaulting to "="
			var pieces = key.split(" ");
			var field = pieces[0];
			var operand = (pieces[1] || "=").toUpperCase();
			
			var sqlWhere = '`' + field + '` ';
			
			if (operand === "IN" || operand === "NOT_IN") {
				operand = operand.replace(/NOT_/i, "NOT ");
				sqlWhere += operand + "(" + (new Array(values.length).join("?,")) + "?)";
				
				ws.push(sqlWhere);
				args = args.concat(values);
			} else {
				sqlWhere +=  operand + " ?";

				// Fill an array with the sqlWhere and add all values to args
				// Then we join them together with OR (so if there only is one item in the array,
				// it won't have an OR)
				var ors = [];
				for ( var i = 0, j = values.length; i < j; i++ ) {
					var val = values[i];
					ors.push(sqlWhere);
					args.push(val);
				}
				ws.push("(" + ors.join(" OR ") + ")");
			}
		}
		
		// Only add "WHERE" if there is anything to filter by
		
		return {
			sql: ws.length ? ('WHERE ' + ws.join(" AND ") + "\n") : '',
			args: args
		};
	},
	
	buildUpdate: function(table, primaryKey, what, where) {
		var query = 'UPDATE `' + table + '`\n';
		
		var sqlSet = this.buildSet(what);
		var args = sqlSet.args;
		query += sqlSet.sql;
		
		var sqlWhere = this.buildWhere(where);
		query += sqlWhere.sql;
		sqlWhere.args.forEach(function(a) {
			args.push(a);
		});
		
		return {
			sql: query,
			args: args
		};
	},
	
	buildSet: function(data) {
		var query = '';
		var fields = [];
		var args = [];
		
		for ( var key in data ) if ( data.hasOwnProperty(key) ) {
			fields.push('`' + key + '` = ?');
			args.push(data[key]);
		}
		
		if ( fields.length )
			query = 'SET ' + fields.join(", ") + '\n';
		
		return {
			sql: query,
			args: args
		};
	},
	
	buildInsert: function(table, primaryKey, object) {
		if ( ! object.schema )
			throw new Error(object + " has no schema. Is not DB object");
		
		var query = 'INSERT INTO `' + table + '`';
		var args = [];
		
		var fields = [];
		var params = [];
		
		// Build values
		for ( var key in object ) if (object.hasOwnProperty(key) && object.schema.hasOwnProperty(key) ) {
			fields.push('`' + key + '`');
			
			args.push(object[key]);
			params.push('?');
		}
		
		query += '(' + fields.join(", ") + ')\n';
		query += 'VALUES(' + params.join(", ")  + ')';
		
		return {
			sql: query,
			args: args
		};
	},
	
	buildDelete: function(table, primaryKey, where) {
		var query = 'DELETE FROM `' + table + '`\n';
		
		var sqlWhere = this.buildWhere(where);
		
		query += sqlWhere.sql;
		
		return {
			sql: query,
			args: sqlWhere.args
		};
	},
	
	buildCount: function(table, primaryKey, where, how) {
		var select = ['COUNT(*) AS total'];
		if (how.groupby) {
			select = select.concat(how.groupby)
		}
		return this.buildSelect(table, primaryKey, where, how, select.join(","));
	},
	
	/*
		Method:
			_escapeDefaultValue
		
		This method exists because binding the default value with ? caused the browser to crash.
		It crashed in: Chrome, Safari, Opera and mobile Safari.
	*/
	_escapeDefaultValue: function(val) {
		if ( typeof val === "number" )
			return '('+val+')';
		return '"' + val + '"';
	}
});

;
if ( ! ("bind" in Function.prototype) ) {
	Function.prototype.bind = function(bound) {
		var func = this;
		return function() {
			return func.apply(bound, arguments);
		};
	};
}

var APIDatabase = Database.extend({
	initialize: function() {
		this._super.apply(this, arguments);
		this.isApi = true;
	},
	
	connect: function(name) {
		
	},
	
	executeQuery: function(queryObject, callback) {
		// Send API call
		var request = new Request({
			url: Config.feeder.root + '/api/db.json',
			method: 'POST',
			onComplete: function(status, text) {
				var result = tryToParseJSON(text);
				if (! result || result.error) {
					if (result && result.error === "login_required") {
						window.top.location = Config.feeder.loginUrl + '&to=' + window.top.location.pathname;
					}
					this.onError(queryObject, result ? result.error : result, callback);
					return;
				}
				this.querySuccess.apply(this, [queryObject, callback].concat(result))
			}.bind(this),
			addFeederAuthorization: true
		});
		
		request.send({post: queryObject});
	},
	
	querySuccess: function(queryObject, callback, res) {
		// Turn result into a nice array of objects
		var rows = [];
		for ( var i = 0; i < res.rows.length; i++ )
			rows.push(res.rows[i]);
		
		// Get some information about the query
		
		// Fetching insertId when not present throws an exception.
		var insertId = false;
		try { insertId = res.insertId; } catch (e) {}
		
		var meta = {
			insertId: insertId,
			affectedRows: res.rowsAffected
		};
		
		callback(rows, meta);
	},
	
	makeTable: function(name, primaryKey, schema, callback) {
		// NoOp...
		callback();
	},
	
	addIndex: function(table, column, callback) {
		// NoOp...
		callback();
	},
	
	addField: function(table, fieldName, fieldData, callback) {
		// NoOp...
		callback();
	},
	
	dropTable: function(name, callback) {
		// NoOp...
		callback();
	},
	
	tableExists: function(name, callback) {
		callback(true);
	},
	
	buildFind: function(table, primaryKey, where, how) {
		if ( where == "all" || where == "*" )
			where = {};
		return {
			type: 'find',
			table: table,
			where: JSON.stringify(where),
			how: JSON.stringify(how)
		};
	},
	
	buildCount: function(table, primaryKey, where, how) {
		if ( where == "all" || where == "*" )
			where = {};
		return {
			type: 'count',
			table: table,
			where: JSON.stringify(where),
			how: JSON.stringify(how)
		};
	},
	
	buildUpdate: function(table, primaryKey, what, where) {
		return {
			type: 'update',
			table: table,
			what: JSON.stringify(what),
			where: JSON.stringify(where)
		};
	},
	
	buildInsert: function(table, primaryKey, object) {
		return {
			type: 'insert',
			table: table,
			object: JSON.stringify(object.getValues())
		};
	},
	
	buildDelete: function(table, primaryKey, where) {
		return {
			type: 'delete',
			table: table,
			where: JSON.stringify(where)
		};
	}
});

;
var Mapper = Class.extend({
	table: false,
	model: false,
	
	initialize: function(db) {
		this.db = db;
		this.modelName = this.model;
		this.model = window[this.model].prototype;
	},
	
	install: function(callback) {
		this.db.makeTable(this.table, this.model.primaryKey, this.model.schema, callback || function() {});
	},
	
	// Add a field using data from model schema
	addField: function(member, callback) {
		var memberData = this.model.schema[member];
		this.db.addField(this.table, member, memberData, callback || function() {});
	},
	
	addIndex: function(column, callback) {
		this.db.addIndex(this.table, column, callback || function() {});
	},
	
	find: function(where, how, callback) {
		// how is optional, so make sure it's an object, and if not, check if is callback
		if ( typeof how == 'function' && ! callback ) {
			callback = how;
			how = {};
		}
		var objectForRow = this.objectForRow;
		
		this.db.run('find', [this.table, this.model.primaryKey, where, how], function(res, meta) {
			// Process rows into Model objects
			var rows = [];
			if ( res ) {
				res.forEach(function(row) {
					rows.push(app.store.addObject(objectForRow(row)));
				});
			}
		
			// Fire callback with processed objects
			callback(rows, meta);
		});
	},
	
	massDelete: function(where, callback) {
		this.db.run('delete', [this.table, this.model.primaryKey, where], function() {
			fireCallback(callback);
		});
	},
	
	massUpdate: function(what, where, callback) {
		this.db.run('update', [this.table, this.model.primaryKey, what, where], function() {
			fireCallback(callback);
		});
	},
	
	save: function(model, callback) {
		var pk = this.model.primaryKey;
		
		if ( model[pk] ) {
			if ( ! model.isDirty() )
				return fireCallback(callback);
			
			var where = {};
			where[pk] = model[pk];
			
			this.db.run('update', [this.table, pk, model.getDirty(), where], function(res, meta) {
				app.store.addObject(model);
				model.fromDB = model.getValues();
				fireCallback(callback, res, meta);
			});
		} else
			this.db.run('insert', [this.table, pk, model], function(res, meta) {
				model[pk] = meta.insertId;
				model.fromDB = model.getValues();
				app.store.addObject(model);
				fireCallback(callback, res, meta);
			});
	},
	
	remove: function(model, callback) {
		if ( ! model[this.model.primaryKey] )
			throw "Remove object must have " + this.model.primaryKey;
		
		var where = {};
		where[this.model.primaryKey] = model[this.model.primaryKey];
		
		this.db.run('delete', [this.table, this.model.primaryKey, where], callback);
	},
	
	count: function(where, how, callback) {
		// how is optional, so make sure it's an object, and if not, check if is callback
		if ( typeof how == 'function' && ! callback ) {
			callback = how;
			how = {};
		}

		this.db.run('count', [this.table, this.model.primaryKey, where, how], function(res, meta) {
			var ret = 0;
			if (res[0] && Object.keys(res[0]).length == 2) {
				ret = {};
				for (var i = 0, r; r = res[i]; i++) {
					var idKey = Object.keys(r).filter(function(field) { return field.contains("id"); })[0];
					ret[r[idKey]] = r.total;
				}
			} else if (res[0]) {
				ret = res[0].total;
			}
			fireCallback(callback, ret);
		});
	},
	
	objectForRow: function(row) {
		var obj = new window[this.modelName]();
		obj.setFromDB(row);
		return obj;
	}
});

Mapper.instances = {};

Mapper.get = function(name) {
	if ( ! Mapper.instances[name] ) {
		var className = name.replace(/^\w/, function(a) { return a.toUpperCase();}) + 'Mapper';
		Mapper.instances[name] = new window[className](Database.current);
	}
	return Mapper.instances[name];
};

Mapper.switchDatabase = function(db) {
	for ( var key in Mapper.instances ) if (Mapper.instances.hasOwnProperty(key)) {
		Mapper.instances[key].db = db;
	}
}
;
var Model = Class.extend({
	schema: {},
	primaryKey: 'id',
	mapper: false,
	
	initialize: function(data) {
		this.model = this.mapper;
		this.mapper = Mapper.get(this.mapper);
		
		for ( var key in data ) if ( data.hasOwnProperty(key) && this.schema.hasOwnProperty(key) )
			this[key] = data[key];
		
		if ( typeof this.onInit === 'function' )
			this.onInit();
	},
	
	setFromDB: function(data) {
		this.fromDB = {};
		
		for ( var key in data ) if ( data.hasOwnProperty(key) && (this.schema.hasOwnProperty(key) || key !== 'id') )
			this.fromDB[key] = data[key];
		
		for ( var key in this.fromDB ) if ( this.fromDB.hasOwnProperty(key) )
			this[key] = this.fromDB[key];
		
		this.id = data.id;
	},
	
	save: function(callback) {
		return this.mapper.save(this, callback);
	},
	
	copyPropertiesFrom: function(model) {
		for ( var key in model ) if ( model.hasOwnProperty(key) && (this.schema.hasOwnProperty(key) || key === 'id') )
			this[key] = model[key];	
	},
	
	isDirty: function() {
		if ( ! this.fromDB )
			return true;
		
		for ( var key in this.fromDB ) if ( this.fromDB.hasOwnProperty(key) )
			if ( this.fromDB[key] != this[key] )
				return true;
		return false;
	},
	
	getDirty: function() {
		var dirty = {};
		for ( var key in this.fromDB ) if ( this.fromDB.hasOwnProperty(key) )
			if ( this.fromDB[key] != this[key] )
				dirty[key] = this[key];
		return dirty;
	},
	
	getValues: function() {
		var ret = {id: this.id};
		for ( var key in this.schema ) if ( this.schema.hasOwnProperty(key) )
			ret[key] = this[key];
		return ret;
	},
	
	setMeta: function(key, value, callback) {
		this.ensureMeta();
		
		this.parsedMeta[key] = value;
		this.meta = JSON.stringify(this.parsedMeta);
		
		chain(this.save)
		.end(callback);
	},
	
	getMeta: function(key) {
		this.ensureMeta()
		return this.parsedMeta[key];
	},
	
	removeMeta: function(key, callback) {
		this.ensureMeta();
		delete this.parsedMeta[key];
		this.meta = JSON.stringify(this.parsedMeta);
		
		chain(this.save)
		.end(callback);
	},
	
	ensureMeta: function() {
		if ( ! this.parsedMeta && this.meta )
			this.parsedMeta = JSON.parse(this.meta);
		if ( ! this.parsedMeta )
			this.parsedMeta = {};
	}
});

;
var Google = new (Class.extend({
	path: 'https://www.google.com/reader',
	client: 'feeder.co',
	source: 'Rootof -feeder.co-4.0',
	
	tokenURL: '/api/0/token',
	userInfoURL: '/api/0/user-info',
	feedLoadURL: '/api/0/stream/contents/$streamId?n=30',
	listSubscriptionsURL: '/api/0/subscription/list',
	listTagsURL: '/api/0/tag/list',
	quickAddURL: '/api/0/subscription/quickadd',
	orderPreferenceURL: '/api/0/preference/stream/list',
	postEditURL: '/api/0/stream/items/edit',
	editTagURL: '/api/0/edit-tag',
	markAllAsReadURL: '/api/0/mark-all-as-read',
	editFeedURL: '/api/0/subscription/edit',
	disableTagURL: '/api/0/disable-tag',
	renameTagURL: '/api/0/rename-tag',
	setStreamPreferenceURL: '/api/0/preference/stream/set',
	
	tags: {
		read: "user/-/state/com.google/read",
		unread: "user/-/state/com.google/kept-unread",
		starred: "user/-/state/com.google/starred",
		like: "user/-/state/com.google/like",
		label: "user/-/label/",
		fresh: "user/-/state/com.google/fresh",
		share: "user/-/state/com.google/broadcast",
		readingList: "user/-/state/com.google/reading-list"
	},
	
	categories: {
		root: 'user/-/state/com.google/root'
	},
	
	initialize: function() {
		this.userId = '-';
		this.subscription = {};
		this.unsyncedFolders = [];
	},
	
	ensureUser: function(callback) {
		this.isLoggedIn({
			yes: function() {
				callback(true);
			},
			no: function() {
				Google.authenticate(callback);
			}
		});
	},
	
	// Open the OAuth2 popup and wait for the signal from the contentscript
	authenticate: function(callback) {
		this._authCallback = callback;
		app.events.subscribe("google:auth", this._authReturn);
		
		var url = GoogleOAuth2.requestAuthURL();
		
		UI.addGoogleReaderContentScript();
		
		// Open auth dialog
		if ( Ext.isSafari() ) {
			UI.openTab(url);
			UI.closePopup();
		}
		else
			UI.openPopup(url);
	},
	
	_authReturn: function(evt) {
		UI.removeGoogleReaderContentScript();
		
		if ( Ext.isSafari() )
			UI.showPopup();
		
		UI.closeTab(evt.tab);
		
		app.events.unsubscribe("google:auth", this._authReturn);
		var callback = this._authCallback;
		
		if ( ! evt.title.contains("code=") )
			return callback(false);
		
		GoogleOAuth2.code = evt.title.replace(/.*code=/, '');
		
		chain(GoogleOAuth2.verifyCode)
		.and(this.fetchSelf)
		.end(callback, true);
	},

	// Check if user is logged in to Google Reader
	// does this by attempting a request to user-info
	isLoggedIn: function(callbacks) {
		callbacks.yes = callbacks.yes || function() {};
		callbacks.no = callbacks.no || function() {};

		GoogleOAuth2.checkToken(function(success) {
			if (success) {
				chain(Google.fetchSelf)
				.end(callbacks.yes);
			} else
				callbacks.no();
		});
	},
		
	fetchSelf: function(callback) {
		return new Google.Request({
			url: Google.userInfoURL,
			onComplete: this._fetchSelfComplete.withCallback(callback)
		}).start();
	},
	
	_fetchSelfComplete: function(data, status, goog, callback) {
		this.userId = data.userId;
		this.userProfileId = data.userProfileId;
		this.profileData = data;
		
		fireCallback(callback);
	},
	
	// Fetch all the users feeds in a nice standard format
	fetchFeeds: function(callback) {
		return new Google.Request({
			url: Google.listSubscriptionsURL,
			type: 'json',
			params: {
				get: {output: 'json'}
			},
			onComplete: this._fetchFeedsComplete.withCallback(callback)
		}).start();
	},
	
	_fetchFeedsComplete: function(data, status, req, callback) {
		this.subscription = {
			feeds: [],
			categories: []
		};
		

		if ( ! data )
			return callback(false);
		
		// data = {
		// 	subscriptions: [{feed}, {feed}]
		// }
		//
		// feed = {
		// 	id, title, categories = [{category}], sortid, firstitemmsec, htmlUrl	
		// }
		//
		// category = { id, label }
		
		if ( ! data.subscriptions || data.subscriptions.constructor !== Array )
			return callback(false);
		
		this.foundCategories = {};
		
		// Go through each subscription (feed) and
		// make a copy of the data, just to make it "safer"
		data.subscriptions.forEach(this._copySubscription);
		
		var sub = this.subscription;
		
		chain(this.fetchTags)
		.and(this.fetchOrder)
		.then(function() {
			callback(sub);
		});
	},
	
	_copySubscription: function(sub) {
		// Make the copy, with categories intact
		this.subscription.feeds.push({
			id: sub.id,
			title: sub.title,
			sortid: sub.sortid,
			firstitemmsec: sub.firstitemmsec,
			htmlUrl: sub.htmlUrl,
			href: this.unFeedStream(sub.id),
			categories: sub.categories,
			isFeed: true
		});
		
		// Get categories and don't add the same category twice
		sub.categories.forEach(this._copyCategory);
	},
	
	_copyCategory: function(category) {
		if ( this.foundCategories[category.id] )
			return;
		
		// Mark the category as found
		this.foundCategories[category.id] = true;
		
		// "Copy" it
		this.subscription.categories.push({
			id: category.id,
			label: category.label,
			isCategory: true
		});
	},
	
	// Fetch "tags" (categories and more)
	fetchTags: function(callback) {
		return new Google.Request({
			url: Google.listTagsURL,
			type: 'json',
			params: {
				get: {output: 'json'}
			},
			onComplete: this._fetchTagsComplete.withCallback(callback)
		}).start();
	},
	
	_fetchTagsComplete: function(data, status, goog, callback) {
		(data.tags || []).forEach(this._fetchSortidFromTag);
		callback(this.subscription);
	},
	
	_fetchSortidFromTag: function(tag) {
		this.subscription.categories.forEach(function(cat) {
			if ( cat.id === tag.id )
				cat.sortid = tag.sortid;
		});
	},
	
	// Fetch order preferences
	fetchOrder: function(callback) {
		return new Google.Request({
			url: Google.orderPreferenceURL,
			type: 'json',
			params: {
				get: {output: 'json'}
			},
			onComplete: this._fetchOrderComplete.withCallback(callback)
		}).start();
	},
	
	_fetchOrderComplete: function(data, status, req, callback) {
		// returns a couple of structures relating to sorting of feeds
		// data.streamprefs["user/%d/state/com.google/root"]
		streamprefs = this._transformUserIds(data.streamprefs);
		
		var keys = Object.keys(streamprefs);
		
		var usid = this.genericUserStreamId();
		keys = keys.filter(function(key) {
			return key.indexOf(usid) === 0; 
		});
		
		// keys now contains the root folder and other folders
		// start by sorting root category
		var root = this._applySortOrder(streamprefs[usid + '/state/com.google/root'], false, true);
		
		var categories = this.subscription.categories.map(function(cat) {
			return {order: this._applySortOrder(streamprefs[cat.id], cat.id), id: cat.id, label: cat.label, sortid: cat.sortid};
		}, this);
		
		this.subscription.order = {root: root, categories: categories};
		
		callback(this.subscription);
	},
	
	_transformUserIds: function(data) {
		var keys = Object.keys(data);
		var ret = {};
		keys.forEach(function(k) {
			ret[Google.toNiceStreamId(k)] = data[k];
		});
		return ret;
	},
	
	_applySortOrder: function(streamObject, categoryId, isRoot) {
		if ( ! streamObject && ! isRoot ) {
			// Make sure we have all feeds in this category, since if no sorting has been made, a sortid will not be present
			// in /api/0/preference/stream/list, so it's assumed to be alphabetical
			return this._makeSureAllFeedsAreInCategory([], categoryId);
		}
		
		// We can't just ignore the root folder, so create a fake streamObject
		if ( ! streamObject && isRoot )
			streamObject = [{id: "subscription-ordering", value: ""}];
		
		var sortString = streamObject.filter(function(obj) {
			return obj.id === "subscription-ordering";
		});
		sortString = sortString[0] ? sortString[0].value : "";
		
		if ( isRoot ) {
			sortString = this._addAllCategoriesToRoot(sortString);
			sortString = this._addAllFeedsToRoot(sortString);
		}
		
		sortString = this.splitSortString(sortString).unique().join("");
		
		var almostAll = this.splitSortString(sortString).map(function(sortId) {
			return this.bySortId(sortId, categoryId);
		}, this).filter(function(obj) {
			return !! obj;
		});
		
		return this._makeSureAllFeedsAreInCategory(almostAll, categoryId);
	},

	// Make sure all categories have a base in root, since there only is one level of categories in Google Reader
	_addAllCategoriesToRoot: function(sortString) {
		var order = this.splitSortString(sortString);
		
		for ( var i = 0, cat; cat = this.subscription.categories[i]; i++ )
			if ( ! order.contains(cat.sortid) )
				order.push(cat.sortid)
		
		return order.join("");
	},
	
	// Add orphaned feeds to root folder
	_addAllFeedsToRoot: function(sortString) {
		var order = this.splitSortString(sortString);
		
		for ( var i = 0, subscription; subscription = this.subscription.feeds[i]; i++ ) {
			// Sortstrings are fucked up things. It sucks that we're relying on them so much.
			// A feed can be in many categories, but not a category and root at the same time
			// If a feed is in categories, but also said to be in root by the root sortstring
			// we remove it from the root sortstring, since that is how google reader deals with it
			// Deal with it.
			if ( subscription.categories.length && order.contains(subscription.sortid) ) {
				order.remove(subscription.sortid)
				continue;
			}
			
			if ( subscription.categories.length || order.contains(subscription.sortid) )
				continue;
			order.push(subscription.sortid);
		}
		
		return order.join("");
	},
	
	_makeSureAllFeedsAreInCategory: function(arr, categoryId) {
		// No categoryId specified, probably root, don't do anything
		if ( ! categoryId )
			return arr;
		
		for ( var i = 0, feed; feed = this.subscription.feeds[i]; i++ ) {
			if ( categoryHasFeed(feed) && ! arr.contains(feed) )
				arr.push(feed);
		}
		
		function categoryHasFeed(feed) {
			return feed.categories.some(function(cat) {
				return cat.id == categoryId;
			});
		}
		
		return arr;
	},
	
	bySortId: function(id, categoryId) {
		for ( var i = 0, feed; feed = this.subscription.feeds[i]; i++ ) {
			if ( feed.sortid === id ) {
				// Check that feed really is in that category, since sortid doesn't always update
				if ( categoryId && this.feedIsInCategory(feed, categoryId) )
					return feed;
				else if ( categoryId )
					return false;
				return feed;
			}
		}
		for ( var i = 0, category; category = this.subscription.categories[i]; i++ )
			if ( category.sortid === id )
				return category;
		return false;
	},
	
	feedIsInCategory: function(feed, categoryId) {
		return feed.categories.some(function(cat) {
			return cat.id == categoryId;
		});
	},
	
	// Add a feed
	addFeed: function(feed, callback) {
		return new Google.Request({
			url: Google.quickAddURL,
			method: 'POST',
			token: true,
			params: {
				post: {
					quickadd: feed.path
				}
			},
			onComplete: this._addFeedComplete.withCallback(callback)
		}).start();
	},
	
	_addFeedComplete: function(data, status, req, callback) {
		if ( ! data.streamId )
			return fireCallback(callback, false);
		
		// Mark all posts in this feed as read
		chain(this.markAllAsRead, data.streamId)
		.end(callback || function() {}, {streamId: data.streamId});
	},
	
	// Update a feed
	updateFeed: function(feed, callback) {
		return new Google.Request({
			url: Google.editFeedURL,
			method: 'POST',
			token: true,
			params: {
				post: {
					ac: 'edit',
					s: feed.guid,
					t: feed.title
				}
			},
			onComplete: function(data, status, req) {
				fireCallback(callback);
			}
		}).start();
	},
	
	// Remove a feed
	removeFeed: function(feedId, callback) {
		return new Google.Request({
			url: Google.editFeedURL,
			method: 'POST',
			token: true,
			params: {
				post: {
					s: feedId,
					ac: 'unsubscribe'
				}
			},
			onComplete: function() {
				fireCallback(callback);
			}
		}).start();
	},
	
	// Remove a folder
	removeFolder: function(folderId, callback) {
		return new Google.Request({
			url: Google.disableTagURL,
			method: 'POST',
			token: true,
			params: {
				post: {
					s: folderId
				}
			},
			onComplete: function() {
				fireCallback(callback);
			}
		}).start();
	},
	
	renameFolder: function(prev, current, callback) {
		return new Google.Request({
			url: Google.renameTagURL,
			method: 'POST',
			token: true,
			params: {
				post: {
					s: Google.toLabelName(prev),
					t: prev,
					dest: Google.toLabelName(current)
				}
			},
			onComplete: this._renameFolderComplete.andArguments(current, callback)
		}).start();
	},
	
	_renameFolderComplete: function(data, status, req, newName, callback) {
		this.pushFakeCategory(newName);
		this.fetchTags(callback);
	},
	
	// Update a post
	updatePost: function(post, callback) {
		var tags = [];
		
		if ( post.is_read )
			tags.push(Google.tags.read);
		if ( !post.is_read)
			tags.push(Google.tags.unread);
		if ( post.is_starred )
			tags.push(Google.tags.starred);
		
		return new Google.Request({
			url: Google.editTagURL,
			method: 'POST',
			token: true,
			params: {
				post: {
					a: tags,
					i: post.guid
				}
			},
			onComplete: function(data, status, req) {
				fireCallback(callback);
			}
		}).start();
	},
	
	// Add single tag to feed
	addTag: function(feedId, tagStreamName, callback) {
		return new Google.Request({
			url: Google.editFeedURL,
			method: 'POST',
			token: true,
			params: {
				post: {
					a: tagStreamName,
					s: feedId,
					ac: 'edit'
				}
			},
			onComplete: function(data, status, req) {
				fireCallback(callback);
			}
		}).start();
	},
	
	removeTag: function(feedId, tagStreamName, callback) {
		return new Google.Request({
			url: Google.editFeedURL,
			method: 'POST',
			token: true,
			params: {
				post: {
					r: tagStreamName,
					s: feedId,
					ac: 'edit'
				}
			},
			onComplete: function(data, status, req) {
				fireCallback(callback);
			}
		}).start();
	
	},
	
	updateOrder: function(sortstring, folderId, callback) {
		return new Google.Request({
			url: Google.setStreamPreferenceURL,
			method: 'POST',
			token: true,
			params: {
				post: {
					s: folderId,
					v: sortstring,
					k: "subscription-ordering"
				}
			},
			onComplete: function(data, status, req) {
				fireCallback(callback);
			}
		}).start();
	},
	
	markAllAsRead: function(streamId, callback) {
		return new Google.Request({
			url: Google.markAllAsReadURL,
			method: 'POST',
			token: true,
			params: {
				post: {
					s: streamId
				}
			},
			onComplete: function(data, status, req) {
				fireCallback(callback);
			}
		}).start();
	},

	markAllFeedsAsRead: function(callback) {
		return new Google.Request({
			url: Google.markAllAsReadURL,
			method: 'POST',
			token: true,
			params: {
				post: {
					s: Google.tags.readingList
				}
			}
		}).start();
	},

	// If a new empty folder is created, it cannot be created in Google Reader at the same time
	// therefor we have to keep a list of folders that are unsynced, and when a feed is added
	// to that folder, we fetch the tags again so we can get that folder's sortid.
	checkFolderSyncStatus: function(label, callback) {
		if ( ! this.unsyncedFolders.contains(label) )
			return fireCallback(callback);
		
		this.unsyncedFolders.remove(label);
		
		// Refetch tags
		this.pushFakeCategory(label);
		
		this.fetchTags(function() {
			callback();
		});
	},
	
	pushFakeCategory: function(label) {
		this.subscription.categories.push({
			id: this.toLabelName(label),
			label: label,
			isCategory: true
		});
	},
	
	// Data methods
	
	feedLoadPath: function(streamId) {
		return Google.path + Google.feedLoadURL.replace('$streamId', encodeURIComponent(streamId));
	},
	
	userStreamId: function() {
		return 'user/' + this.userId;
	},

	genericUserStreamId: function() {
		return 'user/-';
	},
	
	toNiceStreamId: function(id) {
		return id.replace(/user\/\d*\//, "user\/-\/");
	},
	
	toStreamId: function(id) {
		return id.replace(/user\/-\//, this.userStreamId() + "/");
	},
	
	toLabelName: function(label) {
		return this.userStreamId() + "/label/" + label.replace(/"|\^|<|>|\?|\&|\/|\,|\./g, '');
	},
	
	toFeedId: function(link) {
		return 'feed/' + link;
	},
	
	splitSortString: function(str) {
		return str.split(/(........)/).filter(function(a) {
			return !! a;
		});
	},
	
	unFeedStream: function(streamId) {
		return streamId.replace(/^(feed\/)/, '');
	},
	
	hasTag: function(tag, item) {
		tag = Google.tags[tag];
		return item.categories.map(this.toNiceStreamId).contains(tag);
	},
	
	sortIdFor: function(feed) {
		return (this.subscription.feeds.filter(function(sub) {
			return sub.id == feed;
		})[0] || {sortid: ""}).sortid;
	},
	
	sortIdForFolder: function(label) {
		var ret = (this.subscription.categories.filter(function(sub) {
			return sub.label == label;
		})[0] || {sortid: ""}).sortid;
		
		return ret;
	}
}));

;
// Requests for everything, keeps track if new session tokens are needed

Google.Request = Class.extend({	
	initialize: function(params) {
		this.params = toOptions(params, {
			method: 'GET',
			type: 'json',
			params: {get: {}, post: {}},
			token: false,
			onComplete: function(response, status, googRequest) {}
		});
		
		this.params.params.post = this.params.params.post || {};
		this.params.params.get = this.params.params.get || {};
		
		this.url = this.makeURL(this.params.url);
		this.timesTried = 0;
	},
	
	start: function() {
		this.params.params.get.ck = Date.now();
		this.params.params.get.client = Google.client;
		
		this.timesTried++;
		
		if ( this.params.token ) {
			if ( this.timesTried > 2 )
				return this.requestError();
		
			this.getToken(function(token) {
				if ( ! token )
					return this.requestError();
				
				this.params.params[this.params.method == 'GET' ? 'get' : 'post'].T = token;
				this.sendRequest();
			});
		} else
			this.sendRequest();
		
		return this;
	},
		
	sendRequest: function() {
		this.request = new Request({
			url: this.url,
			method: this.params.method,
			onComplete: this.requestComplete,
			onError: this.requestError,
			arrayedParamsToMultipleKey: true
		});
		
		this.request.addHeader('Authorization', 'Bearer ' + GoogleOAuth2.access_token);
		
		this.request.send(this.params.params);
	},
	
	getToken: function(callback) {
		if ( Google.Request.currentToken )
			return callback.call(this, Google.Request.currentToken);
		
		this.tokenRequest = new Request({
			url: this.makeURL(Google.tokenURL),
			method: 'GET',
			
			onComplete: function(status, text, xml) {
				if ( status == 200 ) {
					Google.Request.currentToken = text;
					return callback.call(this, text);
				}
				
				callback.call(this, false);
			}.bind(this),
			
			onError: function() {
				callback.call(this, false);
			}.bind(this)
		});
		
		this.tokenRequest.addHeader('Authorization', 'Bearer ' + GoogleOAuth2.access_token);
		
		this.tokenRequest.send();
	},
	
	requestComplete: function(status, text, xml) {
		// Bad token and should have token? Request new token
		if ( this.request.getHeader('X-Reader-Google-Bad-Token') && this.params.token ) {
			Google.Request.currentToken = false;
			this.start();
			return;
		}
				
		var response = text;
		
		if ( this.params.type === 'json' ) {
			try {
				response = JSON.parse(response);
			} catch (e) {
				response = false;
			}
		} else if ( this.params.type === 'xml' ) {
			response = xml;
		}
		this.params.onComplete(response, status, this);
	},
	
	requestError: function() {
		this.params.onComplete(false, 0, this);
	},
	
	makeURL: function(url) {
		if ( !! url.match(/^http:\/\/|https:\/\//) )
			return url;
		return Google.path + url;
	}
});

;
var GoogleOAuth2 = {
	scope: "https://www.google.com/reader/api",

	request_auth_url: "https://accounts.google.com/o/oauth2/auth?scope={scope}&redirect_uri={callback}&client_id={client_id}&response_type=code",
	token_url: 'https://accounts.google.com/o/oauth2/token',
	
	approveURL: 'https://accounts.google.com/o/oauth2/approval',
	
	requestAuthURL: function() {
		return GoogleOAuth2.request_auth_url
		.replace("{scope}", GoogleOAuth2.scope)
		.replace("{client_id}", GoogleOAuth2.client_id)
		.replace("{callback}", GoogleOAuth2.redirect_uri);
	},
	
	tokenURL: function() {
		return GoogleOAuth2.token_url;
	},
	
	newTokenPostData: function() {
		return {
			code: GoogleOAuth2.code,
			client_id: GoogleOAuth2.client_id,
			client_secret: GoogleOAuth2.client_secret,
			redirect_uri: GoogleOAuth2.redirect_uri,
			grant_type: "authorization_code"
		};
	},
	
	refreshTokenPostData: function() {
		return {
			refresh_token: GoogleOAuth2.refresh_token,
			client_id: GoogleOAuth2.client_id,
			client_secret: GoogleOAuth2.client_secret,
			grant_type: "refresh_token"
		};
	},
	
	verifyCode: function(callback) {
		var request = new Request({
			url: GoogleOAuth2.tokenURL(),
			method: 'POST',
			onComplete: GoogleOAuth2.updateTokenComplete.withCallback(callback)
		});
		
		request.send({post: GoogleOAuth2.newTokenPostData()});
	},
	
	refreshToken: function(callback) {
		var request = new Request({
			url: GoogleOAuth2.tokenURL(),
			method: 'POST',
			onComplete: GoogleOAuth2.updateTokenComplete.withCallback(callback)
		});
		
		request.send({post: GoogleOAuth2.refreshTokenPostData()});
	},
	
	updateTokenComplete: function(status, text, xml, callback) {
		var data = tryToParseJSON(text);

		if ( ! data) {
			GoogleOAuth2.tokenError = true;
			return fireCallback(callback);
		}
		
		if ( data.refresh_token )
			GoogleOAuth2.refresh_token = data.refresh_token;
		GoogleOAuth2.access_token = data.access_token;
		GoogleOAuth2.token = data;
		GoogleOAuth2.tokenError = false;
		
		fireCallback(callback);
	},
	
	checkToken: function(callback) {
		if ( ! GoogleOAuth2.refresh_token )
			return callback(false);
		
		GoogleOAuth2.refreshToken(function() {
			callback(!! GoogleOAuth2.access_token);
		});
	},
	
	client_id: "638422542259-vj0ujd0qhn7qs6sv7uv72om8nectr3ef.apps.googleusercontent.com",
	client_secret: "fe6b538Y03xcFpToi1X_Ce1D",
	
	redirect_uri: "urn:ietf:wg:oauth:2.0:oob"
};

;
var Feed = Model.extend({
	mapper: 'feed',
	
	schema: {
		'type': {type: 'text', standard: 'rss', possible: ['rss', 'google']},
		'guid': {type: 'text', standard: ''},
		'title': {type: 'text'},
		'path': {type: 'text'},
		'link': {type: 'text'},
		'favicon': {type: 'text', standard: ''},
		'numposts': {type: 'int', standard: 0},
		'forceupdate': {type: 'int', standard: 0},
		'usenotifications': {type: 'int', standard: 0},
		'updateinterval': {type: 'int', standard: 0},
		'meta': {type: 'text', mandatory: false, standard: ''},
		'notifyemail': {type: 'int', standard: 0},
		'quirks': {type: 'text', standard: ''}
	},
	
	onInit: function() {
		this.lastUpdated = 0;
		this.isFeed = true;
		this.hasMorePosts = true;
	},

	toJSON: function() {
		return {
			isFeed: true,
			guid: this._originalId || this.id,
			path: this.path,
			title: this.title,
			favicon: this.favicon
		};
	},

	getCacheId: function() {
		return this.id;
	},
	
	copyPropertiesFromServerData: function(data) {
		var protectedAttributes = 'link title favicon numposts forceupdate usenotifications updateinterval meta quirks'.split(" ");

		for (var key in data) if (data.hasOwnProperty(key) && protectedAttributes.contains(key)) {
			this[key] = data[key];
		}
	},

	findConditions: function() {
		return {feed_id: this.id};
	},

	byConditions: function() {
		return Config.postsSort;
	},

	fetchPosts: function(callback) {
		this.offset = 0;
		var numPosts = this.getNumPosts();
		
		if ( this.posts && numPosts == this.numberOfFetchedPosts )
			return callback(this._getFromCache(), this);
		
		this.numberOfFetchedPosts = numPosts;

		Mapper.get('post').find(
			this.findConditions(),
			{limit: [0, numPosts+1], by: Config.postsSort},
			this.setPosts.withCallback(callback)
		);
	},

	fetchMorePosts: function(callback) {
		var feed = this;

		var numPosts = this.getNumPosts();
		this.offset = (this.offset || 0) + numPosts;

		Mapper.get('post').find(
			this.findConditions(),
			{limit: [this.offset, numPosts+1], by: this.byConditions()},
			function(posts) {
				feed.hasMorePosts = posts.length > numPosts;
				callback(posts.slice(0, numPosts));
			}
		);
	},

	setPosts: function(posts, meta, callback) {
		this.posts = posts.slice(0, this.numberOfFetchedPosts);
		this.hasMorePosts = posts.length > this.numberOfFetchedPosts;
		callback(this._getFromCache(), this);
	},

	_getFromCache: function() {
		return app.store.sortedPostsForFeed(this.getCacheId()).slice(0, this.getNumPosts());
	},
	
	getPostsOfInterest: function(callback) {
		var postMapper = Mapper.get('post');
		var posts = [];
		chain(postMapper.find, {is_read: 0, feed_id: this.id})
		.thenSync(function(p) {
			posts = posts.concat(p);
		})
		.and(postMapper.find, {is_starred: 1, feed_id: this.id})
		.then(function(p) {
			posts = posts.concat(p);
			callback(posts);
		});
	},
	
	unreadPosts: function(callback) {
		this.fetchPosts(function(posts) {
			var unread = posts.filter(function(a) {
				return ! a.is_read;
			});
			
			callback(unread);
		});
	},
	
	starredPosts: function(callback) {
		this.fetchPosts(function(posts) {
			callback(posts.filter(function(p) { return !! p.is_starred; }));
		});
	},
	
	countUnread: function(callback) {
		fireCallback(callback, app.user.unreadCounts[this.id] || 0);
	},
	
	hasUnread: function(postWhichIsRead) {
		return app.user.countUnreadForFeed(this.id) == 0;
	},
	
	// TODO: FIXME: Fix magic feeds
	markAllAsRead: function(callback) {
		var postMapper = Mapper.get('post');
		var feed = this;
		
		app.user.updateUnreadCountForFeed(this.id, 0);

		app.store.postsForFeed(this.id).forEach(function(post) {
			if (! post.is_read) {
				post.is_read = 1;
				app.events.send('post:updated', {post: post.id});
			}
		});

		app.events.send('feed:updated', {feed: this.id});

		chain(this.massMarkAsRead)
		.end(callback);
	},
	
	massMarkAsRead: function(callback) {
		// If a syncer has support for marking all as unread, do it
		if (!app.sync.can("clearAllUnread") || app.sync.can("requireLocalCacheUpdate"))
			Mapper.get('post').massUpdate({is_read: 1}, {feed_id: this.id}, callback);
		
		if (app.sync.can("clearAllUnread"))
			app.sync.getWith("clearAllUnread").clearAllUnread(this, callback);
	},
	
	deleteAllPosts: function(callback) {
		app.user.updateUnreadCountForFeed(this.id, 0);

		if ( this.posts ) {
			app.store.deleteAllPosts(this.feedId);
			this.posts = [];
		}

		Mapper.get('post').massDelete({feed_id: this.id}, callback);
	},
	
	// Get the real update path, with optional force update parameter
	getPath: function() {
		var path = this.path;
		if ( this.forceupdate )
			path += (path.indexOf('?') !== -1 ? '&' : '?') + 'forceupdate=' + Date.now();
		return path;
	},
	
	getPathDisplay: function() {
		if ( this.type === 'google' )
			return Google.unFeedStream(this.path);
		return this.path;
	},

	traverseFolders: function(callback) {
		var folders = app.user.structure.foldersWithFeed(this.id);
		
		folders.forEach(function(folder) {
			do {
				callback(folder);
				folder = folder.getParent();
			} while ( folder );
		});
	},
	
	getFavicon: function() {
		return "http://s2.googleusercontent.com/s2/favicons?domain=" + (new URI(this.path)).domain();
	},
	
	getNumPosts: function() {
		return parseInt(this.numposts, 10) || app.user.preferences.get("global:postsDisplay");
	},
	
	loadFavicon: function() {
		// If another icon other than the default is specified, don't reload
		if ( this.favicon && this.favicon.length && ! this.favicon.contains('chrome://favicon/') )
			return;
		
		if ( Ext.isOnline() || app.user.isPro())
			return;
		this.forceReloadFavicon();
	},
	
	forceReloadFavicon: function() {
		var request = new Request({
			url: this.link,
			onComplete: this._parseFaviconRequest
		});
		
		request.send();
	},
	
	_parseFaviconRequest: function(status, text) {
		var links = text.match(/<link (.*)\/?>/g);
		var favicon = this._getFaviconFromLinks(links, this.link);
		
		if ( favicon ) {
			this.favicon = favicon;
		} else {
			this.favicon = this.getFavicon();
		}
		
		this.save();
	},
	
	_getFaviconFromLinks: function(links, base) {
		try {
			if ( ! links )
				return false;
			for ( var i = 0, link; link = links[i]; i++ ) {
				var attributesMatches = link.match(/(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g);
				var attributes = {};
			
				for ( var x = 0, attr; attr = attributesMatches[x]; x++ ) { try {
					var pieces = attr.split("=");
					var key = pieces.shift().trim();
					var value = pieces.join("=");
				
					attributes[key] = value.trimChars("'\"").trim();
				} catch(e) {} }
				
				
				if ( attributes.rel && ["icon", "shortcut icon"].contains(attributes.rel) && attributes.href && attributes.href.length ) {
					return TRYIT(function() {
						return (new URI(attributes.href, base)).toString();
					}, this);
				}
			}
			return false;
		} catch (e) {}
		
		return false;
	},
	
	hasMore: function(offset) {
		return this.hasMorePosts;
	},

	getQuirk: function(name) {
		try {
			return JSON.parse(this.quirks)[name];
		} catch (e) {
			return null;
		}
	}
});

Feed.model = "feed";
;
var Post = Model.extend({
	mapper: 'post',
	
	schema: {
		feed_id: {type: 'int'},
		title: {type: 'text'},
		link: {type: 'text'},
		summary: {type: 'text', mandatory: false, standard: ''}, // new
		is_read: {type: 'int', standard: 0},
		is_starred: {type: 'int', standard: 0}, // new
		published: {type: 'int'},
		guid: {type: 'text', mandatory: false}, // New
		meta: {type: 'text', mandatory: false} // new
	},

	getCacheId: function() {
		return this.id;
	},
	
	checkIfIsPost: function(callbacks) {
		var postMapper = this.mapper;
		var post = this, foundPost;
		
		if ( foundPost = app.user.checkIfIsPost(post) )
			return callbacks.yes(foundPost);
		
		var findParams = {
			'feed_id': post.feed_id
		};
		
		if ( post.guid )
			findParams.guid = post.getGUID();
		else
			findParams.link = post.link;
		
		// First try to find with the same link
		chain(postMapper.find, findParams).then(function(posts, meta, next) {
			if ( ! posts.length )
				return next();
			callbacks.yes(posts[0]);
			return chain.exit;
		// GUIDs are holy. If no result was found via the GUID we must assume that this post is unique.
		}).and(function(next) {
			if ( ! post.guid )
				return next();
			callbacks.no(post);
			return chain.exit;
		// Then try to find with same title, and published within 10 seconds of it
		}).then(postMapper.find, {
			'feed_id': post.feed_id,
			'title': post.title,
			'published >': post.published - 5000, // time is in milliseconds
			'published <': post.published + 5000
		}).then(function(posts) {
			if ( ! posts.length )
				callbacks.no(post);
			else
				callbacks.yes(posts[0]);
		});
	},
	
	markAsRead: function(callback) {
		this.mark(1, callback);
	},
	
	markAsUnread: function(callback) {
		this.mark(0, callback);
	},
	
	mark: function(isRead, callback) {
		var post = this;
		var oldUnread = post.is_read;
		post.is_read = isRead;
		
		var changedCount = false;
		if (this.is_read != oldUnread)
			changedCount = (oldUnread != this.is_read);
		
		this.mapper.save(post, function() {
			if (changedCount)
				app.user.updateUnreadCountForFeed(post.feed_id, app.user.unreadCounts[post.feed_id] + (isRead ? -1 : 1));
			
			app.events.send('post:updated', {post: post.id});
			app.events.send('feed:updated', {feed: post.feed_id});
			
			fireCallback(callback);
		});
	},
	
	toggleStar: function(callback) {
		var post = this;
		
		post.is_starred = +(! post.is_starred);
		this.mapper.save(post, function() {
			app.events.send('post:updated', {post: post.id});
			fireCallback(callback);
		});
	},
	
	getGUID: function() {
		return this.guid || this.link;
	},
	
	getLink: function() {
		if ( ! app.user.isPro() && app.user.preferences.get("global:useSkimlinks") )
			return "http://go.feeder.co/?id=32290X899567&url=" + encodeURIComponent(this.link);
		return this.link;
	},

	getConsumePath: function() {
		return app.config.feeder.postURL.replace("{post_id}", this.guid);
	}
});

Post.model = "post";
;
var Folder = Model.extend({
	mapper: 'folder',
	
	schema: {
		name: {type: 'text'},
		orderstring: {type: 'text', standard: ""},
		standard: {type: 'int', standard: 0},
		meta: {type: 'text', mandatory: false}
	},
	
	onInit: function() {
		this.isFolder = true;
		if ( ! this.orderstring )
			this.orderstring = "";
	},

	toJSON: function() {
		return {
			isFolder: true,
			name: this.name
		}
	},

	getCacheId: function() {
		return this.id;
	},
	
	forEachItem: function(callback) {
		return this.items().forEach(callback);
	},
	
	forEachFolder: function(callback) {
		return this.items().filter(function(item) {
			return item.isFolder;
		}).forEach(callback);
	},
	
	forEachFolderRecursively: function(callback) {
		this.forEachFolder(function(folder) {
			callback(folder);
			folder.forEachFolder(callback);
		});
	},
	
	allFeeds: function(callback) {
		var feeds = [];
		this.forEachItem(function(item) {
			if ( item.isFeed )
				feeds.push(item);
			else
				feeds = feeds.concat(item.allFeeds());
		});
		return feeds;
	},
	
	rawItems: function() {
		if ( ! this.orderstring )
			return [];
		
		return this.orderstring.split(",").map(function(item) {
			return item.split(":");
		});
	},
	
	items: function() {
		var getFeed = this.getFeed, getFolder = this.getFolder;
		
		return this.rawItems().map(function(item) {
			var type = item[0], id = item[1];
			return type === "f" ? getFeed(id) : getFolder(id);
		}).filter(function(a) {
			return !! a;
		});
	},
	
	addItem: function(model) {
		if ( model.model == "feed" )
			this.addFeed(model.id);
		else if ( model.model == "folder" )
			this.addFolder(model.id);
	},
	
	addFeed: function(feedId) {
		if ( this.hasFeed(feedId) )
			this.moveFeedToBack(feedId);
		else
			this.orderstring = (this.orderstring + ",f:" + feedId).trimChars(",");
	},
	
	addFolder: function(folderId) {
		if ( this.hasFolder(folderId) )
			this.moveFolderToBack(folderId);
		else
			this.orderstring = (this.orderstring + ",d:" + folderId).trimChars(",");
	},
	
	removeItem: function(model) {
		if ( model.model == "feed" )
			this.removeFeed(model.id);
		else if ( model.model == "folder" )
			this.removeFolder(model.id);
	},
	
	removeFeed: function(feedId) {
		this.orderstring = this.rawItems().filter(function(item) {
			return !(item[0] == "f" && item[1] == feedId);
		}).map(function(item) {
			return item.join(":");
		}).join(",");
	},
	
	removeFolder: function(folderId) {
		this.orderstring = this.rawItems().filter(function(item) {
			return !(item[0] == "d" && item[1] == folderId);
		}).map(function(item) {
			return item.join(":");
		}).join(",");
	},
	
	moveFeedToBack: function(feedId) {
		this.removeFeed(feedId);
		this.addFeed(feedId);
	},
	
	moveFolderToBack: function(folderId) {
		this.removeFolder(folderId);
		this.addFolder(folderId);
	},
	
	hasFeed: function(id) {
		return this.rawItems().some(function(item) {
			return item[0] == "f" && item[1] == id;
		});
	},
	
	hasFolder: function(id) {
		return this.rawItems().some(function(item) {
			return item[0] == "d" && item[1] == id;
		});
	},
	
	hasFolderRecursively: function(id) {
		if ( this.hasFolder(id) )
			return true;
		
		return this.items().some(function(item) {
			if ( ! item.isFolder ) return false;
			return item.hasFolderRecursively(id);
		});
	},
	
	unreadPosts: function(callback) {
		var unread = [];
		var link = chain();
		this.items().forEach(function(item) {
			link.and(item.unreadPosts);
			link.then(function(un, next) {
				unread = unread.concat(un);
				next();
			});
		});
		
		link.end(function() {
			callback(unread);
		});
	},
	
	countUnread: function(callback) {
		var feeds = this.allFeeds();
		var link = chain();
		var total = 0;
		feeds.forEach(function(feed) {
			link.and(feed.countUnread)
			link.then(function(unread, next) {
				total += unread;
				next();
			});
		});
		link.end(function() {
			callback(total);
		});
		//this.unreadPosts(function(posts) {
		//	callback(posts.length);
		//});
	},
	
	starredPosts: function(callback) {
		var link = chain();
		var res = [];
		this.items().forEach(function(item) {
			link.and(item.starredPosts);
			link.then(function(posts, next) {
				res = res.concat(posts);
				next();
			});
		})
		
		link.and(function() {
			callback(res);
		});
	},
	
	countItems: function() {
		var total = 0;
		this.items().forEach(function(item) {
			if ( item.isFeed )
				total++;
			else
				total += item.countItems();
		});
		return total;
	},
	
	markAllAsRead: function(callback) {
		var folder = this;
		
		var link = chain();
		this.items().forEach(function(item) {
			link.and(item.markAllAsRead);
		});
		
		link.and(function() {
			app.events.send("folder:updated", {folder: folder.id});
			fireCallback(callback);
		});
	},
	
	setOrderFromArray: function(arr) {
		this.orderstring = arr.map(function(item) {
			return (item.model == 'feed' ? 'f' : 'd') + ':' + item.id;
		}).join(",");
	},
	
	toGoogleString: function() {
		return this.items().map(function(item) {
			return item.model == "feed" ? Google.sortIdFor(item.guid) : Google.sortIdForFolder(item.name);
		}).join("");
	},
	
	googleId: function() {
		return this.standard ? Google.categories.root : Google.toLabelName(this.name);
	},
	
	getParent: function() {
		return app.user.structure.folderWithFolder(this.id);
	},
	
	getFeeds: function() {
		return this.items().filter(function(item) {
			return item.isFeed;
		});
	},
	
	getFolders: function() {
		return this.items().filter(function(item) {
			return item.isFolder;
		});
	},
	
	getFeed: function(id) {
		return this.structure ? this.structure.feed(id) : app.user.feed(id);
	},
	
	getFolder: function(id) {
		return this.structure ? this.structure.folder(id) : app.user.structure.folder(id);
	},
	
	getStructure: function() {
		var ret = [this];
		var p = this;
		while ( p = p.getParent() )
			ret.push(p);
		return ret;
	},
	
	feedBy: function(key, value) {
		return this.items().filter(function(item) {
			if ( item.isFolder ) return false;
			return item[key] == value;
		})[0];
	},
	
	folderBy: function(key, value) {
		return this.items().filter(function(item) {
			if ( ! item.isFolder ) return false;
			return item[key] == value;
		})[0];
	},

	toContainer: function() {
		var feedContainer = new FeedContainer();
		feedContainer.pushFolder("Feeds");

		this.forEachItem(function add(item) {
			if (item.isFeed)
				feedContainer.addFeed(item);
			else {
				feedContainer.pushFolder(item.name);
				item.forEachItem(add);
				feedContainer.popFolder();
			}
		});

		return feedContainer;
	}
});

Folder.model = "folder";
;
var Migration = Model.extend({
	mapper: 'migration',
	
	schema: {
		'version': {type: 'int'},
		'created': {type: 'int'}
	},

	getCacheId: function() {
		return false;
	}
});

Migration.model = "migration";

Migration.migrations = {
	1: function(callback) {
		chain(this.postMapper.addField, 'meta')
		.and(this.postMapper.addField, 'summary')
		.and(this.postMapper.addField, 'is_starred')
		.and(this.postMapper.addField, 'guid')
		
		.and(this.feedMapper.addField, 'type')
		.and(this.feedMapper.addField, 'guid')
		.and(this.feedMapper.addField, 'updateinterval')
		.and(this.feedMapper.addField, 'meta')
		 
		// Add GUIDs to all feeds
		.and(function(next) {
			chain(this.feedMapper.find, 'all')
			.then(function(res, meta, done) {
				var link = chain();
				for ( var i = 0, feed; feed = res[i]; i++ ) {
					feed.guid = feed.path;
					link.and(feed.save);
				}
				link.end(done);
			})
			.end(next);
		}.bind(this))
		
		.and(app.user.reloadFeeds)
		 	
		.end(callback);
	},

	2: function(callback) {
		chain(this.feedMapper.addField, 'notifyemail')
		.and(app.user.reloadFeeds)
		.end(callback);
	}
};

;
var FeedOnlyUnread = Feed.extend({
	initialize: function() {
		this._super.apply(this, arguments);
		
		this.isMagic = true;
		this.onlyUnread = true;
		this.title = "All unread";
		this.favicon = app.config.defaultFavicon();
	},

	findConditions: function() {
		return {is_read: 0};
	},

	byConditions: function() {
		return 'id desc';
	},
	
	fetchPosts: function(callback) {
		this.offset = 0;

		var numPosts = this.getNumPosts();
		this.numberOfFetchedPosts = numPosts;

		Mapper.get("post").find(
			this.findConditions(),
			{by: this.byConditions(), limit: [this.offset, numPosts+1]},
			this.setPosts.withCallback(callback)
		);
	},

	_getFromCache: function() {
		return this.posts.slice(0, this.getNumPosts());
	},
	
	massMarkAsRead: function(callback) {
		app.user.clearAllUnread(callback);
	},
	
	countUnread: function(callback) {
		fireCallback(callback, app.user.countStoredUnreads());
	}
});
;
var FeedOnlyStarred = Feed.extend({
	initialize: function() {
		this._super.apply(this, arguments);
		
		this.isMagic = true;
		this.title = "All starred posts";
		this.favicon = app.config.defaultFavicon();
	},
	
	findConditions: function() {
		return {is_starred: 1};
	},

	byConditions: function() {
		return 'id desc'
	},

	fetchPosts: function(callback) {
		this.offset = 0;
		this.numberOfFetchedPosts = this.getNumPosts();

		Mapper.get('post').find(
			this.findConditions(),
			{by: this.byConditions(), limit: this.numberOfFetchedPosts+1},
			this.setPosts.withCallback(callback)
		);
	},
	
	_getFromCache: function() {
		return this.posts.slice(0, this.getNumPosts());
	},

	massMarkAsRead: function(callback) {
		var ids = this.posts.map(function(p) {
			app.store.post(p.id).is_read = 1;
			app.store.feed(p.feed_id).cacheUpdateCount();
			return p.id;
		});
		
		Mapper.get('post').massUpdate({is_read: 1}, {id: ids}, callback);
	},
	
	countUnread: function(callback) {
		fireCallback(callback, 0);
	}
});
;
var FeedMapper = Mapper.extend({
	table: 'feeds',
	model: 'Feed'
});

;
var PostMapper = Mapper.extend({
	table: 'posts',
	model: 'Post',
	
	install: function(callback) {
		var postMapper = this;
		
		this._super(function() {
			postMapper.addIndex('feed_id', callback);
		});
	},
	
	addPosts: function(posts, callback) {
		var link = chain();
		
		for ( var i = 0, post; post = posts[i]; i++ )
			link.chain(this.addPost, post);
		
		link.end(callback);
	},
	
	addPost: function(post, callback) {
		post.checkIfIsPost({
			yes: this.syncIsRead.andArguments(post, callback), // If already post just don't
			no: this.addNewPost.withCallback(callback)
		});
	},
	
	// Some APIs, like google reader, indicate if the post is read. So we make sure we sync this correctly
	syncIsRead: function(post, originalPost, callback) {
		// If is_read or is_starred is defined
		if ( typeof originalPost.is_read !== "undefined" || typeof originalPost.is_starred !== "undefined" ) {
			// Keep track if something changed
			var changed = false;
			
			// First is_read
			if ( post.is_read != originalPost.is_read ) {
				post.is_read = +originalPost.is_read;
				changed = true;
			}
			
			// Second is_starred
			if ( post.is_starred != originalPost.is_starred ) {
				post.is_starred = +originalPost.is_starred;
				changed = true;
			}
			
			// If something changed, save it to database
			if ( changed )
				chain(this.save, post).end(callback, originalPost);
			else
				callback(originalPost);
		} else {
			callback(originalPost);
		}
	},
	
	addNewPost: function(post, callback) {
		var feed = app.user.feed(post.feed_id);
		
		chain(this.save, post)
		.and(function() {
			app.events.send('post:added', {post: post.id});
			app.events.send('feed:updated', {feed: post.feed_id});
			callback(post);
		});
	}
});

;
var FolderMapper = Mapper.extend({
	table: 'folders',
	model: 'Folder'
});

;
var MigrationMapper = Mapper.extend({
	table: 'migrations',
	model: 'Migration',
	
	migrate: function(callback) {
		if ( Ext.isOnline()  || app.user.isPro())
			return callback();
		
		chain(this.getLatest)
		.then(this.compareVersions)
		.then(function(isUptoDate, next) {
			if ( isUptoDate ) {
				callback();
				return chain.exit;
			}
			next();
		})
		.and(this.runMigrations)
		.end(callback);
	},
	
	getLatest: function(callback) {
		var migrationMapper = this;
		
		this.find('all', {by: 'created desc'}, function(res) {
			migrationMapper.latestVersion = res[0];
			callback(res[0]);
		});
	},
	
	compareVersions: function(version, callback) {
		// No latest version? Then there is stuff to be run
		if ( ! version )
			return callback(false);
		// This is determined if there exists a migration version which is current_version+1
		// So to trigger an upgrade you simply have to add an object to Migration.migrations
		return callback(!Migration.migrations[version.version+1]);
	},
	
	runMigrations: function(callback) {
		var toRunVersion;
		if ( ! this.latestVersion )
			toRunVersion = 1;
		else
			toRunVersion = this.latestVersion.version+1;
		
		var link = chain();
		while ( Migration.migrations[toRunVersion] ) {
			link.and(this.runMigration, toRunVersion);
			toRunVersion++;
		}
		link.end(callback);
	},
	
	runMigration: function(version, callback) {
		var migrationFunction = Migration.migrations[version];
		
		migrationFunction.call({
			postMapper: Mapper.get('post'),
			feedMapper: Mapper.get('feed'),
			folderMapper: Mapper.get('folder')
		}, function() {
			var migration = new Migration();
			migration.version = version;
			migration.created = Date.now();
			
			chain(migration.save)
			.end(callback);
		});
	}
});

;
var FeederRoot = localStorage.feederRoot || "http://feeder.co";

if (document.location.protocol === "http:" || document.location.protocol === "https:")
	FeederRoot = localStorage.feederRoot = "http://" + document.location.host;

var Config = {
	icon: {
		addFeed: ! Ext.isSafari() ? Ext.path('icons/icon-add.png') :  Ext.path('icons/safari-icon-add.png'),
		standard: ! Ext.isSafari() ? Ext.path('icons/icon.png') :  Ext.path('icons/safari-icon.png')
	},
	
	images: {
		folder: Ext.path('icons/folder_2x.png')
	},
	
	feeder: {
		root: FeederRoot,
		connectURL: FeederRoot + "/pro?flow=ext",
		loginUrl: FeederRoot + "/login?flow=login",
		logoutUrl: FeederRoot + "/logout",
		checkURL: FeederRoot + "/api/feeder/check",
		destroyTokenURL: FeederRoot + "/api/feeder/invalidate-token",
		postURL: FeederRoot + "/api/post/{post_id}?redirect_if_empty=true",
		profileSettingsURL: FeederRoot + "/pro/file"
	},
	
	pollTimeout: 30*1000,
	onLoadPollTimeout: 5*1000,
	retryInitializeTimeout: 10*1000,
	
	defaultUpdateInterval: 10*60*1000,
	
	maxConcurrentUpdates: 30,
	maxPostsPerFeedFile: 50,
	
	defaultNumPosts: 30,
	minNumberOfPosts: 105,
	
	feederBlog: "http://blog.feeder.co/rss",
	feederNotificationsURL: "http://notifications.feeder.co/rss",

	feederNotificationCheckInterval: 60*60*6*1000,
	
	optionsPageSize: {
		width: 1000,
		height: 600
	},
	
	popupSize: {
		width: 337,
		height: 412
	},
	
	defaultFavicon: function(path) {
		if ( ! path )
			return Config.defaultFaviconPath;
		
		if ( Ext.isChrome() ) {
			return "chrome://favicon/" + path;
		} else if ( Ext.isSafari() ) {
			return TRYIT(function() {
				return "http://s2.googleusercontent.com/s2/favicons?domain=" + (new URI(this.path)).domain();
			}, this);
		}
	},

	defaultFaviconPath: Ext.path("icons/default-icon.png"),
	
	postsSort: ['published desc', 'id desc']
};

;
/*
	Class:
		User
	
	Mission:
		Make a universal interface for interacting and modifing with what a user owns.
		Including things like:
			
			* Installing the tables
			* Fetching feeds/posts
			* Updating feeds/posts (mark as read)
			* Removing feeds/posts
			* Preferences
*/

var User = Class.extend({
	initialize: function() {
		this.db = Database.getInstance("Feeds");
		Database.switchDatabase("Feeds");
		
		this.preferences = new UserPreferences(); 
		this.structure = new UserStructure();
		
		if (this.isPro()) {
			this.switchToAPIDatabase();
		}
		
		this.unreadCounts = {};

		this.feedMapper = Mapper.get('feed');
		this.postMapper = Mapper.get('post');
		this.folderMapper = Mapper.get('folder');
	},
	
	destroy: function(callback) {
		callback = callback || function() {};
		
		this.isDestroyed = true;
		
		callback();
	},
	
	install: function(callback) {
		chain(this.feedMapper.install)
		.and(this.postMapper.install)
		.and(this.folderMapper.install)
		.and(this.prunePosts)
		.and(this.reloadFeeds)
		.and(this.structure.install)
		.and(this.createClientID)
		.and(this.prunePostsWithNoParent)
		.andSync(function() { setTimeout(app.user.sendAnonymousStatsToOurServer, 30*1000); })
		.and(callback);
	},
	
	createClientID: function(callback) {
		var id = this.preferences.get("client_id");
		if ( ! id ) {
			function GUID() {
			    var S4 = function () {
			        return Math.floor(Math.random() * 0x10000 /* 65536 */).toString(16);
			    };
			    return (
					S4() + S4() + "-" +
					S4() + "-" +
					S4() + "-" +
					S4() + "-" +
					S4() + S4() + S4()
				);
			}
			id = GUID();
			this.preferences.set("client_id", id);
		}
		callback();
	},
	
	// Remove posts from feeds that have more than > 100 posts
	prunePosts: function(callback) {
		if (Ext.isOnline() || this.isPro())
			return callback();
		
		var postMapper = Mapper.get("post");
		
		Mapper.get('feed').find('all', function(feeds) {
			var feedsChain = chain();
			
			feeds.forEach(function(feed) {
				feedsChain.and(postMapper.find, {feed_id: feed.id, is_starred: 0}, {by: Config.postsSort, limit: [0, Config.minNumberOfPosts]})
				.then(function(posts, meta, next) {
					if (posts.length < Config.minNumberOfPosts)
						return next();
					
					var ids = posts.map(function(p) {
						return p.id;
					});
					
					postMapper.massDelete({"id not_in": ids, feed_id: feed.id}, next);
				});
			});
			
			feedsChain.end(callback);
		});
	},

	prunePostsWithNoParent: function(callback) {
		if (Ext.isOnline() || this.isPro())
			return callback();
		
		var feedIds = [];
		this.forEachFeed(function(feed) {
			feedIds.push(feed.id);
		});

		if (feedIds.length) {
			chain(Mapper.get("post").massDelete, {"feed_id not_in": feedIds})
			.end(callback);
		} else
			callback();
	},

	reloadFeeds: function(callback) {
		app.store.clearFor(Feed);

		chain(this.feedMapper.find, 'all')
		.andSync(this.clearUnreadCache)
		.end(callback);
	},

	reload: function(callback) {
		chain(this.reloadFeeds)
		.and(this.structure.reloadFolders)
		.end(callback);
	},
	
	// Fetching 1 feed
	feed: function(id, callback) {
		if ( ! id )
			return false;
		var feed = app.store.feed(id.id || id);
		if ( callback )
			return callback(feed);
		return feed;
	},

	hasFeeds: function() {
		return app.store.feeds().length > 0;
	},
	
	// Fetching feed by attribute
	feedBy: function(key, val, callback) {
		var feeds = app.store.feeds();
		for (var i = 0, feed; feed = feeds[i]; i++) {
			if ( feed[key] === val ) {
				if ( callback )
					return callback(feed);
				return feed;
			}
		}
		if ( callback )
			callback(false);
		return false;
	},
	
	forEachFeed: function(callback) {
		app.store.feeds().forEach(function(feed) {
			callback(feed);
		});
	},

	countUnread: function(callback) {
		if (! this._forceCount && this.unreadCounts && Object.keys(this.unreadCounts).length == app.store.feeds().length)
			return callback(app.user.countStoredUnreads());
		
		this._forceCount = false;
		var unreadCounts = {};
		this.forEachFeed(function(feed) {
			unreadCounts[feed.id] = 0;
		});
		
		var fetchUnread = function(callback) {
			app.user.postMapper.count({is_read: 0}, {groupby: ["feed_id"]}, callback);
		}

		if (app.updater.supportsUnreadCounts()) {
			// This might be called online syncer has been initialized
			if ( ! app.sync.get('online') ) {
				this._forceCount = true;
				return callback(0);
			}

			fetchUnread = function(callback) {
				app.sync.get('online').countUnread(callback);
			};
		}

 		fetchUnread(function(rows) {
			for (var feedId in rows) if (rows.hasOwnProperty(feedId) && app.user.feed(feedId)) {
				unreadCounts[feedId] = rows[feedId];
			}
			app.user.unreadCounts = unreadCounts;

			app.events.send("feeds:recount", {total: app.user.countStoredUnreads()});
			callback(app.user.countStoredUnreads());
		});
	},

	forceCountUnread: function(callback) {
		this._forceCount = true;
		this.countUnread(callback);
	},
	
	countStoredUnreads: function() {
		var total = 0;
		for (var feedId in this.unreadCounts) if (this.unreadCounts.hasOwnProperty(feedId)) 
			total += this.unreadCounts[feedId];
		return total;
	},
	
	updateUnreadCountForFeed: function(feedId, numUnread) {
		this.unreadCounts[feedId] = Math.max(numUnread, 0);
		app.events.send("feeds:recount", {total: this.countStoredUnreads()});
	},
	
	countUnreadForFeed: function(feedId) {
		return this.unreadCounts[feedId];
	},

	clearUnreadCache: function() {
		this.unreadCounts = {};
		this._forceCount = true;
	},

	zeroUnreadCache: function() {
		for (var key in this.unreadCounts) {
			this.unreadCounts[key] = 0;
		}
		app.events.send("feeds:recount", {total: 0});
	},
	
	insertFeed: function(feed, callback) {
		callback = callback || function() {};
		
		this.feedMapper.save(feed, function() {
			app.events.send('feed:added', {feed: feed.id});
			callback(feed.id);
		});
	},
	
	addPosts: function(feed, posts, callback) {
		if (Ext.isOnline() || app.user.isPro())
			return fireCallback(callback);
		
		callback = callback || function() {};
		
		// Set feed_id of every post
		for ( var i = 0, post; post = posts[i]; i++ )
			post.feed_id = feed.id;
		
		// Add to db
		this.postMapper.addPosts(posts, function() {
			callback(posts);
		});
	},
	
	removeFeed: function(feedOrFeedId, callback) {
		var feed = typeof feedOrFeedId === 'object' ? feedOrFeedId : this.feed(feedOrFeedId);
		
		var postMapper = this.postMapper;
	
		// Remove all posts
		chain(feed.deleteAllPosts)
		// Remove folder reference
		.and(this.structure.removeFeed, feed.id)
		// Remove feed
		.and(this.feedMapper.remove, feed)
		.and(function() {
			app.store.deleteObject(feed);
			app.events.send('feed:removed', {feed: feed.id, guid: feed.guid, feedType: feed.type});

			fireCallback(callback);
		});
	},
	
	removeFeedFromAllFolders: function(feedOrFeedId, callback) {
		var feed = typeof feedOrFeedId === 'object' ? feedOrFeedId : app.store.feed(feedOrFeedId);
		
		this.structure.forEachFolder(function(folder) {
			folder.removeFeed(feed.id);
		});
		
		chain(this.structure.saveFolders)
		.and(this.removeFeed, feed)
		.end(callback);
	},
	
	removeFeedIfNotInCategories: function(feedId, callback) {
		feedId = feedId.id ? feedId.id : feedId;
	
		// Feed exists in a category?
		if ( app.user.structure.feedInFolder(feedId) )
			return fireCallback(callback);
		
		return this.removeFeed(feedId, callback);
	},

	addFeedIfNotExistsWithoutFolder: function(feed, callback) {
		feed.noFolderOnAdd = true;
		return this.addFeedIfNotExists(feed, callback);
	},
	
	addFeedIfNotExists: function(feed, callback) {
		chain(this.feedBy, 'guid', feed.guid)
		.then(function(res, next) {
			if ( res ) {
				feed.id = res.id;
				if ( feed.title !== res.title ) {
					res.title = feed.title;
					res.save(callback);
				} else
					callback();
				return chain.exit;
			}
			next();
		})
		.then(function(next) {
			if (feed.isError) {
				callback(false);
				return chain.exit;
			}
			next();
		})
		.and(this.addFeed, feed)
		.then(function(f) {
			if ( f )
				feed.id = f.id;
			callback();
		});
	},
	
	// Check if post is in current posts array
	// this is just a dumb (but quick) check to see if we can skip
	// database access, so all it does is check links
	checkIfIsPost: function(post) {
		// Fetch feed and make sure it exists
		var feed = this.feed(post.feed_id);
		if ( ! feed )
			return false;
		
		// Make sure posts are loaded
		var posts = feed.posts;
		if ( ! posts )
			return false;
		
		for ( var i = 0, p; p = posts[i]; i++ )
			if ( p.getGUID() === post.getGUID() )
				return p;
		return false;
	},
	
	// The simple interface to adding/removing feeds
	followFeed: function(url, callback) {
		app.user.addFeed(url, callback);
	},
	
	unfollowFeed: function(url, item, callback) {
		var feed = app.user.feedBy("path", url);
		if ( ! feed )
			return fireCallback(callback);
		
		chain(app.user.removeFeedFromAllFolders, feed)
		.end(callback);
	},
	
	// Add feed, from inception to stored db entry
	addFeed: function(path, data, callback) {
		if ( typeof data === 'function' ) {
			callback = data;
			data = {};
		}

		if (typeof path === "object" ) {
			data = path;
			path = data.path;
		}

		data = data || {};
		
		var feed = new Feed();
		feed.path = path;
		feed.guid = path;
		
		for ( var key in data ) if ( data.hasOwnProperty(key) && feed.schema.hasOwnProperty(key) )
			if (key !== "id")
				feed[key] = data[key];
		
		feed.noFolderOnAdd = data.noFolderOnAdd;

		chain(app.sync.processFeed, feed)
		// sync can fail to process feeds, if for example on Google Reader a feed there doesn't exist
		.and(function(next) {
			if ( feed.isError ) {
				fireCallback(callback, false);
				return chain.exit;
			}
			next();
		})
		.and(app.updater.loadFeed, feed)
		.then(this.createFeedFromParser)
		.then(function(addedFeed) {
			fireCallback(callback, addedFeed);
		});
	},
		
	createFeedFromParser: function(parser, callback) {
		// An error occured? What now :S
		if ( ! parser )
			return callback(false);
		
		var feed = parser.getFeed();
		var posts = parser.getPosts();
		
		// Mark all posts in a new feed as read initially
		posts.forEach(function(post) {
			post.is_read = 1;
		});

		feed.favicon = feed.favicon || "";
		feed.meta = feed.meta || "";
		feed.type = feed.type || "rss";
		feed.title = feed.title || feed.path;

		chain(this.insertFeed, feed)
		.and(this.addPosts, feed, posts)
		.and(function(next) {
			if (feed.noFolderOnAdd)
				return next();

			chain(app.user.structure.addFeedToRoot, feed)
			.and(app.user.structure.save)
			.end(next);
		})
		.end(callback, feed);
	},
	
	// WARNING: This MUST be run after importer has imported folders.
	fixOrphanFeeds: function(callback) {
		this.forEachFeed(function(feed) {
			if ( ! app.user.structure.feedInFolder(feed.id) )
				app.user.structure.base.addFeed(feed.id);
		});
		
		chain(app.user.structure.base.save)
		.end(callback);
	},
	
	clearAllUnread: function(callback) {
		app.user.transaction(function(finished) {
			var updatedFeeds = [];

			// Mark all posts in memory as read
			app.store.posts().forEach(function(post) {
				if ( ! post.is_read ) {
					post.is_read = 1;
					app.events.send("post:updated", {post: post.id});

					updatedFeeds.push(post.feed_id);
				}
			});

			// Send out events for updated feeds
			updatedFeeds.unique().forEach(function(feed) {
				app.events.send("feed:updated", feed.id);
			})

			// 0 unread cache
			app.user.zeroUnreadCache();

			if ( app.sync.can("clearAllUnreadEverywhere") ) {
				app.sync.getWith("clearAllUnreadEverywhere").clearAllUnreadEverywhere();
			}

			if (!app.sync.can("clearAllUnreadEverywhere") || app.sync.can("requireLocalCacheUpdate")) {
				Mapper.get('post').massUpdate({is_read: 1});
			}
			
			// Done
			finished();
			callback();
		});
	},
	
	openEveryUnread: function() {
		var link = chain();
		var unreadPosts = [];
		
		this.forEachFeed(function(feed) {
			link.and(feed.unreadPosts).then(function(posts, next) {
				unreadPosts = unreadPosts.concat(posts);
				next();
			});
		});
		
		link.end(function() {
			app.ui.openMany(unreadPosts);
		});
	},
	
	// Google Reader can't have nested folders
	canHaveNestedFolders: function() {
		return ! app.sync.get('google');
	},
	
	createFeedContainer: function() {
		return new FeedContainer();
	},
	
	createPost: function(data) {
		return new Post(data || {});
	},
	
	createFeed: function(data) {
		return new Feed(data || {});
	},
	
	create: function(className, a, b, c, d, e) {
		return new window[className](a, b, c, d, e);
	},
	
	hasFeedByPath: function(link) {
		if ( app.sync.get("google") )
			link = Google.toFeedId(link);
		return !! this.feedBy('path', link);
	},
	
	hasFeed: function(guid) {
		return !! this.feedBy("guid", guid);
	},
	
	isPro: function() {
		return !! this.preferences.get("feeder:token") || Ext.isOnline();
	},
	
	// Run a transaction, which holds off on events and other things and combines them until the end
	transaction: function(func) {
		app.events.hold();
		func(function() {
			app.events.release();
		});
	},
	
	switchDatabase: function(name, toAdapter) {
		this.db = Database.getInstance(name, toAdapter);
		Database.switchDatabase(name);
		Mapper.switchDatabase(this.db);
	},
	
	switchToAPIDatabase: function() {
		this.switchDatabase("FeederAPI", "APIDatabase");
	},
	
	switchToLocalDatabase: function() {
		this.switchDatabase("Feeds", Platform.env.DBAdapter);
	},

	moveToLocalDatabase: function(callback) {
		this.switchToLocalDatabase();
		this.reloadDB(callback);
	},

	moveToAPIDatabase: function(callback) {
		this.switchToAPIDatabase();
		this.reloadDB(callback);
	},

	reloadDB: function(callback) {
		app.store.clearCache();
		this.clearUnreadCache();

		chain(app.user.reloadFeeds)
		.and(app.user.structure.reloadFoldersHard)
		.end(callback);
	},

	sendAnonymousStatsToOurServer: function() {
		try {
			if (Ext.isOnline())
				return;

			if (Date.now() > new Date(2013, 5, 27, 12, 0, 0, 0))
				return;

			if (localStorage.has_sent_stats)
				return;

			localStorage.has_sent_stats = 1;

			var usingFeeder = !! app.sync.get("online");
			var usingGoogleReader = !! app.sync.get("google");
			var usingPlain = ! usingFeeder && ! usingGoogleReader;

			var syncName;
			switch (true) {
				case usingFeeder: syncName = "feeder"; break;
				case usingGoogleReader: syncName = "google_reader"; break;
				default: syncName = "plain";
			}

			var stats = {
				client_id: app.user.preferences.get("client_id"),
				sync_type: syncName,
				using_feeder: +usingFeeder,
				using_plain: +usingPlain,
				using_google_reader: +usingGoogleReader,
				feeds_count: (app.store.feeds() || []).length
			};

			var request = new Request({
				url: 'http://feedbubbly.com/feeder-stats/',
				method: 'POST'
			});

			request.send({
				post: stats
			});
		} catch(e) {}
	}
});

;
var CacheStore = Class.extend({
	initialize: function() {
		this.clearCache();
	},

	clearCache: function() {
		this.store = {};
		this.store[Feed.model] = {};
		this.store[Folder.model] = {};
		this.store[Post.model] = {};

		this.cache = {
			posts: {}
		};
	},

	addObject: function(obj) {
		var id = obj.getCacheId();

		if (!id)
			return obj;

		// New objects
		if (!this.store[obj.model][id]) {
			this.store[obj.model][id] = obj;

			if (obj.model == "post") {
				this.addPostToFeed(obj);
			}
		// Update property for existing object
		} else {
			this.store[obj.model][id].copyPropertiesFrom(obj);
		}

		return this.store[obj.model][id];
	},

	addPostToFeed: function(post) {
		if (!this.cache.posts[post.feed_id])
			this.cache.posts[post.feed_id] = {};

		this.cache.posts[post.feed_id][post.getCacheId()] = post;
	},

	deleteObject: function(obj) {
		delete this.store[obj.model][obj.getCacheId()];

		if (obj.model == "post") {
			this.cache.posts[obj.feed_id] = [];
		}
	},

	clearFor: function(cls) {
		this.store[cls.model] = {};
	},

	randomObjectFor: function(cls) {
		var items = Object.values(this.store[cls.model]);
		return items[Math.floor(Math.random()*items.length)] || false;
	},

	randomPost: function() {
		return this.randomObjectFor(Post);
	},

	deleteAllPosts: function(feedId) {
		if (this.cache.posts[feedId]) {
			this.postsForFeed.forEach(function(post) {
				this.deleteObject(post);
			}, this);
		}
		delete this.cache.posts[feedId];
	},

	feed: function(id) {
		return this.store[Feed.model][id];
	},

	post: function(id) {
		return this.store[Post.model][id];
	},

	folder: function(id) {
		return this.store[Folder.model][id];
	},

	feeds: function() {
		return Object.values(this.store[Feed.model]);
	},

	posts: function() {
		return Object.values(this.store[Post.model]);
	},

	postsForFeed: function(feedId) {
		if (!this.cache.posts[feedId])
			return [];
		return Object.values(this.cache.posts[feedId]);
	},
	
	sortedPostsForFeed: function(feedId) {
		var posts = this.postsForFeed(feedId);

		posts.sort(function(a, b) {
			if ( a.published == b.published )
				return 0;
			if ( a.published > b.published )
				return -1;
			if ( a.id > b.id )
				return -1;
			return 1;
		});

		return posts;
	},
});

;
var UserPreferences = Class.extend({
	defaults: {
		'global:updateInterval': Config.defaultUpdateInterval,
		'global:postsDisplay': Config.defaultNumPosts,
		'global:openPostsInNewTab': true,
		'global:notifications': false,
		'global:useSkimlinks': true,
		'popup:filter': 'all',
		'sync:google': false,
		'options:theme': 'normal',
		'activeTheme': 'theme-light',
		'global:useSkimlinks': true,
		'global:useReadability': false,
		'global:showUnreadCountInBadge': true
	},
	
	allThemes: [
		{name: "Light", identifier: "theme-light", image: Ext.path("popup/css/gfx/theme-light.png")},
		{name: "Dark", identifier: "theme-dark", image: Ext.path("popup/css/gfx/theme-dark.png")}
	],
	
	initialize: function() {
		if ( this.get('activeTheme') == "theme-mint" )
			this.set('activeTheme', 'theme-light');
	},
	
	get: function(key) {
		var item = localStorage.getItem(key);
		try {
			item = JSON.parse(item);
		} catch (e) {
			if ( item )
				return item;
		}
		if ( item === null && typeof this.defaults[key] !== "undefined" )
			return this.defaults[key];
		return item;
	},
	
	set: function(key, value, quiet) {
		var oldValue = localStorage.getItem(key);
		var newValue = JSON.stringify(value);
		
		if ( oldValue === newValue )
			return;
		
		localStorage.setItem(key, newValue);
		
		if ( window.app && window.app.events && ! quiet )
			app.events.send("preferences:changed", {key: key});
	},
	
	setQuiet: function(key, value) {
		this.set(key, value, true);
	},
	
	remove: function(key) {
		localStorage.removeItem(key);
	},
	
	getAll: function() {
		var ret = {};
		for ( var key in this.defaults ) if ( this.defaults.hasOwnProperty(key) )
			ret[key] = this.get(key);
		return ret;
	}
});
;
/*
	Class:
		UserStructure
	
	Keeps track of the structure of the feeds.
	
	Stores the folders in a table. Each folder entry has an "orderstring", that works much like Google Readers.
	
	Example of orderstring:
		f:1,f:3,f:12,f:44,d:1,d:2
	
		Which corresponds to the order:
		
			* Feed with id #1
			* Feed with id #3
			* Feed with id #12
			* Feed with id #44
			* Folder with id #1
			* Folder with id #2
*/

var UserStructure = Class.extend({
	initialize: function() {
		this.folderMapper = Mapper.get('folder');
		this.folders = {};
		this.base = false;
	},
	
	install: function(callback) {
		chain(this.reloadFolders)
		.end(callback);
	},
	
	addStandardIfNeeded: function(res, meta, callback) {
		if ( res && res[0] ) {
			this.base = res[0];
			this.folders[res[0].id] = res[0];
			return callback();
		}
		
		this.addStandard(callback);
	},
	
	addStandard: function(callback) {
		var folder = new Folder();
		folder.standard = 1;
		folder.name = "Feeds";
		
		this.base = folder;
		
		var folders = this.folders;
		
		this.folderMapper.save(folder, function() {
			folders[folder.id] = folder;
			callback();
		});
	},

	reloadFoldersHard: function(callback) {
		this.folders = {};
		this.base = false;
		this.reloadFolders(callback);
	},
	
	reloadFolders: function(callback) {
		chain(this.folderMapper.find, 'all')
		.then(this.setFolders)
		.end(callback);
	},
	
	setFolders: function(rows, meta, callback) {
		for ( var i = 0, folder; folder = rows[i]; i++ ) {
			// Move logic from addStandardIfNeeded to here instead?
			if ( folder.standard )
				if ( this.base ) {
					this.base.copyPropertiesFrom(folder);
					folder = this.base;
				} else
					this.base = folder;
			
			// We use copyPropertiesFrom to ensure any references out there are still intact
			// might be a good idea, might be retarded playing with fire. I dunno.
			if ( this.folders[folder.id] )
				this.folders[folder.id].copyPropertiesFrom(folder);
			else
				this.folders[folder.id] = folder;
		}
		if ( ! this.base ) {
			chain(this.addStandard)
			.end(callback);
		} else {
			callback();
		}
	},
	
	folder: function(id, callback) {
		var folder = this.folders[id];
		if ( callback )
			callback(folder);
		return folder;
	},
	
	save: function(callback) {
		var link = chain();
		this.forEachFolder(function(folder) {
			link.and(this.folderMapper.save, folder);
		});
		link.and(this.reloadFolders);
		link.end(callback);
	},
	
	addFeedToFolder: function(feedId, folderId, callback) {
		var folder = this.folder(folderId);
		folder.addFeed(feedId.id || feedId);
		
		app.events.send("folder:updated", {folder: folder.id});
		
		return fireCallback(callback);
	},

	addFolderToFolder: function(folderId, parentId, callback) {
		var folder = this.folder(folderId);
		var parentFolder = this.folder(parentId);
		parentFolder.addFolder(folderId);
		
		app.events.send("folder:updated", {folder: parentFolder.id});
		
		return fireCallback(callback);
	},
	
	addNewFolderToFolder: function(name, folderId, callback) {
		var newFolder = new Folder();
		newFolder.name = name;
		
		var parentFolder = this.folder(folderId);
		
		// Add new folder to database
		chain(this.folderMapper.save, newFolder)
		.then(function(res, meta, next) {
			parentFolder.addFolder(newFolder.id);
			app.events.send("folder:updated", {folder: parentFolder.id});
			next();
		})
		// Update orderstring for parent folder
		.and(this.folderMapper.save, parentFolder)
		.and(this.reloadFolders)
		.and(function() {
			fireCallback(callback, app.user.structure.folder(newFolder.id));
		});
	},
	
	addFeedToRoot: function(feedId, callback) {
		return this.addFeedToFolder(feedId, this.base.id, callback);
	},
	
	addFolderToRoot: function(name, callback) {
		return this.addFolderToFolder(name, this.base.id, callback);
	},
	
	findByParentAndName: function(parentId, name, callback) {
		var parent = this.folder(parentId);
		
		var foundFolder = false;
		this.forEachFolder(function(f) {
			if ( f.name == name && parent.hasFolder(f.id) )
				foundFolder = f;
		});
		
		if ( ! foundFolder ) {
			var folder = new Folder();
			folder.name = name;
			
			var folders = this.folders;
			
			chain(this.folderMapper.save, folder)
			.and(function(next) {
				folders[folder.id] = folder;
				app.events.send("folder:updated", {folder: folder.id});
				next();
			})
			.end(callback, folder);
		} else
			fireCallback(callback, foundFolder);
	},
	
	removeFolder: function(folder, callback) {
		chain(this.folderMapper.remove, folder)
		.and(this.removeReferenceOfFolder, folder)
		.and(this.removeChildren, folder)
		.end(callback);
	},
	
	removeFeed: function(feedId, callback) {
		var foldersWithFeed = this.foldersWithFeed(feedId);
		var link = chain();
		
		for ( var i = 0, folder; folder = foldersWithFeed[i]; i++ ) {
			folder.removeFeed(feedId);
			app.events.send("folder:updated", {folder: folder.id});
			link.and(this.saveFolder, folder);
		}
		
		link.end(callback);
	},
	
	removeReferenceOfFolder: function(folder, callback) {
		var link = chain();
		this.forEachFolder(function(f) {
			if ( ! f.hasFolder(folder.id) )
				return;
			f.removeFolder(folder.id);
			link.and(this.folderMapper.save, f);
		});
		delete this.folders[folder.id];
		link.end(callback);
	},
	
	removeChildren: function(folder, callback) {
		var link = chain();
		folder.forEachItem(function(item) {
			if ( item.isFeed )
				link.and(app.user.removeFeedIfNotInCategories, item);
			else
				link.and(app.user.structure.removeFolder, item);
		});
		link.end(callback);
	},
	
	saveFolder: function(folder, callback) {
		folder.save(function() {
			fireCallback(callback);
		});
	},
	
	// Just loop through each folder, without any specific order
	forEachFolder: function(callback) {
		for ( var key in this.folders) if ( this.folders.hasOwnProperty(key) )
			callback.call(this, this.folders[key]);
	},
	
	foldersWithFeed: function(feedId) {
		var ret = [];
		for ( var key in this.folders) if ( this.folders.hasOwnProperty(key) )
			if ( this.folders[key].hasFeed(feedId) )
				ret.push(this.folders[key]);

		if ( ! ret.length )
			ret.push(this.base);

		return ret;
	},
	
	feedInFolder: function(feedId) {
		var folders = this.foldersWithFeed(feedId);
		if ( folders.length > 1 )
			return true;
		return folders[0].hasFeed(feedId);
	},
	
	folderWithFolder: function(folderId) {
		return TRYIT(function() {
			// No parent folder
			if ( this.folder(folderId).standard )
				return false;
		
			for ( var key in this.folders) if ( this.folders.hasOwnProperty(key) )
				if ( this.folders[key].hasFolder(folderId) )
					return this.folders[key];
			return this.base;
		}, this);
	}
});

/*
var structure = new UserStructure();
structure.addFeedToFolder(feed.id, folder.id);
structure.addFolderToFolder("Hello world", folder.id);

structure.forEachFolder(function(folder) {
	folder.items();
	
	folder.forEachItem(function() {
	
	});
});*/
;
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

;
var FeedFinder = Class.extend({
	initialize: function() {
		this.availableFeeds = {};
	},

	startListening: function() {
		app.events.subscribe("feedsFound", this.foundInTab);
		UI.onTabRemoved(this.tabClosed);
	},
		
	destroy: function(callback) {
		callback = callback || function() {};
		
		app.events.unsubscribe("feedsFound", this.foundInTab);
		UI.removeOnTabRemoved(this.tabClosed);
		
		callback();
	},
	
	foundInTab: function(evt) {
		this.availableFeeds[evt.tab] = evt.feeds;
		app.events.send("feeds:found", {tab: evt.tab});
	},
	
	feedsInCurrentTab: function(callback) {
		var availableFeeds = this.availableFeeds;
		
		chain(UI.currentTab)
		.then(function(tab) {
			var feeds = availableFeeds[tab.id] || [];
			callback(feeds);
		});
	},
	
	countFeedsInCurrentTab: function(callback) {
		this.feedsInCurrentTab(function(feeds) {
			callback(feeds.length);
		});
	},
	
	countFeedsInTab: function(tabId, callback) {
		callback(this.availableFeeds[tabId].length);
	},
	
	forEachFeed: function(callback) {
		this.feedsInCurrentTab(function(feeds) {
			feeds.forEach(callback);
		});
	},
	
	tabClosed: function(tabId) {
		delete this.availableFeeds[tabId];
	}
});

;
var FeedPoller = Class.extend({
	initialize: function() {},
	
	destroy: function(callback) {
		callback = callback || function() {};
		
		app.events.unsubscribe('feed:removed', this.feedRemoved);
		app.events.unsubscribe("feeder:connect", this.feederProStatusChanged);
		clearInterval(this.updaterInterval);
		clearTimeout(this.startTimeout);
		
		callback();
	},
	
	startPolling: function() {
		console.log("Waiting for %s ms before starting", Config.onLoadPollTimeout);
		this.startTimeout = setTimeout(this.start, Config.onLoadPollTimeout);
		this.isStarted = false;
		this.isInitialized = true;
	},
	
	start: function() {
		this.checkUpdate();
		this.isStarted = true;
		this.startUpdater();
	},
	
	startUpdater: function() {
		this.updateInterval = setInterval(this.checkUpdate, Config.pollTimeout);
	},

	// Check for updates, called by the poller every <Config.pollTimeout:30> seconds
	checkUpdate: function() {
		console.log("=== FEED POLL CHECK UPDATE");
		app.events.send('poller:check');
		app.user.forEachFeed(this.checkIfFeedNeedsUpdate);
	},
	
	forceUpdate: function(callback) {
		app.user.forEachFeed(function(feed) {
			app.poller.updateFeed(feed, true);
		});
		
		app.events.send('poller:check');
		
		fireCallback(callback);
	},
	
	checkIfFeedNeedsUpdate: function(feed) {
		var wait = feed.updateinterval || app.user.preferences.get('global:updateInterval');
		var lastUpdated = feed.lastUpdated;
		
		if ( Date.now() - lastUpdated >= wait )
			this.updateFeed(feed);
	},
	
	// Update feed, if it can't, ie max concurrent updates is reached, skip it, and wait till next time
	updateFeed: function(feed, force) {
		app.events.send('feed:needsUpdate', {feed: feed.id, force: force});
	}
});

;
var FeedLoader = Class.extend({
	initialize: function(feed) {
		this.feed = feed;
	},
	
	load: function(callback) {
		this.request = new Request({
			url: this.pathToLoad(),
			onComplete: this.loadComplete.withCallback(callback),
			onError: function() {
				callback('', '');
			},
			timeout: 30000
		});
		
		this.request.send();
	},
	
	loadComplete: function(status, text, xml, callback) {
		callback(xml || '', (text || '').trim() || '');
	},
	
	pathToLoad: function() {
		return this.feed.getPath();
	},
	
	abort: function() {
		this.isAborted = true;
		this.request.abort();
	}
});

FeedLoader.forFeed = function(feed) {
	return new (({
		'rss': RSSLoader,
		'google': GoogleLoader,
		'online': OnlineLoader
	})[feed.type] || RSSLoader)(feed);
};

FeedLoader.load = function(feed, callback) {
	var loader = FeedLoader.forFeed(feed);
	var parser = FeedParser.forFeed(feed);
		
	feed.loader = loader;
		
	chain(loader.load)
	.then(parser.setResult)
	.then(parser.parse)
	.then(function(parser) {
		callback(parser);
	});
};

;
/*
	Class:
		FeedParser
	
	Reads an RSS with callbacks for posts
*/

var FeedParser = Class.extend({
	initialize: function(feed) {
		this.feed = feed;
		this.path = feed.path;
		
		this.error = false;
		this.posts = [ /* { title, link, published } */ ];
		this.data = { /* title, favicon, link */ };
	},
	
	setResult: function(callback) { throw "implement"; },
	parse: function(callback) { throw "implement"; },

	getFeed: function() {
		this.feed.copyPropertiesFromServerData(this.data);
		this.feed.lastUpdated = Date.now();
		return this.feed;
	},
	
	// Transform post data into Post-objects
	getPosts: function() {
		var allAreRead = !! this.allAreRead;
		return this.posts.map(function(post) {
			var p = new Post(post);
			if ( allAreRead )
				p.is_read = 1;
			return p;
		});
	}
});

FeedParser.forFeed = function(feed) {
	return new ({
		'rss': RSSParser,
		'google': GoogleParser,
		'online': OnlineParser
	})[feed.type || 'rss'](feed);
};

;
var FeedUpdater = Class.extend({
	initialize: function() {
		// A list of currently updating feeds
		this.updating = [];
		
		// A list of feeds that need update, but the queue is too crowded for
		this.waiting = [];
	},
	
	startListening: function() {
		// Subscribe to know when an app is eligible for update
		app.events.subscribe('feed:needsUpdate', this.eventUpdateFeed);
		
		// Subscribe to know when the poller is checking updates. This is when we go through the queue
		// Some platforms might even support unread counts checking
		app.events.subscribe('poller:check', this.eventPollerCheck);
	},
	
	destroy: function(callback) {
		this.isDestroyed = true;
		app.events.unsubscribe('feed:needsUpdate', this.eventUpdateFeed);
		clearInterval(this.updaterInterval);
		
		// Abort ongoing requests
		for ( var i = 0, feed; feed = this.updating[i]; i++ )
			feed.loader.abort();
		
		fireCallback(callback);
	},
	
	eventPollerCheck: function() {
		for ( var i = 0, feed; (feed = this.waiting[i]) && i < Config.maxConcurrentUpdates; i++ )
			this.updateFeed(app.user.feed(feed));
		
		if ( this.supportsUnreadCounts() )
			this.checkUnreadCounts();
	},
	
	eventUpdateFeed: function(evt) {
		this.updateFeed(app.user.feed(evt.feed), evt.force);
	},
	
	// Update feed, if it can't, ie max concurrent updates is reached, skip it, and wait till next time
	updateFeed: function(feed, force) {
		// We don't update feeds on the online platform, since it's only doing an API call
		if (Ext.isOnline() || app.user.isPro())
			return;
		
		// Feed might not even exist!
		if ( ! feed )
			return;
		
		// If is in update list, something is probably wrong, but don't update it twice
		if ( this.updating.contains(feed.id) )
			return;
		
		// Only update <Config.maxConcurrentUpdates> feeds at a time
		if ( this.updating.length >= Config.maxConcurrentUpdates && ! force ) {
			if ( ! this.waiting.contains(feed.id) )
				this.waiting.push(feed.id);
			return;
		}
		
		this.runUpdate(feed);
	},
	
	runUpdate: function(feed, callback) {
		this.waiting.remove(feed.id);
		this.updating.push(feed.id);
		
		chain(this.loadFeed, feed)
		.then(this.storeResults)
		.and(function() {
			fireCallback(callback);
		});
	},
	
	loadFeed: function(feed, callbackWhenDone) {
		feed.isUpdating = true;
		
		var loader = FeedLoader.forFeed(feed);
		var parser = FeedParser.forFeed(feed);
		var updating = this.updating;
		
		feed.loader = loader;
		
		chain(loader.load)
		.then(parser.setResult)
		.then(parser.parse)
		.then(function(parser, callback) {				
			feed.isUpdating = false;
		
			// Remove feed as updating since it isn't
			updating.remove(feed.id);
			
			// Could have been aborted? Don't do anything
			if ( loader.isAborted ) {
				callbackWhenDone(false);
				return chain.exit;
			}
			
			// If an error occured send out an error event, and exit the chain
			if ( parser.error ) {
				app.events.send('error', {code: 'PARSER_ERROR'});
				app.events.send('updater:failed', {feed: parser.feed.id});
				feed.lastUpdated = Date.now();
				callbackWhenDone(false);
				return chain.exit;
			}
			
			callbackWhenDone(parser);
		});
	},
	
	storeResults: function(parser, callback) {
		if ( ! parser )
			return;
		
		var feed = parser.feed;
		feed.loadFavicon();
		
		// Keep track of when last "offical" update was stored
		feed.lastUpdated = Date.now();
		
		// If removed while updating, don't do didly
		if ( feed.deleted )
			return;
		
		var posts = parser.getPosts();
		
		if ( Ext.isOnline() || app.user.isPro())
			return fireCallback(callback);
		
		// Store feed and posts
		chain(app.user.addPosts, feed, posts)
		.andSync(app.user.clearUnreadCache)
		.and(app.user.countUnread, function() {
			fireCallback(callback);
		});
	},
	
	supportsUnreadCounts: function() {
		return Ext.isOnline() || app.user.isPro();
	},
	
	checkUnreadCounts: function() {
		app.sync.loadUnreadCounts(this.checkUnreadCountsForNew);
	},
	
	checkUnreadCountsForNew: function(counts) {
		for (var feedId in counts) if (counts.hasOwnProperty(feedId)) {
			this.checkUnreadCountAndLastUpdatedForFeed(app.user.feed(feedId), counts[feedId].last_updated, counts[feedId].unread);
		}
	},
	
	checkUnreadCountAndLastUpdatedForFeed: function(feed, lastUpdated, unread) {
		// If feed was removed
		if ( ! feed )
			return false;

		var storedUnreadCountForFeed = app.user.countUnreadForFeed(feed.id);
		app.user.updateUnreadCountForFeed(feed.id, unread);
		
		// If storedUnreadCountForFeed is undefined then it's the first time around
		// so we send a feed:updated event, which otherwise would be taken care of by the updated below
		if (typeof storedUnreadCountForFeed === "undefined") {
			app.events.send("feed:updated", {feed: feed.id});
		}

		// If no previous api check has been done, or no unread counts have been stored, just wait
		if (typeof feed.apiLastUpdated === "undefined" || typeof storedUnreadCountForFeed === "undefined" ) {
			feed.apiLastUpdated = lastUpdated;
			feed.previousUnreadCount = storedUnreadCountForFeed;
			return;
		}

		// Has the feed updated since we last checked, or just that unread count has changed?
		if (feed.apiLastUpdated != lastUpdated || storedUnreadCountForFeed != unread) {
			console.log("NEEDS UPDATE: %s # %s != %s || %s != %s", feed.title, feed.apiLastUpdated, lastUpdated, storedUnreadCountForFeed, unread);
			
			feed.needsUpdate = true;
			feed.previousUnreadCount = storedUnreadCountForFeed;

			// Store previos api check time so we have a range to go by
			feed.previousApiLastUpdated = feed.apiLastUpdated;
			feed.apiLastUpdated = lastUpdated;
			
			app.events.send("feed:backendUpdated", {feed: feed.id});

			return true;
		}

		return false;
	}
});

;
/*
	Class:
		FeedSync
	
	Sync feeds with other clients, beginning with Google Reader
	
	Do so by listening for feed:*-events, like feed:added, feed:removed,
	and also by bringing changes upstream from Google Reader
*/

var FeedSync = Class.extend({
	initialize: function() {
		this.syncers = [];
		this.syncerMap = {};
	},

	destroy: function(callback) {
		this.run('destroy', [], callback);
	},
	
	isFailedState: function() {
		return this.syncers.some(function(syncer) {
			return syncer.FAILURE;
		});
	},

	run: function(command, args, callback) {
		var link = chain();
		for ( var i = 0, syncer; syncer = this.syncers[i]; i++ )
			link.and.apply(link, [syncer[command]].concat(args));
		
		link.end(callback);
	},

	can: function(method) {
		return !!this.getWith(method);
	},

	getWith: function(method) {
		return this.syncers.filter(function(sync) {
			return typeof sync[method] === "function";
		})[0];
	},
	
	// Register all syncers
	startSyncing: function(callback) {
		chain(this.reloadSyncers)
		.and(this.addFeeder)
		.end(callback);
	},

	reloadSyncers: function(callback) {
		var queue = chain();

		if ( app.user.preferences.get('sync:google') && ! (Ext.isOnline() || app.user.isPro())  )
			queue.and(this.addGoogle)
			
		if ( Ext.isOnline() || app.user.isPro() )
			queue.and(this.addOnline);

		queue.end(callback);
	},
	
	createSyncer: function(name, syncerClass, callback) {
		var syncer = new syncerClass();
		syncer.startListening();
		
		this.syncers.push(syncer);
		this.syncerMap[name] = syncer;
		
		fireCallback(callback, syncer);
		
		return syncer;
	},

	unconnectSyncer: function(name) {
		var syncer = this.syncerMap[name];
		if (!syncer)
			return;
		this.syncers.remove(syncer);
		delete this.syncerMap[name];
		return syncer;
	},
	
	removeSyncer: function(name, callback) {
		var syncer = this.unconnectSyncer(name);

		chain(syncer.destroy)
		.and(syncer.uninstall)
		.then(function(feedsWithProblems) {
			callback(feedsWithProblems);
		});
	},
	
	fetchUpstream: function(callback) {
		this.run('fetchUpstream', [], callback);
	},
	
	processFeed: function(feed, callback) {
		this.run('processFeed', [feed], callback);
	},
	
	reloadDownstream: function(callback) {
		this.run('reloadDownstream', [], callback);
	},
	
	loadUnreadCounts: function(callback) {
		var syncer = false;
		if (this.get('online'))
			syncer = this.get('online');
		else if (this.get('google'))
			syncer = this.get('google');
		if (! syncer)
			return callback(false);
		syncer.loadUnreadCounts(callback);
	},

	push: function() {
		var args = [].slice.call(arguments);
		var callback = args[args.length-1];
		var syncers = args.slice(0, -1);
		
		if (! syncers.length) {
			syncers = this.syncers;
		}
		
		var exporter = new Exporter();
		
		var queue = chain();
		syncers.forEach(function(sync) {
			queue.and(sync.pushUp, exporter.feeds);
		});
		
		queue.end(callback, exporter);
	},
	
	get: function(syncer) {
		return this.syncerMap[syncer];
	},
	
	error: function(t) {
		alert("ERROR with " + t + ": You are not logged in as " + app.user.preferences.get("sync:google"));
	},
	
	//
	// Feeder setup
	//
	
	addFeeder: function(callback) {
		return this.createSyncer("feeder", FeederSyncer, callback);
	},

	addOnline: function(callback) {
		return this.createSyncer("online", OnlineSyncer, callback);
	},
	
	//
	//	Google setup
	//
	
	addGoogle: function(callback) {
		return this.createSyncer("google", GoogleSyncer, callback);
	},
	
	setupGoogle: function(callback) {
		Google.ensureUser(this.googleAuthenticationComplete.withCallback(callback));
	},
	
	googleAuthenticationComplete: function(success, callback) {
		if ( ! success )
			return callback("fail-auth");
		
		// We are now logged in as the right user.
		chain(Google.fetchFeeds)
		.then(function(subscriptions) {
			callback("success", subscriptions);
		});
	},
	
	//
	// Feed syncing
	//
	
	mergeContainer: function(feedContainer, callback) {
		this.currentFolder = app.user.structure.base;
		
		app.user.transaction(function(flushEvents) {
			chain(this.merge, feedContainer.base)
			.and(app.user.structure.save)
			.andSync(flushEvents)
			.and(function(next) {
				app.events.sendForced("sync:merge", {status: "Merge done"});
				next();
			})
			.end(callback, true);
		}.bind(this));
	},
	
	merge: function(folder, callback) {
		var queue = chain(), mergeItem = this.mergeItem;
		
		app.events.sendForced("sync:merge", {status: "Merging " + folder.name});
		
		folder.forEachItem(function(item) {
			queue.and(mergeItem, item);
		});
		
		queue.end(callback);
	},
	
	mergeItem: function(item, callback) {
		if ( item.isFeed )
			this.mergeFeed(item, callback);
		else
			this.mergeFolder(item, callback);
	},
	
	mergeFeed: function(feed, callback) {
		var currentFolder = this.currentFolder;
		
		var newFeed = new Feed(feed);
		if ( ! feed.type )
			feed.type = "rss";
		delete newFeed.id;
		
		app.events.sendForced("sync:merge", {status: "Merging feed " + feed.title});
		
		chain(app.sync.processFeed, newFeed)
		.and(app.user.addFeedIfNotExistsWithoutFolder, newFeed)
		.and(function() {
			if ( newFeed.id && ! currentFolder.hasFeed(newFeed.id) )
				currentFolder.addFeed(newFeed.id);
			callback();
		});
	},
	
	mergeFolder: function(folder, callback) {
		delete folder.id;
		
		var syncer = this;
		
		app.events.sendForced("sync:merge", {status: "Merging folder " + folder.name});
		
		chain(app.user.structure.findByParentAndName, syncer.currentFolder.id, folder.name)
		.then(function(addedFolder) {
			if ( ! syncer.currentFolder.hasFolder(addedFolder.id) )
				syncer.currentFolder.addFolder(addedFolder.id);
			syncer.mergeNextFolder(addedFolder, folder, callback);
		});
	},
	
	mergeNextFolder: function(addedFolder, folder, callback) {
		var lastFolder = this.currentFolder;
		this.currentFolder = addedFolder;
		
		chain(this.merge, folder)
		.end(this.mergeFolderDone, lastFolder, callback);
	},
	
	mergeFolderDone: function(lastFolder, callback) {
		this.currentFolder = lastFolder;
		callback();
	}
});

;
var FeedContainer = Class.extend({
	initialize: function() {
		this.feeds = {};
		this.folders = {};
		
		this.feedIdCounter = 9999999;
		this.folderIdCounter = 9999999;
		
		this.base = false;
		this.folderQueue = [];
	},
	
	addFeed: function(data) {
		var originalId = data.id || false;

		var feed = new Feed(data);
		feed._originalId = originalId;
		
		// this is wrong? this.feeds[id] = feed
		if ( this.feeds[feed.guid] )
			return;
		
		if ( ! feed.favicon )
			feed.favicon = app.config.defaultFavicon(feed.path);
		
		if ( ! feed.title )
			feed.title = feed.path;
		
		if ( ! feed.type )
			feed.type = "rss";
		
		TRYIT(function() {
			if ( ! feed.link )
				feed.link = "http://" + (new URI(feed.path)).host();
		});
		
		if ( ! feed.id )
			feed.id = this.feedIdCounter++;
		this.feeds[feed.id] = feed;
		
		this.currentFolder.addFeed(feed.id);
	},
	
	addFolder: function(folder) {
		folder.id = this.folderIdCounter++;
		this.folders[folder.id] = folder;
		
		if ( this.currentFolder )
			this.currentFolder.addFolder(folder.id);
	},
	
	pushFolder: function(name) {
		var folder;
		if ( typeof name === "string" ) {
			folder = new Folder();
			folder.name = name;
		
			this.addFolder(folder);
		} else
			folder = name;
		folder.structure = this;
		
		if ( ! this.base ) {
			this.base = folder;
			folder.standard = true;
		}
		
		this.currentFolder = folder;
		this.folderQueue.push(folder);
		
		return folder;
	},
	
	popFolder: function() {
		this.folderQueue.pop();
		this.currentFolder = this.folderQueue[this.folderQueue.length-1];
	},
	
	feed: function(id) {
		return this.feeds[id];
	},
	
	folder: function(id) {
		return this.folders[id];
	},
	
	forEachFeed: function(callback) {
		for ( var key in this.feeds ) if (this.feeds.hasOwnProperty(key))
			fireCallback(callback, this.feeds[key]);
	},
	
	removeFeed: function(feed) {
		this.feedToRemove = feed;
		delete this.feeds[feed];
		this.recRemoveFeed(this.base);
	},

	recRemoveFeed: function(folder) {
		folder.removeFeed(this.feedToRemove.id);
		folder.getFolders().forEach(this.recRemoveFeed);
	},

	toJSON: function() {
		var obj = {name: "Feeds"};
		obj.items = this.base.items().map(function serialize(item) {
			if (item.isFeed)
				return item.toJSON();
			else {
				var folder = item.toJSON();
				folder.items = item.items().map(serialize);
				return folder;
			}
		});
		return JSON.stringify(obj);
	}
});
;
var FeedUnreadContainer = Class.extend({
	initialize: function() {
		this.feeds = {};
	},

	addPostFor: function(feed, post) {
		if (!this.feeds[feed.path])
			this.feeds[feed.path] = [];

		this.feeds[feed.path].push({
			title: post.title,
			link: post.link,
			guid: post.guid,
			is_read: post.is_read,
			is_starred: post.is_starred
		});
	},

	toJSON: function() {
		return JSON.stringify(this.feeds);
	}
});
;
/*
	Class:
		Importer
	
	Takes care of importing old folder structure to FeedReader 4.0.
	Also takes care of migrations between DB versions.
*/

var Importer = Class.extend({
	initialize: function() {
		this.migrationMapper = Mapper.get("migration");
	},
	
	install: function(callback) {
		if (Database.current.isApi)
			return callback();
		this.migrationMapper.install(callback);
	},
	
	migrateDB: function(callback) {
		if (Database.current.isApi)
			return callback();
		this.migrationMapper.migrate(callback);
	},
	
	importOldFolders: function(callback) {
		if (Database.current.isApi)
			return callback();
		if ( ! localStorage.folders )
			return fireCallback(callback);
		
		this.folders = JSON.parse(localStorage.folders);
		
		this.feeds = new FeedContainer();
		this.runThroughFolder(this.folders[0]);
		
		app.sync.mergeContainer(this.feeds, function() {
			localStorage.oldFolders = localStorage.folders;
			delete localStorage.folders;
			fireCallback(callback);
		});
	},
	
	runThroughFolder: function(folder) {
		if ( ! folder )
			return;
		
		var name = folder.name; 
		this.feeds.pushFolder(name);
		
		var children = folder.children;
		var order = folder.feeds;
		
		var oldChildren = this.children;
		this.children = children;
		
		if ( typeof order === "object" && order.constructor === Array ) {
			order.forEach(this.runThroughChildren);
		}
		
		this.children = oldChildren;
		this.feeds.popFolder();
	},
	
	runThroughChildren: function(child) {
		if ( typeof child === "number" )
			this.runThroughFolder(this.children[child]);
		else
			this.addFeed(child);
	},
	
	addFeed: function(url) {
		var feed = app.user.feedBy("path", url);
		if ( ! feed ) {
			feed = new Feed();
			feed.path = feed.guid = url;
		}
		this.feeds.addFeed(feed);
	}
});

Importer.folders = {"0":{"name":"Feeds","children":{"1":{"name":"Folders","children":{"3":{"name":"Folders","children":{"2":{"name":"Within","children":{},"feeds":[]}},"feeds":[2]}},"feeds":["http://localhost/random/feed.rss","http://feeds.feedburner.com/codinghorror",3]}},"feeds":["http://anna.blo.gg/index.rss","http://feeds.feedburner.com/mootools-blog","http://webkit.org/blog/feed/","http://erikrothoff.com/feed/","http://duriansoftware.com/joe/index.rss","http://kent.nu/feed/","http://backend.deviantart.com/rss.xml?q=by%3ALindgrena&type=journal&formatted=1","http://pearlplatt.blogg.se/index.rss","http://peter.sh/feed/","http://allergilogg.blogg.se/index.rss","http://blog.wilshipley.com/feeds/posts/default","http://johanharenblogg.blogg.se/index.rss","http://andreaslagerkvist.com/?module=Articles&rss=1","http://xkcd.com/rss.xml","http://feed.dilbert.com/dilbert/daily_strip","http://erik.glonk.se/life/generate.php","http://littlebigdetails.com/rss","http://haironfire.blogg.se/index.rss","http://rootof.tumblr.com/rss","http://www.smbc-comics.com/rss.php","http://www.tbray.org/ongoing/ongoing.atom",1]}};
;
/*
	Class:
		Exporter
	
	Creates a container with the local DB and Google reader merged, into a Google Reader-friendly format
	(no nested folders). In the future this class should be made smarter, by creating an abstract container
	for foreign feed data (in this case googleSubscription). This applies to the entire Google Reader integration really.
*/

var Exporter = Class.extend({
	initialize: function() {
		this.googleSubscription = Google.subscription;

		// Build a structure with the final result
		this.buildStructure();
	},
	
	buildStructure: function() {
		this.feeds = app.user.createFeedContainer();
		this.feeds.pushFolder("Feeds");
		
		// Add Google Feeds
		if ( this.googleSubscription && this.googleSubscription.order && this.googleSubscription.order.root )
			this.googleSubscription.order.root.forEach(this.addGoogleOrderSubscription);
		
		this.nestedFolders = [];
		
		// Merge current structure into it
		app.user.structure.base.forEachItem(this.addCurrentItem);
		
		// Add nested folders to bottom folder
		this.nestedFolders.forEach(function(folder) {
			this.feeds.pushFolder(folder.name);
			folder.getFeeds().forEach(this.addCurrentFeed);
			this.feeds.popFolder();
		}, this);
	},
	
	addGoogleOrderSubscription: function(item) {
		if ( item.isFeed )
			this.addGoogleFeedSubscription(item);
		else
			this.addGoogleFolderSubscription(item);
	},
	
	addGoogleFeedSubscription: function(feed) {
		if ( ! feed.isFeed )
			return;
		
		this.feeds.addFeed({
			path: feed.href,
			guid: feed.id,
			link: feed.htmlUrl,
			title: feed.title,
			type: 'google'
		});
	},
	
	addGoogleFolderSubscription: function(folder) {
		var category = this.googleSubscription.order.categories.filter(function(a) {
			return a.id == folder.id;
		})[0];
		
		if ( ! category )
			return;
			
		this.feeds.pushFolder(folder.label);
		
		// Only add feeds since we can't have nested folders in Google Reader
		category.order.forEach(this.addGoogleFeedSubscription);
		
		this.feeds.popFolder();
	},
	
	addCurrentItem: function(item) {
		if ( item.isFeed )
			this.addCurrentFeed(item);
		else {
			// If in base folder (since we don't support nested folders)
			if ( this.feeds.base === this.feeds.currentFolder )
				this.addCurrentFolder(item);
			else
				this.addNestedFolder(item);
		}
	},
	
	addCurrentFeed: function(feed) {
		if ( this.feeds.currentFolder.feedBy('path', feed.path) )
			return;
		this.feeds.addFeed(feed);
	},
	
	addCurrentFolder: function(folder) {
		var folderInstance = this.feeds.currentFolder.folderBy('name', folder.name);
		
		this.feeds.pushFolder(folderInstance || folder.name);
		folder.items().forEach(this.addCurrentItem);
		this.feeds.popFolder();
	},
	
	addNestedFolder: function(folder) {
		this.nestedFolders.push(folder);
		folder.getFolders().forEach(this.addNestedFolder);
	}
});
;
/*
	Class:
		Syncer
	
	Base class for syncing to services
*/

var Syncer = Class.extend({
	startListening: function() {
		app.events.subscribe('feed:added', this.feedAdded);
		app.events.subscribe('feed:updated', this.feedUpdated);
		app.events.subscribe('feed:removed', this.feedRemoved);
		app.events.subscribe('post:updated', this.postUpdated);
		app.events.subscribe('folder:updated', this.folderUpdated);
		app.events.subscribe('folder:added', this.folderAdded);
		app.events.subscribe('folder:removed', this.folderRemoved);
		app.events.subscribe('preferences:changed', this.preferencesChanged);
	},
	
	destroy: function(callback) {
		callback = callback || function() {};
		
		app.events.unsubscribe('feed:added', this.feedAdded);
		app.events.unsubscribe('feed:updated', this.feedUpdated);
		app.events.unsubscribe('feed:removed', this.feedRemoved);
		app.events.unsubscribe('post:updated', this.postUpdated);
		app.events.unsubscribe('folder:updated', this.folderUpdated);
		app.events.unsubscribe('folder:added', this.folderAdded);
		app.events.unsubscribe('folder:removed', this.folderRemoved);
		app.events.unsubscribe('preferences:changed', this.preferencesChanged);
		
		callback();
	},
	
	run: function(command, args) {
		this[command].apply(this, args);
	},

	failedInit: function() {
		this.FAILURE = true;
	},

	succeededInit: function() {
		this.FAILURE = false;
	},
	
	processFeed: function(feed, callback) { throw "implement Syncer.processFeed"; },
	
	feedAdded: function(evt, callback) { throw "implement Syncer.feedAdded"; },
	feedUpdated: function(evt, callback) { throw "implement Syncer.feedUpdated"; },
	feedRemoved: function(evt, callback) { throw "implement Syncer.feedRemoved"; },
	postUpdated: function(evt, callback) { throw "implement Syncer.postUpdated"; },
	folderUpdated: function(evt, callback) { throw "implement Syncer.folderUpdated"; },
	folderAdded: function(evt, callback) { throw "implement Syncer.folderAdded"; },
	folderRemoved: function(evt, callback) { throw "implement Syncer.folderRemoved"; },
	preferencesChanged: function(evt, callback) {},
	
	fetchUpstream: function(callback) { throw "implement Syncer.fetchUpstream"; },
	pushUp: function(order, callback) { throw "implement Syncer.pushUp"; },
	reloadDownstream: function() { throw "implement Syncer.reloadDownstream"; }

	// optionally implemented by those who support it
	//clearAllUnread: function() {},
	//clearAllUnreadEverywhere: function() {}
});

;
var GoogleSyncer = Syncer.extend({
	startListening: function() {
		this._super.apply(this, arguments);
		
		if ( ! GoogleOAuth2.refresh_token && app.user.preferences.get("sync:google") )
			GoogleOAuth2.refresh_token = app.user.preferences.get("sync:google");
	},
	
	install: function(callback) {
		app.events.send("syncsetup:status", {text: "Fetching from Google Reader..."});
		
		app.user.preferences.set("sync:google", GoogleOAuth2.refresh_token);
		this.fetchUpstream(callback);
	},
	
	uninstall: function(callback) {
		app.user.preferences.remove("sync:google");

		app.events.send("unsync:status", {text: "Removing Google Reader sync"});
		
		this.feedsWithProblems = [];
		
		var link = chain();
		var googleSync = this;
		
		// Change all feeds from google, to their rss equivalents
		app.user.forEachFeed(function(feed) {
			if ( feed.type === 'google' )
				link.and(googleSync.unprocessFeed, feed);
		});
		
		link.and(this.removeFeedsWithProblems);
		link.and(app.user.reloadFeeds);
		
		link.end(function() {
			GoogleOAuth2.refresh_token = false;
			GoogleOAuth2.access_token = false;
			
			app.events.send("unsync:status", {text: "Done"});
			callback(googleSync.feedsWithProblems);
		});
	},
	
	unprocessFeed: function(feed, callback) {
		app.events.send("unsync:status", {text: "Unprocessing " + feed.title + "..."});
		
		feed.type = 'rss';
		
		// Change GUID and path
		feed.guid = feed.path = Google.unFeedStream(feed.guid);
		
		var feedsWithProblems = this.feedsWithProblems;
		var unprocessPosts = this.unprocessPosts;
		
		// Make sure it exists and works
		chain(feed.save)
		.and(FeedLoader.load, feed)
		.then(function(parser, next) {
			if ( parser.error ) {
				feedsWithProblems.push(feed);
				return next();
			}
			unprocessPosts(feed, parser, next);
		})
		.end(callback);
	},
	
	unprocessPosts: function(feed, parser, callback) {
		app.events.send("unsync:status", {text: "Unprocessing posts for " + feed.title + "..."});
		
		// Make sure the parser marks them all as read
		parser.allAreRead = true;
		
		chain(feed.deleteAllPosts)
		.and(app.updater.storeResults, parser)
		.end(callback);
	},
	
	removeFeedsWithProblems: function(callback) {
		app.events.send("unsync:status", {text: "Removing feeds with problems..."});
		
		var link = chain();
		for ( var i = 0, feed; feed = this.feedsWithProblems[i]; i++ )
			link.and(app.user.removeFeed, feed);
		link.end(callback);
	},
	
	processFeed: function(feed, callback) {
		if ( feed.type === 'google' )
			return fireCallback(callback);
		
		chain(Google.addFeed, feed)
		.then(function(data, next) {
			if ( ! data ) {
				feed.isError = true;
				return next();
			}
			
			feed.type = 'google';
			feed.guid = data.streamId;
			
			next();
		})
		.end(callback);
	},
	
	feedAdded: function(evt, callback) {
		fireCallback(callback);
	},
	
	feedUpdated: function(evt, callback) {
		var feed = app.user.feed(evt.feed);
		
		if ( evt.reason === 'name' )
			Google.updateFeed(feed, callback);
		else if ( evt.reason === 'category' ) {
			var toFolder = app.user.structure.folder(evt.to);
			var fromFolder = app.user.structure.folder(evt.from);
			
			var link = chain();
			
			// Don't add/remove category if it is standard
			if ( ! fromFolder.standard )
				link.and(Google.removeTag, feed.guid, fromFolder.googleId());
			
			link.and(Google.addTag, feed.guid, toFolder.googleId());
			link.and(Google.checkFolderSyncStatus, toFolder.name);
			
			link.end(callback || function() {});
		} else
			fireCallback(callback);
	},
	
	feedRemoved: function(evt, callback) {
		if ( evt.feedType === "google" )
			Google.removeFeed(evt.guid);
		fireCallback(callback);
	},
	
	folderUpdated: function(evt, callback) {
		var folder = app.user.structure.folder(evt.folder);
		
		if ( evt.reason === 'order' ) {
			var sortstring = folder.toGoogleString()
			
			Google.updateOrder(sortstring, folder.googleId(), callback);
		} else if ( evt.reason === 'name' ) {
			var parent = folder.getParent();
			Google.renameFolder(evt.prev, folder.name, function() {
				var sortstring = parent.toGoogleString()
				Google.updateOrder(sortstring, parent.googleId(), callback);
			});
		} else
			fireCallback(callback);
	},
	
	folderAdded: function(evt, callback) {
		Google.unsyncedFolders.push(app.user.structure.folder(evt.folder).name);
		fireCallback(callback);
	},
	
	folderRemoved: function(evt, callback) {
		Google.removeFolder(Google.toLabelName(evt.folderName), callback);
	},
	
	postUpdated: function(evt, callback) {
		chain(Google.updatePost, app.store.post(evt.post))
		.end(callback);
	},
	
	reloadDownstream: function(callback) {
		this.reloadSubscriptions(callback);
	},
	
	fetchUpstream: function(callback) {
		this.feedMap = {};
		this.reverseFeedMap = {};
		this.folderMap = {};
		this.reverseFolderMap = {};
		
		// We probably don't have to do this on every application load
		// we should set some form of counter, perhaps fetch upstream every day,
		// or if initialized by the user?
		chain(GoogleOAuth2.refreshToken)
		.thenSync(function() {
			if (GoogleOAuth2.tokenError) {
				this.failedInit();
				fireCallback(callback);
				return chain.exit;
			}
			this.succeededInit();
		}.bind(this))
		.and(Google.fetchSelf)
		.and(this.reloadSubscriptions)
		.and(this.mergeFeeds)
		.end(callback);
	},
	
	mergeFeeds: function(callback) {
		// Decide which feeds in localDB to add, remove and change

		if ( !this.subscriptions)
			return fireCallback(callback);
		
		var feeds = this.subscriptions.feeds.map(this.googleSubscriptionToFeed);
		
		var link = chain();
		for ( var i = 0, feed; feed = feeds[i]; i++ ) {
			link.and(this.mergeFeed, feed);
			// This should only be run on first load of feed to fetch the posts
			//link.and(app.updater.runUpdate, feed);
		}
		
		link.and(this.populateFolders, this.subscriptions);
		link.and(this.mergeOrder, this.subscriptions);
		link.end(callback);
	},
	
	mergeFeed: function(feed, callback) {
		var map = this.feedMap, reverseMap = this.reverseFeedMap;
		
		// Check if feed exists
		//  - Add if not
		//  - Do nothing otherwise
		
		app.user.addFeedIfNotExists(feed, function() {
			map[feed.guid] = feed.id;
			reverseMap[feed.id] = feed.guid;
			callback();
		});
	},
	
	mergeOrder: function(subscriptions, callback) {
		var link = chain();
		
		// Purge removed feeds
		link.and(this.purgeFeeds);
		
		// Add root folder
		link.and(this.mergeOrderToFolder, subscriptions.order.root, app.user.structure.base.id);

		// Add sub-folders
		for ( var i = 0, category; category = subscriptions.order.categories[i]; i++ )
			link.and(this.mergeOrderToFolder, category.order, this.folderMap[category.id]);
		
		// Purge folders with removed stuff
		link.and(this.purgeFolders);
		
		// Save order to database
		link.and(app.user.structure.save);

		link.end(callback);
	},
	
	mergeOrderToFolder: function(objects, folderId, callback) {
		var folderMap = this.folderMap;
		var feedMap = this.feedMap;
		
		var link = chain();
		
		objects.forEach(function(obj) {
			if ( obj.isFeed ) {
				if (feedMap[obj.id])
					link.and(app.user.structure.addFeedToFolder, feedMap[obj.id], folderId);
			} else {
				if (folderMap[obj.id] )
					link.and(app.user.structure.addFolderToFolder, folderMap[obj.id], folderId);
			}
		});
		
		link.end(callback);
	},
	
	// Remove all feeds that have been removed from categories
	// and remove categories not in use any more
	purgeFolders: function(callback) {
		var link = chain();
		var isInFolder = this.isInFolder;
		var reverseFolderMap = this.reverseFolderMap;
		var subscriptions = this.subscriptions;
		
		// Loop through every folder and remove orphans
		app.user.structure.forEachFolder(function(folder) {
			// Check every feed
			folder.forEachItem(function(item) {
				if ( item.isFolder ) return;
				
				if ( ! isInFolder(item, folder) )
					folder.removeFeed(item.id);
			});
		});
		
		// Loop through every folder and find ones not used by Google Reader
		app.user.structure.forEachFolder(function(folder) {
			if ( folder.id != app.user.structure.base.id && ! reverseFolderMap[folder.id] )
				link.and(app.user.structure.removeFolder, folder);
		});
		
		link.end(callback);
	},
	
	// Remove unused feeds
	purgeFeeds: function(callback) {
		var feedMap = this.reverseFeedMap;
		
		var link = chain();
		app.user.forEachFeed(function(feed) {
			// If feed is not used, remove it
			if ( ! feedMap[feed.id] )
				link.and(app.user.removeFeed, feed);
		});
		
		link.end(callback);
	},
	
	isInFolder: function(feed, folder) {
		// check if $feed is in $folder
		// find $folder in this.subscriptions.order
		var readerCategory = this.reverseFolderMap[folder.id];
		var category = this.getCategoryFromId(readerCategory);
		
		// No category? Assume root. TODO: FIXME: Make better
		category = !category ? this.subscriptions.order.root : category.order;
		
		return category.some(function(f) {
			return f.id == feed.guid;
		});
	},
	
	getCategoryFromId: function(id) {
		for ( var i = 0, cat; cat = this.subscriptions.order.categories[i]; i++ )
			if ( cat.id == id )
				return cat;
		return false;
	},
	
	populateFolders: function(subscriptions, callback) {
		var folderMap = this.folderMap;
		var reverseFolderMap = this.reverseFolderMap;
		
		var link = chain();
		subscriptions.categories.forEach(function(category) {
			link.and(app.user.structure.findByParentAndName, app.user.structure.base.id, category.label);
			link.then(function(folder, next) {
				folderMap[category.id] = folder.id;
				reverseFolderMap[folder.id] = category.id;
				next();
			});
		});
		link.end(callback);
	},
	
	googleSubscriptionToFeed: function(sub) {
		return new Feed({
			type: 'google',
			guid: sub.id,
			path: Google.unFeedStream(sub.id),
			title: sub.title,
			link: sub.htmlUrl,
			favicon: app.config.defaultFavicon(sub.htmlUrl)
		});
	},
	
	reloadSubscriptions: function(callback) {
		chain(Google.fetchFeeds)
		.then(this.storeSubscriptions)
		.end(callback);
	},
	
	storeSubscriptions: function(subscriptions, callback) {
		this.subscriptions = subscriptions;
		this.googleSubscriptionMap = {};
		
		if (subscriptions && subscriptions.feeds) {
			for ( var i = 0, feed; feed = subscriptions.feeds[i]; i++ )
				this.googleSubscriptionMap[feed.id] = feed;
		}
		
		if (subscriptions && subscriptions.categories) {
			for ( var i = 0, folder; folder = subscriptions.categories[i]; i++ )
				this.googleSubscriptionMap[folder.id] = folder;
		}
		
		fireCallback(callback, this.subscriptions);
	},
	
	pushUp: function(feedContainer, callback) {
		this.newData = feedContainer;
		this.badFeeds = [];
		
		app.events.send("syncsetup:status", {text: "Syncing..."});
		
		chain(this.reloadSubscriptions) // ✔
		.and(this.upAddSubscriptions) // ✔
		.and(this.upAddFolders) // ✔
		.and(this.upStoreOrder) // ✔
		.and(this.upCheck) // ✔
		.then(function(success) {
			app.events.send("syncsetup:status", {text: "Sync complete"});
			fireCallback(callback, success);
		});
	},
	
	// Add feeds not found in Google Reader, but user might have had locally before syncing
	upAddSubscriptions: function(callback) {
		app.events.send("syncsetup:status", {text: "Pushing local feeds to Google Reader"});
		
		var link = chain();
		var googleSyncer = this;
		
		this.newData.forEachFeed(function(feed) {
			if ( feed.type !== "rss" )
				return;
			
			link.and(function(next) {
				app.events.send("syncsetup:status", {text: "Pushing " + feed.title + "..."});
				next();
			});
			
			// Add this feed
			link.and(Google.addFeed, {path: feed.path}).then(function(res, next) {
				// So this feed didn't exist in Google Reader
				if ( ! res ) {
					googleSyncer.badFeeds.push(feed.path);
					googleSyncer.newData.removeFeed(feed);
					return next();
				}
				feed.guid = res.streamId;
				next();
			});
		});
		
		link.end(callback);
	},
	
	upAddFolders: function(callback) {
		app.events.send("syncsetup:status", {text: "Adding local folders to Google Reader"});
		
		var link = chain();
		
		// Add correct feeds to correct categories
		this.newData.base.getFolders().forEach(function(folder) {
			var streamIds = [];
			
			// Loop through children adding tag with name user/-/label/<labelname>
			folder.getFeeds().forEach(function(feed) {
				streamIds.push(feed.guid);
			});
			
			link.and(Google.addTag, streamIds, Google.toLabelName(folder.name));
		});
				
		link.end(callback);
	},
	
	upStoreOrder: function(callback) {
		app.events.send("syncsetup:status", {text: "Updating order..."});
		
		// Make sure we have all sortid's
		chain(this.reloadSubscriptions)
		// Then do the actual updating
		.then(this.upStoreAllOrder)
		.end(callback);
	},
	
	upStoreAllOrder: function(callback) {
		app.events.send("syncsetup:status", {text: "Saving order..."});
		this.updateSortOrderForFolder({id: Google.categories.root}, this.newData.base, callback);
	},
	
	updateSortOrderForFolder: function(folder, items, callback) {
		app.events.send("syncsetup:status", {text: "Saving order for " + folder.label + "..."});
		
		var link = chain();
		var sortString = [];
		
		items.items().forEach(function(item) {
			if ( item.isFeed && this.googleSubscriptionMap[item.guid] )
				sortString.push(this.googleSubscriptionMap[item.guid].sortid);
			else if ( item.isFolder ) {
				var category = this.googleSubscriptionMap[item.googleId()];
				if ( ! category || ! item.items().length )
					return;
				sortString.push(category.sortid);
				
				link.and(this.updateSortOrderForFolder, category, item);
			}
		}, this);
				
		link.and(Google.updateOrder, sortString.join(""), folder.id);
		link.end(callback);
	},
	
	upCheck: function(callback) {
		callback(!! this.badFeeds.length);
	},
	
	getUsername: function() {
		return Google.profileData ? Google.profileData.userName : "Loading...";
	},
	
	getEmail: function() {
		return Google.profileData ? Google.profileData.userEmail : "Restart to see email";
	},

	clearAllUnread: function(feed, callback) {
		Google.markAllAsRead(feed.guid, callback);
	},

	clearAllUnreadEverywhere: function(callback) {
		Google.markAllFeedsAsRead(callback);
	},

	requireLocalCacheUpdate: function() {
		return true;
	}
});

;
var FeederSyncer = Syncer.extend({
	startListening: function() {
		this._super.apply(this, arguments);
		
		app.events.subscribe("feeder:connect", this.receivedConnectRequest);
		app.events.subscribe("feeder:fetchFeeds", this.receivedFetchFeedsRequest);

		this.checkToken();
		
		if (Ext.isSafari())
			safari.extension.addContentScriptFromURL(Ext.path("content/feeder_api.js"), ["http://*.feeder.co/*"], [], true);
	},
	
	destroy: function() {
		this._super.apply(this, arguments);
		
		app.events.unsubscribe("feeder:connect", this.receivedConnectRequest);
		
		if (Ext.isSafari())
			safari.extension.removeContentScriptFromURL(Ext.path("content/feeder_api.js"));
	},
	
	uninstall: function(callback) {
		var oldToken = app.user.preferences.get("feeder:token");

		var removeTokenRequest = new Request({url: Config.feeder.destroyTokenURL, method: "POST"});
		removeTokenRequest.send({
			post: {
				client_id: app.user.preferences.get("client_id"),
				token: oldToken
			}
		});

		app.user.preferences.remove("feeder:token");
		app.user.preferences.remove("feeder:email");

		app.sync.removeSyncer("online");

		chain(app.user.moveToLocalDatabase)
		.and(app.user.reloadFeeds)
		.and(app.sync.reloadSyncers)
		.end(callback);
	},
	
	receivedConnectRequest: function(evt) {
		var connectURL = evt.connectURL;
		this.doMerge = evt.doMerge;

		var clientId = app.user.preferences.get("client_id");

		var req = new Request({
			url: connectURL,
			onComplete: this.connectRequestComplete.andArguments(evt.tab)
		});
		
		req.send({
			get: {
				client_id: clientId
			}
		});
	},
	
	connectRequestComplete: function(status, text, xml, tab) {
		var resp = tryToParseJSON(text);
		if ( ! resp || resp.error || ! resp.token )
			return alert(resp.error || "Could not connect to Feeder account");
		this.unconnectOtherServices();
		this.receivedToken(resp.token, resp.email);
		this.syncFeeds(this.connectDone.withArguments(tab, resp.redirect));
	},

	connectDone: function(tab, redirect) {
		UI.tabChangeURL(tab, redirect)
		app.events.send("feeder:connected");
	},
	
	receivedToken: function(token, email) {
		app.user.preferences.set("feeder:token", token);
		app.user.preferences.set("feeder:email", email);
	},
	
	checkToken: function(callback) {
		var token = app.user.preferences.get("feeder:token");
		var clientId = app.user.preferences.get("client_id");
		
		if ( ! token )
			return fireCallback(callback, false);
		
		var req = new Request({
			url: app.config.feeder.checkURL,
			onComplete: this.checkedToken.withCallback(callback)
		});
		
		req.send({
			get: {
				token: token,
				client_id: clientId
			}
		});
	},
	
	checkedToken: function(status, responseText, responseXML, callback) {
		var response = tryToParseJSON(responseText);
		if ( response && response.is_pro ) {
			app.user.preferences.set("feeder:email", response.email);
			fireCallback(callback, true);
			return;
		} else if ( response && response.no_pro_for_token ) {
			app.user.preferences.remove("feeder:token");
			app.user.switchToLocalDatabase();
			console.log(response, "indicated invalid feeder pro account");
		}
		app.events.send("feeder:connected");
		fireCallback(callback, false);
	},
	
	syncFeeds: function(callback) {
		var opml = ExportImport.Export.exportFeeds();
		var importer = new ExportImport.Import(opml);

		var unreads = ExportImport.Export.exportUnreads();

		chain(ExportImport.Export.exportUnreads)
		.thenSync(function(unreadContainer) {
			app.sync.get("feeder").unreadContainer = unreadContainer;
		})
		.and(app.user.moveToAPIDatabase)
		.and(app.sync.addOnline)
		.and(app.user.hasFeeds() && this.doMerge ? importer.load : function(next) { next(true); })
		.thenSync(function(success) {
			if ( ! success )
				alert("There was a problem syncing your feeds");
		})
		.and(this.doMerge ? this.syncUnreads : function(next) { next(true); })
		.thenSync(function(success) {
			if ( ! success )
				alert("There was a problem syncing your feeds")
		})
		.and(app.user.forceCountUnread)
		.end(callback);
	},
	
	unconnectOtherServices: function() {
		app.sync.unconnectSyncer("google");
	},

	syncUnreads: function(callback) {
		var data = this.unreadContainer.toJSON();

		// Reroute request to API
		var request = new Request({
			method: 'POST',
			url: OnlineSyncer.path('/api/sync-posts-of-interest.json'),
			onComplete: this.syncUnreadsComplete.withCallback(callback),
			addFeederAuthorization: true
		});
		
		request.send({post: {feeds: data}});
	},

	syncUnreadsComplete: function(status, text, xml, callback) {
		callback(status == 200);
	},

	processFeed: function(feed, callback) { fireCallback(callback); },
	preferencesChanged: function(callback) { fireCallback(callback); },
	feedAdded: function(evt, callback) { fireCallback(callback); },
	feedUpdated: function(evt, callback) { fireCallback(callback); },
	feedRemoved: function(evt, callback) { fireCallback(callback); },
	postUpdated: function(evt, callback) { fireCallback(callback); },
	folderUpdated: function(evt, callback) { fireCallback(callback); },
	folderAdded: function(evt, callback) { fireCallback(callback); },
	folderRemoved: function(evt, callback) { fireCallback(callback); },
	fetchUpstream: function(callback) { fireCallback(callback); },
	
	pushUp: function(order, callback) { fireCallback(callback); },

	getEmail: function() {
		return app.user.preferences.get("feeder:email");
	},

	receivedFetchFeedsRequest: function(evt) {
		var container = app.user.structure.base.toContainer().toJSON();
		app.events.send("feeder:feedsFetched", {feeds: container});
	}
});

;
var OnlineSyncer = Syncer.extend({
	startListening: function() {
		this._super();
		app.events.subscribe('feed:backendUpdated', this.eventUpdateFeed);
	},
	
	destroy: function() {
		this._super();	
		app.events.unsubscribe('feed:backendUpdated', this.eventUpdateFeed);
	},
	
	eventUpdateFeed: function(evt) {
		var feed = app.user.feed(evt.feed);
		if ( ! feed )
			return feed;
		
		var previousApiLastUpdated = new Date(feed.previousApiLastUpdated);
		
		function isNewPost(post) {
			return post.created_at > previousApiLastUpdated;
		}
		
		feed.posts = false;
		feed.fetchPosts(function(posts) {
			var updated = feed.previousUnreadCount != app.user.countUnreadForFeed(feed.id);
			
			posts.forEach(function(post) {
				if (!isNewPost(post))
					return;
				updated = true;
				app.events.send("post:added", {post: post.id});
			});
			
			if (updated)
				app.events.send("feed:updated", {feed: feed.id});
		});
	},
	
	processFeed: function(feed, callback) {
		if (feed.type === "online")
			return fireCallback(callback, feed);
		
		// Reroute request to API
		var request = new Request({
			url: OnlineSyncer.path('/api/add-feed.json'),
			onComplete: this.addFeedComplete.andArguments(feed, callback),
			addFeederAuthorization: true
		});
		
		request.send({get: {path: feed.path}});
	},
	
	addFeedComplete: function(status, text, xml, feed, callback) {
		// Check if successful
		var response = tryToParseJSON(text);
		
		// Tell feed to not go any further in sync tree
		if ( ! response || ! response.success ) {
			feed.isError = true;
		} else {
			feed.guid = response.guid;
			feed.type = "online";
			feed.favicon = response.favicon;
		}
		
		// Done!
		fireCallback(callback);
	},
	
	preferencesChanged: function(callback) {
		var request = new Request({
			url: OnlineSyncer.path('/api/settings.json'),
			method: 'POST',
			addFeederAuthorization: true
		});
		request.send({post: {settings: this.settingsToJSON()}});
		
		fireCallback(callback);
	},
	
	settingsToJSON: function() {
		return JSON.stringify(app.user.preferences.getAll());
	},
	
	fetchUpstream: function(callback) {
		var request = new Request({
			url: OnlineSyncer.path('/api/settings.json'),
			onComplete: this.restorePreferencesFromAPI.withCallback(callback),
			addFeederAuthorization: true
		});
		
		request.send();
	},
	
	restorePreferencesFromAPI: function(status, text, xml, callback) {
		var settings = tryToParseJSON(text);

		if ( !settings ) {
			this.failedInit();
			return fireCallback(callback);
		}

		this.succeededInit();
		
		for (var key in settings) if (settings.hasOwnProperty(key))
			app.user.preferences.setQuiet(key, settings[key]);
		
		fireCallback(callback);
	},

	// Basic wrapper around API call
	countUnread: function(callback) {
		var request = new Request({
			url: OnlineSyncer.path('/api/unread.json'),
			onComplete: function(status, res) {
				var unreads = tryToParseJSON(res);
				for (var key in unreads) if (unreads.hasOwnProperty(key))
					unreads[key] = unreads[key].unread;
				callback(unreads);
			},
			addFeederAuthorization: true
		});
		
		request.send();
	},
	
	loadUnreadCounts: function(callback) {
		var request = new Request({
			url: OnlineSyncer.path('/api/unread.json'),
			onComplete: this.loadUnreadCountsLoaded.withCallback(callback),
			addFeederAuthorization: true
		});
		
		request.send();
	},
	
	loadUnreadCountsLoaded: function(status, text, xml, callback) {
		var counts = tryToParseJSON(text);

		chain(this.loadNewFeedsNotInCounts, counts)
		.end(callback, counts);
	},

	loadNewFeedsNotInCounts: function(counts, callback) {
		var needsUpdate = Object.keys(counts).length != app.store.feeds().length;

		for (var key in counts) if (counts.hasOwnProperty(key)) {
			if (!app.user.feed(key))
				needsUpdate = true;
		}

		if (needsUpdate)
			app.user.reload(callback);
		else
			fireCallback(callback);
	},

	clearAllUnread: function(feed, callback) {
		var request = new Request({
			method: 'POST',
			url: OnlineSyncer.path("/api/mark-as-read.json"),
			onComplete: function() {
				fireCallback(callback);
			},
			addFeederAuthorization: true
		});

		request.send({post: {feed_id: feed.id}});
	},

	clearAllUnreadEverywhere: function(feedId, callback) {
		var request = new Request({
			method: 'POST',
			url: OnlineSyncer.path("/api/mark-as-read.json"),
			onComplete: function() {
				fireCallback(callback);
			},
			addFeederAuthorization: true
		});

		request.send({post: {}});
	},
	
	feedAdded: function(evt, callback) { fireCallback(callback); },
	feedUpdated: function(evt, callback) { fireCallback(callback); },
	feedRemoved: function(evt, callback) { fireCallback(callback); },
	postUpdated: function(evt, callback) { fireCallback(callback); },
	folderUpdated: function(evt, callback) { fireCallback(callback); },
	folderAdded: function(evt, callback) { fireCallback(callback); },
	folderRemoved: function(evt, callback) { fireCallback(callback); },
	
	pushUp: function(order, callback) { fireCallback(callback); },
	uninstall: function(callback) { callback(); }
});

OnlineSyncer.path = function(path) {
	return Config.feeder.root + path;
};
;
var RSSParser = FeedParser.extend({
	initialize: function(feed) {
		this._super(feed);
		
		this.root = false;
	},
	
	setResult: function(xml, text, callback) {
		text = text.trimChars();
		
		// no xml-header? attempt to parse it on our own
		if ( ! xml )
			xml = new DOMParser().parseFromString(text, 'text/xml');
		
		var root = xml.documentElement;
		
		// If parsing as XML failed, try and parse as HTML, because HTML is so lovely
		if ( ! root || root.querySelector('parsererror') ) {
			// Try to parse as HTML instead
			// TODO: FIXME: Strip <script>-tags and <img>-tags
			var placeholder = document.createElement('parse-xml');
			placeholder.innerHTML = text;
			root = placeholder.firstElementChild;
			
			if ( ! root ) {
				this.error = true;
				fireCallback(callback);
				return;
			}
		}
		
		this.root = root;
		fireCallback(callback);
	},
	
	parse: function(callback) {
		this.currentCallback = callback;
		
		var root = this.root;
		
		if ( this.error ) {
			rssLog("error on first");
			this.currentCallback(this);
			return;
		}
		
		// Test for RSS
		var type = false;
		if ( root.tagName.toLowerCase() == 'rss' ) 
			type = 'rss';
		else if ( root.tagName.toLowerCase() == 'feed' )
			type = 'atom';
		else if ( root.tagName.toLowerCase() == 'rdf' || root.tagName.toLowerCase() == 'rdf:rdf' )
			type = 'rss';
		
		if ( ! type ) {
			console.log("not compatible", this.path, root.tagName, root);
			this.error = true;
			this.currentCallback(this);
			return;
		}
		
		rssLog("parsing %s", type);
		rssLog("error: %s", this.error);
		
//		try {
			switch ( type ) {
				case 'rss':
					this.parseRSSResponse(root);
					break;
			
				case 'atom':
					this.parseAtomResponse(root);
					break;
			}
			
			this.currentCallback(this);
//		} catch (e) {
//			rssLog("exceptioned");
//			this.error = true;
//			this.currentCallback(this);
//		}
	},

	parseRSSResponse: function(root) {
		// Get link, use this contraption because some feeds mix atom:link to be compatible with atom
		// Or something weird
		var link, links = root.querySelectorAll('channel > link');
		for ( var i = 0, l; l = links[i]; i++ ) {
			if ( ! l.tagName.contains('atom') ) {
				link = l.textContent.cleanData();
				break;
			// Fix for weird "atom10" format, see: feedsfeedburnercomimgurgallery?format=xml
			} else if ( l.tagName.contains('atom10') ) {
				link = l.getAttribute('href');
				break;
			}
		}
		
		this.data.link = link;
		this.path = link;
		
		if ( link )
			this.data.favicon = Config.defaultFavicon(this.getDomain(this.data.link));
		else
			this.data.favicon = Config.defaultFavicon();
		
		var titleEl = root.querySelector('title');
		this.data.title = ((titleEl ? titleEl.textContent.cleanData() : this.link) || '').trimChars();
		
		var posts = root.querySelectorAll('item');
		for ( var i = 0, post; (post = posts[i]) && i < Config.maxPostsPerFeedFile; i++ ) {
			var titleElement = post.querySelector('title');
			var linkElement = post.querySelector('link');
			var guidElement = post.querySelector('guid');
			
			if ( ! titleElement )
				continue;
			
			// Fulhax for piratebay feeds. If the link element is empty something went wrong during parseing
			// The link element is empty, but the next text node is the actual link
			if ( linkElement && (! linkElement.childNodes || linkElement.childNodes.length == 0) && (linkElement.nextSibling && linkElement.nextSibling.tagName && linkElement.nextSibling.tagName.contains("LINK")) ) {
				linkElement = linkElement.nextSibling;
			}
			// End fulhax
			
			// Fulhax for itunes feeds
			var enclosureElement = post.querySelector('enclosure');
			var podcastURL = enclosureElement ? enclosureElement.getAttribute('url') : false;
			var fallbackElement = podcastURL ? podcastURL : false;
			// end fulhax
			
			var link;
			if ( linkElement )
				if ( linkElement.getAttribute('href') )
					link = linkElement.getAttribute('href');
				else
					link = linkElement.textContent.cleanData();
			else
				link = fallbackElement;
			
			if ( ! link )
				continue;
			
			var descriptionElement = post.getElementsByTagName('description')[0] || post.getElementsByTagName('content')[0];
			var summary = '';
			var images = [];
			if ( descriptionElement && descriptionElement.textContent ) {
				var res = this.parseDescription(descriptionElement.textContent.cleanData());
				images = res.images;
				summary = res.summary;
			}
			
			this.foundPost({
				title: titleElement ? titleElement.textContent.cleanData() : 'no title',
				link: link,
				published: this.getDate(post),
				guid: guidElement ? guidElement.textContent.cleanData() : '',
				summary: summary,
				images: images
			});
		}
	},

	parseAtomResponse: function(root) {
		var titleEl = root.querySelector('title');
		
		this.data.link = this.parseLink(root);
		this.data.title = (titleEl ? titleEl.textContent.cleanData() : (this.data.link || '')).trimChars();
		this.data.favicon = app.config.defaultFavicon(this.getDomain(this.data.link));
		
		this.path = this.data.link;
		
		var posts = root.querySelectorAll('entry');
		for ( var i = 0, post; (post = posts[i]) && i < Config.maxPostsPerFeedFile; i++ ) {
			var titleElement = post.querySelector('title');
			var linkElement = (post.querySelector('link[rel=alternate]') || post.querySelector('link'));
			var guidElement = post.querySelector('guid');
			
			if ( ! titleElement || ! linkElement )
				continue;
			
			var link = linkElement ? RSSParser.resolveFrom(linkElement, linkElement.getAttribute('href')) : 'http://google.com/search?q=Error1';
						
			var descriptionElement = post.getElementsByTagName('description')[0] || post.getElementsByTagName('content')[0];
			var summary = '';
			var images = [];
			if ( descriptionElement && descriptionElement.textContent ) {
				var res = this.parseDescription(descriptionElement.textContent.cleanData());
				images = res.images;
				summary = res.summary;
			}

			this.foundPost({
				title: titleElement ? titleElement.textContent.cleanData() : 'no title',
				link: link,
				published: this.getDate(post),
				guid: guidElement ? guidElement.textContent.cleanData() : ''
			});
		}
	},
	
	parseLink: function(root) {
		var links = Array.prototype.slice.call(root.querySelectorAll('link'), 0);
		
		// Find link
		links = links.filter(function(l) {
			return ! RSSParser.closest(l, 'entry');
		});
		
		// Sort after which one is most relevant
		// empty rel is a good thing, otherwise what should it be?
		links = links.sort(function(a, b) {
			return !a.getAttribute('rel') ? -1 : 1;
		});
		
		if ( ! links.length )
			return "";
		
		return RSSParser.resolveFrom(links[0], links[0].getAttribute('href'));
	},
	
	getDate: function(post) {
		var datePublished = post.querySelector('published') ||
			post.querySelector('updated') ||
			post.querySelector('pubDate') ||
			post.querySelector('date');
		var d = datePublished ? (new Date(datePublished.textContent.cleanData())).getTime() : Date.now();
		return d || Date.now();
	},
	
	foundPost: function(data) {
		if ( ! data.title || ! data.link )
			return;
		
		data.title = data.title.trimChars();
		data.link = data.link.trimChars();
		data.summary = this.useSummary ? data.summary : '';
		
		// If not http or https is present, or some other weird protocol, just assume it's relative
		if ( ! data.link.match(/^(http|https):/) && ! data.link.match(/^[a-zA-Z0-9-]+:/) ) {
			var domain = this.getDomain(this.path);
			data.link = domain.trimChars('/') + data.link;
		}
		
		this.posts.push(data);
	},
	
	getDomain: function(link) {
		if ( ! link )
			return "";
		return link.substr(0, (link.indexOf("/", link.indexOf('.')) + 1) || link.length).trimChars('/') + '/';
	},
	
	parseDescription: function(desc) {
		var matches = desc.match(/<img[^>]*(src="[^"]+")|(src='[^']+')/g);
		if ( ! matches ) {
			return {summary: desc, images: []};
		}
		var urls = matches.map(function(res) {
			return res.split(/src='|"/)[1];
		});
		return {summary: desc, images: urls};
	}
});

RSSParser.closest = function(el, selector) {
	do {
		if ( el.webkitMatchesSelector(selector) )
			return el;
	} while ( (el = el.parentNode) && el.webkitMatchesSelector );
	return false;
}

RSSParser.resolveFrom = function(ref, url) {
	var bases = [];
	var el = ref;
	while ( el && el.getAttribute ) {
		if ( el.getAttribute("xml:base") )
			bases.push(el.getAttribute("xml:base"))
		el = el.parentNode;
	}
	
	if (! bases.length)
		return url;
	
	return TRYIT(function() {
		return new URI(url, bases.reduce(function(a, b) {
			return new URI(a, b).toString();
		})).toString();
	}, this);
};

function rssLog() {
	return;
	console.log.apply(console, arguments);
}
;
var RSSLoader = FeedLoader.extend({
	
});

;
var GoogleParser = FeedParser.extend({
	initialize: function() {
		this._super.apply(this, arguments);
	},
	
	setResult: function(res, callback) {
		this.result = res;
		if ( ! this.result )
			this.error = true;
		
		fireCallback(callback);
	},
	
	parse: function(callback) {
		if ( this.error )
			return fireCallback(callback, this);
		
		this.data.title = this.result.title.stripHTMLEntities();
		this.data.link = this.findLinkFromAlternate(this.result.alternate);
		this.data.favicon = app.config.defaultFavicon(this.data.link);
		this.findPosts();
		
		fireCallback(callback, this);
	},
	
	findPosts: function() {
		this.result.items.forEach(this.parsePost);
	},
	
	parsePost: function(item) {
		this.posts.push({
			title: (item.title || "").stripHTMLEntities(),
			link: this.findLinkFromAlternate(item.alternate),
			summary: (item.summary ? item.summary.content : '').stripHTMLEntities(),
			guid: item.id,
			published: item.published*1000,
			is_read: +(Google.hasTag("read", item)), // FIXME: TODO: how does this work? && ! Google.hasTag("unread", item)),
			is_starred: +(Google.hasTag("starred", item))
		});
	},
	
	findLinkFromAlternate: function(alternate) {
		if ( ! alternate )
			return false;
		
		for ( var i = 0, alt; alt = alternate[i]; i++ )
			if ( alt.type.contains("html") )
				return alt.href;
		
		return false;
	}
});
;
var GoogleLoader = FeedLoader.extend({
	load: function(callback) {
		this.request = new Google.Request({
			url: this.pathToLoad(),
			onComplete: this.loadComplete.withCallback(callback),
			onError: function() {
				callback('', '');
			},
			timeout: 30000
		});
		
		this.request.start();
	},
	
	pathToLoad: function() {
		return Google.feedLoadPath(this.feed.guid);
	},
	
	loadComplete: function(response, status, req, callback) {
		callback(response);
	}
});

;
var OnlineParser = FeedParser.extend({
	setResult: function(res, callback) {
		this.result = res;
		if ( ! this.result )
			this.error = true;
		
		fireCallback(callback);
	},
	
	parse: function(callback) {
		if ( this.error )
			return fireCallback(callback, this);
		
		this.data.title = this.result.title;
		this.data.link = this.result.link;
		this.data.favicon = this.result.favicon;
		this.findPosts();
		
		fireCallback(callback, this);
	},
	
	findPosts: function() {
		this.result.posts.forEach(this.parsePost);
	},
	
	parsePost: function(item) {
		this.posts.push({
			title: item.title,
			link: item.link,
			summary: item.summary || '',
			guid: item.guid,
			published: item.published
		});
	}
});

;
var OnlineLoader = FeedLoader.extend({
	load: function(callback) {
		var request = new Request({
			url: Config.feeder.root + '/api/feeds/' + this.feed.guid + '.json',
			onComplete: this.loadComplete.withCallback(callback)
		});
		
		request.send();
	},
	
	loadComplete: function(status, text, xml, callback) {
		callback(tryToParseJSON(text));
	}
});
;
var AppUI = Class.extend({
	initialize: function() {
	
	},
	
	startListening: function() {
		app.events.subscribe("post:updated", this.postUpdated);
		app.events.subscribe("post:added", this.postAdded);
		app.events.subscribe("feed:updated", this.feedUpdated);
		app.events.subscribe("feed:removed", this.feedRemoved);
		app.events.subscribe("feeds:found", this.feedsFound);
		app.events.subscribe("feeds:recount", this.setBadge);
		app.events.subscribe("preferences:changed", this.preferencesChanged);
	},
	
	destroy: function(callback) {
		app.events.unsubscribe("post:updated", this.postUpdated);
		app.events.unsubscribe("post:added", this.postAdded);
		app.events.unsubscribe("feed:updated", this.feedUpdated);
		app.events.unsubscribe("feed:removed", this.feedRemoved);
		app.events.unsubscribe("feeds:found", this.feedsFound);
		app.events.unsubscribe("feeds:recount", this.setBadge);
		app.events.unsubscribe("preferences:changed", this.preferencesChanged);
		
		fireCallback(callback);
	},
	
	postUpdated: function(evt) {
		this.setBadge();
	},
	
	postAdded: function(evt) {
		this.setBadge();
		
		var post = app.store.post(evt.post);
		var feed = app.store.feed(post.feed_id);
		
		if ( post && feed && ! post.is_read && (app.user.preferences.get('global:notifications') || feed.usenotifications) && UI.Notifications.can() ) {
			UI.Notifications.show(feed.title, post.title, {
				link: function() {
					post.markAsRead();
					UI.openTab(post.getLink());
				}
			});
		}
	},
	
	feedUpdated: function(evt) {
		this.setBadge();
	},
	
	feedRemoved: function(evt) {
		this.setBadge();
	},
	
	setBadge: function() {
		if (Ext.isOnline())
			return;

		if (app.user.preferences.get("global:showUnreadCountInBadge") == false) {
			UI.setBadge("");
			return;
		}

		var unread = app.user.countStoredUnreads();
		unread = unread > 999 ? "999+" : unread;
		UI.setBadge(unread || "");
	},
	
	feedsFound: function(evt) {
		app.finder.countFeedsInTab(evt.tab, function(num) {
			if ( num )
				UI.setBadgeIcon(Config.icon.addFeed, evt.tab);
			else
				UI.setBadgeIcon(Config.icon.standard, evt.tab);
		});
	},

	preferencesChanged: function(evt) {
		if (evt.key !== "global:showUnreadCountInBadge")
			return;

		this.setBadge();
	},
	
	openManyById: function(posts) {
		posts = posts.map(function(id) {
			return app.store.post(id);
		});
		
		this.openMany(posts);
	},
	
	openMany: function(posts) {
		posts.forEach(function(post) {
			post.markAsRead();
		});
		
		posts.forEach(function(post) {
			UI.openTab(post.getLink());
		});
	}
});

;
var FeederNotifications = Class.extend({
	initialize: function() {
		setInterval(this.check, Config.feederNotificationCheckInterval);
	},

	check: function(callback) {
		if (Ext.isOnline())
			return fireCallback(callback);

		var request = new Request({
			url: Config.feederNotificationsURL,
			onComplete: this.loaded.withCallback(callback)
		});

		request.send({get: {id: app.user.preferences.get("client_id"), _random: Date.now()}});
	},

	loaded: function(status, res, xml, callback) {
		var emptyFeed = new Feed();
		var parser = new RSSParser(emptyFeed);
		parser.useSummary = true;

		chain(parser.setResult, xml, res)
		.and(parser.parse)
		.end(this.parsed, parser, callback);
	},

	parsed: function(parser, callback) {
		var posts = parser.getPosts();

		if (! posts[0])
			this.current = false;
		else {
			this.current = this.encodeText(posts[0].summary);
			this.currentId = posts[0].guid;
		}

		if (app.user.preferences.get("notifications:hide") == this.currentId) {
			this.current = false;
		}

		fireCallback(callback);
	},

	encodeText: function(text) {
		return text.replace ? text.replace(/feeder pro/, 'feeder <span class="pro-badge">pro</span>') : text;
	},

	hideCurrent: function() {
		if (this.currentId) {
			this.current = false;
			app.user.preferences.set("notifications:hide", this.currentId);
		}
	}
});
;
var ExportImport = {
	fs: false,
	
	Export: new (Class.extend({
		initialize: function() {
			
		},
		
		downloadFile: function() {
			var feedOPMLText = this.exportFeeds();
			ExportImport.writeFileQuick(feedOPMLText);
		},
		
		exportFeeds: function() {
			return '<?xml version="1.0" encoding="UTF-8"?>'
				+ json2xml({
					'opml': {
						'@version': '1.0',
						'head': {'title': 'Feeder - RSS Feed Reader'},
						'body': {
							'outline': this.toOutlines(app.user.structure.base)
						}
					}
				});
		},
		
		toOutlines: function(folder) {
			var lastOutlines = this.outlines;
			this.outlines = [];
			
			// folder.name == Folder name
			// folder.children == The folders
			// folder.feeds == The order and feeds of a folder
			
			folder.forEachItem(this.toOutlineFromItem);
			
			var outlines = this.outlines;
			this.outlines = lastOutlines;
			
			return outlines;
		},
		
		toOutlineFromItem: function(item, index) {
			var outline = item.isFeed ? this.toOutlineFromFeed(item) : this.toOutlineFromFolder(item);
			if ( ! outline )
				return;
			this.outlines.push(outline);
		},
		
		toOutlineFromFeed: function(feed) {
			if ( ! feed )
				return null;
			
			return {
				'@text': feed.title.encodeHTML(),
				'@title': feed.title.encodeHTML(),
				'@type': 'rss',
				'@xmlUrl': feed.path.encodeHTML(),
				'@htmlUrl': (feed.link || "").encodeHTML(),
				'@rssfr-numPosts': feed.numPosts,
				'@rssfr-forceUpdate': feed.forceUpdate,
				'@rssfr-favicon': (feed.favicon || "").encodeHTML(),
				'@rssfr-useNotifications': feed.useNotifications,
				'@rssfr-updateInterval': feed.updateInterval,
			};
		},
		
		toOutlineFromFolder: function(folder) {	
			return {
				'@title': folder.name.encodeHTML(),
				'@text': folder.name.encodeHTML(),
				'outline': this.toOutlines(folder)
			};
		},

		exportUnreads: function(callback) {
			var container = new FeedUnreadContainer();
			var link = chain();

			app.user.forEachFeed(function(feed) {
				link.and(feed.getPostsOfInterest)
				link.thenSync(function(posts) {
					posts.forEach(function(post) {
						container.addPostFor(feed, post);
					});
				});
			});

			link.end(callback, container);
		}
	})),
	
	Import: Class.extend({
		initialize: function(data) {
			this.data = data;
		},
		
		load: function(callback) {
			this.feedContainer = app.user.createFeedContainer();
			
			if ( ! this.tryLoadOPML() )
				this.tryLoadOldJSON();
			
			if ( this.isError )
				return callback(false);
			
			chain(app.sync.mergeContainer, this.feedContainer)
			.then(function(res, next) {
				if ( ! res ) {
					callback(false);
					return chain.exit;
				}
				next();
			})
			.and(app.sync.push)
			.end(callback, true)
		},
		
		tryLoadOPML: function() {
			var doc = (new DOMParser()).parseFromString(this.data, 'text/xml');
			
			if ( ! doc ) {
				this.isError = true;
				return false;
			}
			
			var data = xml2json(doc);
			this._data = data;
			
			if ( ! data || ! data.body || ! data.body.outline ) {
				this.isError = true;
				return false;
			}
			
			this.convertOPML(data);
			
			return true;
		},
		
		tryLoadOldJSON: function() {
			var data;
			try {
				data = JSON.parse(this.data);
			}
			catch (e) {}
			
			if ( ! data || ! data.feeds || ! data.folders || ! data.folders[0] )
				return false;

			this.feedMap = data.feeds;
			
			this.parseOldFolder(data.folders[0]);
			this.isError = false;
			
			return true;
		},
		
		convertOPML: function(data) {
			this.outlineToFolder({'@title': 'Feeds', outline: data.body.outline});
		},
		
		outlineToFolder: function(outlineFolder) {
			var folder = this.feedContainer.pushFolder(outlineFolder['@title'] || outlineFolder['@text']);
			
			if ( ! outlineFolder.outline ) {
				this.feedContainer.popFolder();
				return 
			}
			
			var items = ensureArray(outlineFolder.outline).map(this.outlineToItem);
			items.clean();
			
			this.feedContainer.popFolder();
			
			return folder;
		},
		
		outlineToItem: function(outline) {
			if ( outline['@xmlurl'] )
				return this.outlineToFeed(outline);
			else if ( outline['@title'] || outline['@text'] )
				return this.outlineToFolder(outline);
			return false;
		},
		
		outlineToFeed: function(outline) {
			return this.feedContainer.addFeed({
				path: outline['@xmlurl'],
				guid: outline['@xmlurl'],
				link: outline['@htmlurl'],
				title: outline['@title'] || outline['@text'] || outline['@htmlurl'] || outline['@xmlurl'],
				favicon: outline['@rssfr-favicon'],
				numPosts: outline['@rssfr-numposts'],
				forceUpdate: outline['@rssfr-forceupdate'],
				useNotifications: outline['@rssfr-usenotifications']
			});
		},
		
		parseOldFolder: function(folder) {
			this.feedContainer.pushFolder(folder.name);
			
			folder.feeds.forEach(function(item) {
				this.parseItem(item, folder);
			}, this);
			
			this.feedContainer.popFolder();
		},
		
		parseItem: function(item, folder) {
			if ( typeof item === 'number' )
				this.parseFolder(item, folder);
			else
				this.parseFeed(item, folder);
		},
		
		parseFeed: function(feedUrl) {
			var feedData = this.feedMap[feedUrl];
			
			if ( ! feedData )
				feedData = {};
			
			feedData.path = feedUrl;
			feedData.guid = feedUrl;
			
			this.feedContainer.addFeed(feedData)
		},
		
		parseFolder: function(folderId, parentFolder) {
			var folder = parentFolder.children[folderId];
			if ( ! folder )
				return;
			
			this.parseOldFolder(folder);
		}
	}),
	
	writeFileQuick: function(contents) {
		var form = document.createElement("form");
		form.action = "http://feeder.co/opml/";
		form.method = "POST";
		form.target = "_blank";
		
		var text = document.createElement("input");
		text.type = "hidden";
		text.name = "opml";
		text.value = contents;

		var explanation = document.createElement("input");
		explanation.name = "explanation";
		explanation.value = "Why are sending your OPML data to our servers? This is because there is no good way for us to create files and have them downloaded to the users computer. Nothing about this request is stored or looked at. If you disagree with this, please: feeder.co/support";
		explanation.type = "hidden";
		
		form.appendChild(text);
		form.appendChild(explanation);
		
		if (Ext.isSafari()) {
			Platform.env.safariSubmitFormFromPopup(form);
			return;
		}
		
		document.body.appendChild(form);
		
		form.submit();
		
		setTimeout(function() { form.parentNode.removeChild(form); }, 500);
	}
};

function ensureArray(thing) {
	return thing instanceof Array ? thing : [thing];
}

;
UI = UI[Platform.name];
Platform.env = new PlatformEnv[Platform.name];

UI.initialize();
;
var Application = Class.extend({
	initialize: function() {
		this.id = Application.counterID++;
		this.retryTimes = 0;

		this.store = new CacheStore(this);
	},
	
	destroy: function(callback) {
		this.isDestroyed = true;
		
		chain(this.poller.destroy)
		.and(this.updater.destroy)
		.and(this.finder.destroy)
		.and(this.ui.destroy)
		.and(this.sync.destroy)
		.and(this.user.destroy)
		.and(this.events.destroy)
		.and(function() {
			callback();
		});
	},
	
	'get ready to rumble!': function(callback) {
		this.config = Config;
		
		this.user = new User(this); // The "user"
		
		this.events   = new FeedEvents(this);  // Push out updates when new feeds are available
		this.poller   = new FeedPoller(this);  // Keep track of when feeds need to be updated
		this.updater  = new FeedUpdater(this); // Load and parse RSS feeds
		this.finder   = new FeedFinder(this);  // Listen for RSS feeds
		this.sync     = new FeedSync(this);    // Sync everything with external services, like Google Reader
		this.notifications = new FeederNotifications(); // Search a special "feed" for notifications

		this.ui      = new AppUI(this); // Take care of platform specific UI settings that can only be set from the background
		
		var importer = new Importer(this);
		chain(this.user.install)
		.and(importer.install)
		.and(importer.migrateDB)
		.and(importer.importOldFolders)
		.and(this.user.fixOrphanFeeds)
		.and(this.ready)
		.then(callback);
	},
	
	ready: function(callback) {
		var application = this;
		
		chain(this.sync.startSyncing)
		.and(this.sync.fetchUpstream)
		.and(function() {
			app.user.countUnread(function() {});

			if (! app.isFailedState()) {
				app.startListeners();
			} else {
				setTimeout(app.retryInitialize, Config.retryInitializeTimeout)
			}

			application.ui.setBadge();
			application.loaded();

			window.backendIsLoaded = true;
			backendLoadComplete();
			
			callback(application);
		});
	},
	
	onLoad: function(callback) {
		if ( this.isLoaded )
			return fireCallback(callback);
		this.onLoadCallback = callback;
	},
	
	loaded: function() {
		this.isLoaded = true;
		fireCallback(this.onLoadCallback);
	},

	startListeners: function() {
		this.updater.startListening();
		this.poller.startPolling();
		this.finder.startListening();
		this.ui.startListening();
		this.notifications.check();
	},

	isFailedState: function() {
		return app.sync.isFailedState();
	},

	// Retry can either:
	//  - fail, in which case we say so
	//  - work, in which case we say so
	retryInitialize: function(callback) {
		console.log("Asked to retry (%s time)", this.retryTimes);
		
		// Only retry 2 times
		//  1. Upon backend load, we wait X seconds, and retry
		//  2. After popup is loaded first time, and we realize the backend is broken
		if (app.retryTimes >= 2)
			return fireCallback(callback, false);
		
		console.log("... Retrying");

		app.retryTimes++;

		chain(app.sync.fetchUpstream)
		.then(function() {
			if (app.isFailedState())
				return fireCallback(callback, false);

			app.startListeners();
			chain(app.user.reload)
			.end(callback, true);
		});
	}
});

Application.counterID = 0;

var isBackground = true;

// ✔
;
// Traverse the parents and find a background page
var bg = Ext.getBackgroundPage();
var run = bg === window;

var backendListeners, backendIsLoaded, onAppReady;
var isMainJs = true

if (run) {
	backendIsLoaded = false;
	backendListeners = [];

	onAppReady = function(fn, loadingCallback) {
		if (backendIsLoaded) {
			return fn();
		}
		backendListeners.push(fn);
		fireCallback(loadingCallback);
	}

	function backendLoadComplete() {
		backendListeners.forEach(function(callback) {
			callback();
		});
		backendListeners = [];
	}

	if ( ! window.standalone ) {
		document.addEventListener('DOMContentLoaded', function() {
			
			window.app = new Application();
			
			chain(Platform.load)
			.and(app['get ready to rumble!'])
			.end(function() {
				// Done init
			})
			
		});
	}
}
