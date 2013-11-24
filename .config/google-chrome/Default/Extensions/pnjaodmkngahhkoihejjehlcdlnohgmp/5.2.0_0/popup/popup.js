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
/*!
 * jQuery JavaScript Library v2.0.0b1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-1-14
 */
(function( window, undefined ) {
"use strict";
var
	// A central reference to the root jQuery(document)
	rootjQuery,

	// The deferred used on DOM ready
	readyList,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "2.0.0b1",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler and self cleanup method
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Support: Firefox >16
		// The try/catch supresses exceptions thrown when attempting to access
		// the "constructor" property of certain host objects, ie. |window.location|
		try {
			if ( obj.constructor &&
					!core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );

		if ( scripts ) {
			jQuery( scripts ).remove();
		}

		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: JSON.parse,

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}

		// Support: IE9
		try {
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		} catch ( e ) {
			xml = undefined;
		}

		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	globalEval: function( data ) {
		var indirect = eval;
		if ( jQuery.trim( data ) ) {
			indirect( data + ";" );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	trim: function( text ) {
		return text == null ? "" : core_trim.call( text );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : core_indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: Date.now
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				return jQuery.inArray( fn, list ) > -1;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support, a, select, opt, input, fragment,
		div = document.createElement("div");

	div.innerHTML = "<a>a</a><input type='checkbox'/>";

	// Support tests won't run in some limited or non-browser environments
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a ) {
		return {};
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "float:left;opacity:.5";
	support = {
		// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
		checkOn: !!input.value,

		// Must access the parent to make an option select properly
		// Support: IE9, IE10
		optSelected: opt.selected,

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: document.compatMode === "CSS1Compat",

		// Will be defined later
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Check if an input maintains its value after becoming a radio
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: Firefox 17+
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP), test/csp.php
	div.setAttribute( "onfocusin", "t" );
	support.focusinBubbles = "onfocusin" in window || div.attributes.onfocusin.expando === false;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		// Check box-sizing and margin behavior
		body.appendChild( container ).appendChild( div );
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	select = fragment = opt = a = input = null;

	return support;
})();

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;
	
function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, ret,
		internalKey = jQuery.expando,
		getByName = typeof name === "string",

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			elem[ internalKey ] = id = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		cache[ id ] = {};

		// Avoids exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		if ( !isNode ) {
			cache[ id ].toJSON = jQuery.noop;
		}
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( getByName ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt /* For internal use only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i, l,

		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			for ( i = 0, l = name.length; i < l; i++ ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data, false );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name, false );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},
	
	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				// Try to fetch any internally stored data first
				return elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
			}

			this.each(function() {
				jQuery.data( this, key, value );
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				// Only convert to a number if it doesn't change the string
				+data + "" === data ? +data :
				rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		hooks.cur = fn;
		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			// Toggle whole class name
			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && notxml && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && notxml && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			// In IE9+, Flash objects don't have .getAttribute (#12945)
			// Support: IE9+
			if ( typeof elem.getAttribute !== "undefined" ) {
				ret =  elem.getAttribute( name );
			}

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				// Set corresponding property to false for boolean attributes
				if ( rboolean.test( name ) ) {
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		return elem.getAttribute( name ) !== null ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});

// IE9/10 do not see a selected option inside an optgroup unless you access it
// Support: IE9, IE10
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	});
}
var rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			// Don't attach events to noData or text/comment nodes (but allow plain objects)
			elemData = elem.nodeType !== 3 && elem.nodeType !== 8 && jQuery._data( elem );

		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = event.type || event,
			namespaces = event.namespace ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		event.isTrigger = true;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur != this; cur = cur.parentNode || this ) {

				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			}
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== document.activeElement && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === document.activeElement && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 10+
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && e.preventDefault ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && e.stopPropagation ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// Create "bubbling" focus and blur events
// Support: Firefox 10+
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var i,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	hasDuplicate,
	outermostContext,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsXML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,
	sortOrder,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	support = {},
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Array methods
	arr = [],
	pop = arr.pop,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},


	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	operators = "([*^$|!~]?=)",
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rsibling = /[\x20\t\r\n\f]*[+~]/,

	rnative = /\{\s*\[native code\]\s*\}/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,
	rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
	funescape = function( _, escaped ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		return high !== high ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Use a stripped-down slice if we can't use a native one
try {
	slice.call( docElem.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem,
			results = [];
		for ( ; (elem = this[i]); i++ ) {
			results.push( elem );
		}
		return results;
	};
}

/**
 * For feature detection
 * @param {Function} fn The function to test for native support
 */
function isNative( fn ) {
	return rnative.test( fn + "" );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var cache,
		keys = [];

	return (cache = function( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	});
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return fn( div );
	} catch (e) {
		return false;
	} finally {
		// release memory in IE
		div = null;
	}
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( !documentIsXML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getByClassName && context.getElementsByClassName ) {
				push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && !rbuggyQSA.test(selector) ) {
			old = true;
			nid = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results, slice.call( newContext.querySelectorAll(
						newSelector
					), 0 ) );
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsXML = isXML( doc );

	// Check if getElementsByTagName("*") returns only elements
	support.tagNameNoComments = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if attributes should be retrieved by attribute nodes
	support.attributes = assert(function( div ) {
		div.innerHTML = "<select></select>";
		var type = typeof div.lastChild.getAttribute("multiple");
		// IE8 returns a string for some attributes even when not present
		return type !== "boolean" && type !== "string";
	});

	// Check if getElementsByClassName can be trusted
	support.getByClassName = assert(function( div ) {
		// Opera can't find a second classname (in 9.6)
		div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
		if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
			return false;
		}

		// Safari 3.2 caches class attributes and doesn't catch changes
		div.lastChild.className = "e";
		return div.getElementsByClassName("e").length === 2;
	});

	// Check if getElementById returns elements by name
	// Check if getElementsByName privileges form controls or returns elements by ID
	support.getByName = assert(function( div ) {
		// Inject content
		div.id = expando + 0;
		div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
		docElem.insertBefore( div, docElem.firstChild );

		// Test
		var pass = doc.getElementsByName &&
			// buggy browsers will return fewer than the correct 2
			doc.getElementsByName( expando ).length === 2 +
			// buggy browsers will return more than the correct 0
			doc.getElementsByName( expando + 0 ).length;
		support.getIdNotName = !doc.getElementById( expando );

		// Cleanup
		docElem.removeChild( div );

		return pass;
	});

	// IE6/7 return modified attributes
	Expr.attrHandle = assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
			div.firstChild.getAttribute("href") === "#";
	}) ?
		{} :
		{
			"href": function( elem ) {
				return elem.getAttribute( "href", 2 );
			},
			"type": function( elem ) {
				return elem.getAttribute("type");
			}
		};

	// ID find and filter
	if ( support.getIdNotName ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );

				return m ?
					m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
						[m] :
						undefined :
					[];
			}
		};
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.tagNameNoComments ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				for ( ; (elem = results[i]); i++ ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Name
	Expr.find["NAME"] = support.getByName && function( tag, context ) {
		if ( typeof context.getElementsByName !== strundefined ) {
			return context.getElementsByName( name );
		}
	};

	// Class
	Expr.find["CLASS"] = support.getByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && !documentIsXML ) {
			return context.getElementsByClassName( className );
		}
	};

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21),
	// no need to also add to buggyMatches since matches checks buggyQSA
	// A support test would require too much code (would include document ready)
	rbuggyQSA = [ ":focus" ];

	if ( (support.qsa = isNative(doc.querySelectorAll)) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explictly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// IE8 - Some boolean attributes are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Opera 10-12/IE8 - ^= $= *= and empty values
			// Should not select anything
			div.innerHTML = "<input type='hidden' i=''/>";
			if ( div.querySelectorAll("[i^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = isNative( (matches = docElem.matchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.webkitMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = new RegExp( rbuggyMatches.join("|") );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = isNative(docElem.contains) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {
		var compare;

		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b )) ) {
			if ( compare & 1 || a.parentNode && a.parentNode.nodeType === 11 ) {
				if ( a === doc || contains( preferredDoc, a ) ) {
					return -1;
				}
				if ( b === doc || contains( preferredDoc, b ) ) {
					return 1;
				}
				return 0;
			}
			return compare & 4 ? -1 : 1;
		}

		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return ( ~b.sourceIndex || MAX_NEGATIVE ) - ( contains( preferredDoc, a ) && ~a.sourceIndex || MAX_NEGATIVE );

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	// Always assume the presence of duplicates if sort doesn't
	// pass them to our comparison function (as in Google Chrome).
	hasDuplicate = false;
	[0, 0].sort( sortOrder );
	support.detectDuplicates = hasDuplicate;

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	// rbuggyQSA always contains :focus, so no need for an existence check
	if ( support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr) ) {
		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	var val;

	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	if ( !documentIsXML ) {
		name = name.toLowerCase();
	}
	if ( (val = Expr.attrHandle[ name ]) ) {
		return val( elem );
	}
	if ( documentIsXML || support.attributes ) {
		return elem.getAttribute( name );
	}
	return ( (val = elem.getAttributeNode( name )) || elem.getAttribute( name ) ) && elem[ name ] === true ?
		name :
		val && val.specified ? val.value : null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		i = 1,
		j = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		for ( ; (elem = results[i]); i++ ) {
			if ( elem === results[ i - 1 ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

function siblingCheck( a, b ) {
	var cur = a && b && a.nextSibling;

	for ( ; cur; cur = cur.nextSibling ) {
		if ( cur === b ) {
			return -1;
		}
	}

	return a ? 1 : -1;
}

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[4] ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeName ) {
			if ( nodeName === "*" ) {
				return function() { return true; };
			}

			nodeName = nodeName.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
			};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.substr( result.length - check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.substr( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifider
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsXML ?
						elem.getAttribute("xml:lang") || elem.getAttribute("lang") :
						elem.lang) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && combinator.dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector( tokens.slice( 0, i - 1 ) ).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Nested matchers should use non-integer dirruns
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.E);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					for ( j = 0; (matcher = elementMatchers[j]); j++ ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			// `i` starts as a string, so matchedCount would equal "00" if there are no elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				for ( j = 0; (matcher = setMatchers[j]); j++ ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && !documentIsXML &&
					Expr.relative[ tokens[1].type ] ) {

				context = Expr.find["ID"]( token.matches[0].replace( runescape, funescape ), context )[0];
				if ( !context ) {
					return results;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			for ( i = matchExpr["needsContext"].test( selector ) ? -1 : tokens.length - 1; i >= 0; i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, slice.call( seed, 0 ) );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		documentIsXML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Easy API for creating new setFilters
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Initialize with the default document
setDocument();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self, matched, i,
			l = this.length;

		if ( typeof selector !== "string" ) {
			self = this;
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		matched = [];
		for ( i = 0; i < l; i++ ) {
			jQuery.find( selector, this[ i ], matched );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		matched = this.pushStack( jQuery.unique( matched ) );
		matched.selector = ( this.selector ? this.selector + " " : "" ) + selector;
		return matched;
	},

	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter(function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true) );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[ 0 ] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = ( rneedsContext.test( selectors ) || typeof selectors !== "string" ) ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			cur = this[ i ];

			while ( cur && cur.ownerDocument && cur !== context ) {
				if ( pos ? pos.index( cur ) > -1 : jQuery.find.matchesSelector( cur, selectors ) ) {
					matched.push( cur );
					break;
				}
				cur = cur.parentElement;
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return core_indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return core_indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

jQuery.fn.andSelf = jQuery.fn.addBack;

jQuery.each({
	parent: function( elem ) {
		return elem.parentElement;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentElement" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentElement", until );
	},
	next: function( elem ) {
		return elem.nextElementSibling;
	},
	prev: function( elem ) {
		return elem.previousElementSibling;
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextElementSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousElementSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextElementSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousElementSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		var children = elem.children;

		// documentFragment or document does not have children property
		return children ? jQuery.merge( [], children ) : jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {
			if ( !guaranteedUnique[ name ] ) {
				jQuery.unique( matched );
			}

			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector( elems[ 0 ], expr ) ? [ elems[ 0 ] ] : [] :
			jQuery.find.matches( expr, elems );
	},

	dir: function( elem, dir, until ) {
		var cur = elem[ dir ],
			matched = [];

		while ( cur && ( !until || !jQuery( cur ).is( until ) ) ) {
			matched.push( cur );
			cur = cur[ dir ];
		}

		return matched;
	},

	sibling: function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	var filtered;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});
	}

	if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem ) {
			return ( elem === qualifier ) === keep;
		});
	}

	if ( typeof qualifier === "string" ) {
		filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, filtered, !keep );
		}

		qualifier = jQuery.filter( qualifier, filtered );
	}

	return jQuery.grep(elements, function( elem ) {
		return ( core_indexOf.call( qualifier, elem ) >= 0 ) === keep;
	});
}
var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {

		// Support: IE 9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		tr: [ 1, "<table>", "</table>" ],
		td: [ 3, "<table><tr>", "</tr></table>" ],
		_default: [ 0, "", "" ]
	};

// Support: IE 9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead = wrapMap.col = wrapMap.tr;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapAll( html.call(this, i) );
			});
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip(arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip(arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			i = 0,
			l = this.length;

		for ( ; i < l; i++ ) {
			elem = this[ i ];

			if ( !selector || jQuery.filter( selector, [ elem ] ).length > 0 ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( getAll( elem ) );
				}

				if ( elem.parentNode ) {
					if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
						setGlobalEval( getAll( elem, "script" ) );
					}
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0,
			l = this.length;

		for ( ; i < l; i++ ) {
			elem = this[ i ];

			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		var isFunction = jQuery.isFunction( value );

		// Make sure that the elements are removed from the DOM before they are inserted
		// this can help fix replacing a parent with child elements
		if ( !isFunction && typeof value !== "string" ) {
			value = jQuery( value ).not( this ).detach();
		}

		return this.domManip( [ value ], true, function( elem ) {
			var next = this.nextSibling,
				parent = this.parentNode;

			if ( parent && this.nodeType === 1 || this.nodeType === 11 ) {

				jQuery( this ).remove();

				if ( next ) {
					next.parentNode.insertBefore( elem, next );
				} else {
					parent.appendChild( elem );
				}
			}
		});
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, table ? self.html() : undefined );
				}
				self.domManip( args, table, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							core_push.apply( scripts, getAll( node, "script" ) );
						}
					}

					callback.call(
						table && jQuery.nodeName( this[ i ], "table" ) ?
							findOrAppend( this[ i ], "tbody" ) :
							this[ i ],
						node,
						i
					);
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery.ajax({
									url: node.src,
									type: "GET",
									dataType: "script",
									async: false,
									global: false,
									"throws": true
								});
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			core_push.apply( ret, elems );
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Support: IE >=9
		// Fix Cloning issues
		if ( !jQuery.support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var elem, tmp, tag, wrap, contains, j,
			i = 0,
			l = elems.length,
			fragment = context.createDocumentFragment(),
			nodes = [];

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					core_push.apply( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.firstChild;
					}

					core_push.apply( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Fixes #12346
					// Support: Webkit, IE
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var id, data, elem, type,
			l = elems.length,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			special = jQuery.event.special;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					for ( type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {
						delete cache[ id ];
						delete elem[ internalKey ];
					}
				}
			}
		}
	}
});

function findOrAppend( elem, tag ) {
	return elem.getElementsByTagName( tag )[ 0 ] || elem.appendChild( elem.ownerDocument.createElement(tag) );
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	var attr = elem.getAttributeNode("type");
	elem.type = ( attr && attr.specified ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];

	} else {
		elem.removeAttribute("type");
	}

	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var l = elems.length,
		i = 0;

	for ( ; i < l; i++ ) {
		jQuery._data( elems[ i ], "globalEval", !refElements || jQuery._data( refElements[ i ], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var i, l, type,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function getAll( context, tag ) {
	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

// Support: IE >= 9
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}
var curCSS, iframe,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
function getStyles( elem ) {
	return window.getComputedStyle( elem, null );
}

function showHide( elements, show ) {
	var elem,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		values[ index ] = jQuery._data( elem, "olddisplay" );
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && elem.style.display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else if ( !values[ index ] && !isHidden( elem ) ) {
			jQuery._data( elem, "olddisplay", jQuery.css( elem, "display" ) );
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		var bool = typeof state === "boolean";

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				style[ name ] = value;
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

curCSS = function( elem, name, _computed ) {
	var width, minWidth, maxWidth,
		computed = _computed || getStyles( elem ),

		// Support: IE9
		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
		style = elem.style;

	if ( computed ) {

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// Support: Chrome <17, Safari 5.1
		// A tribute to the "awesome hack by Dean Edwards"
		// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
		// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
		// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret;
};


function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		return elem.offsetWidth === 0 && elem.offsetHeight === 0;
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,
			// URL without anti-cache param
			cacheURL,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// If not modified
				if ( status === 304 ) {
					isSuccess = true;
					statusText = "notmodified";

				// If we have data
				} else {
					isSuccess = ajaxConvert( s, response );
					statusText = isSuccess.state;
					success = isSuccess.data;
					error = isSuccess.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	}
});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	var conv, conv2, current, tmp,
		converters = {},
		i = 0,
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice(),
		prev = dataTypes[ 0 ];

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	// Convert to each sequential dataType, tolerating list modification
	for ( ; (current = dataTypes[++i]); ) {

		// There's only work to do if current dataType is non-auto
		if ( current !== "*" ) {

			// Convert response if prev dataType is non-auto and differs from current
			if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split(" ");
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.splice( i--, 0, current );
								}

								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s["throws"] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}

			// Update prev for next iteration
			prev = current;
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
jQuery.ajaxSettings.xhr = function() {
	try {
		return new XMLHttpRequest();
	} catch( e ) {}
};

var xhrSupported = jQuery.ajaxSettings.xhr(),
	xhrSuccessStatus = {
		// file protocol always yields status code 0, assume 200
		0: 200,
		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	// Support: IE9
	// We need to keep track of outbound xhr and abort them manually
	// because IE is not smart enough to do it all by itself
	xhrId = 0,
	xhrCallbacks = {};

if ( window.ActiveXObject ) {
	jQuery( window ).on( "unload", function() {
		for( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]();
		}
		xhrCallbacks = undefined;
	});
}

jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
jQuery.support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport(function( options ) {
	var callback;
	// Cross domain only allowed if supported through XMLHttpRequest
	if ( jQuery.support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i, id,
					xhr = options.xhr();
				xhr.open( options.type, options.url, options.async, options.username, options.password );
				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}
				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}
				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers["X-Requested-With"] ) {
					headers["X-Requested-With"] = "XMLHttpRequest";
				}
				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}
				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							delete xhrCallbacks[ id ];
							callback = xhr.onload = xhr.onerror = null;
							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {
								complete(
									// file protocol always yields status 0, assume 404
									xhr.status || 404,
									xhr.statusText
								);
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,
									// Support: IE9
									// #11426: When requesting binary data, IE9 will throw an exception
									// on any attempt to access responseText
									typeof xhr.responseText === "string" ? {
										text: xhr.responseText
									} : undefined,
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};
				// Listen to events
				xhr.onload = callback();
				xhr.onerror = callback("error");
				// Create the abort callback
				callback = xhrCallbacks[( id = xhrId++ )] = callback("abort");
				// Do send the request
				// This may raise an exception which is actually
				// handled in jQuery.ajax (so no try/catch here)
				xhr.send( options.hasContent && options.data || null );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var end, unit,
				tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				target = tween.cur(),
				start = +target || 0,
				scale = 1,
				maxIterations = 20;

			if ( parts ) {
				end = +parts[2];
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

				// We need to compute starting value
				if ( unit !== "px" && start ) {
					// Iteratively approximate from a nonzero starting point
					// Prefer the current property, because this process will be trivial if it uses the same units
					// Fallback to end or a simple constant
					start = jQuery.css( tween.elem, prop, true ) || end || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*
						// Use a string for doubling factor so we don't accidentally see scale as unchanged below
						scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

					// Update scale, tolerating zero or NaN from tween.cur()
					// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				tween.unit = unit;
				tween.start = start;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
			}
			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
	jQuery.each( props, function( prop, value ) {
		var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( collection[ index ].call( animation, prop, value ) ) {

				// we're done with this property
				return;
			}
		}
	});
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	createTweens( animation, props );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/*jshint validthis:true */
	var index, prop, value, length, dataShow, toggle, tween, hooks, oldfire,
		anim = this,
		style = elem.style,
		orig = {},
		handled = [],
		hidden = elem.nodeType && isHidden( elem );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.done(function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		});
	}


	// show/hide pass
	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
		if ( "hidden" in dataShow ) {
			hidden = dataShow.hidden;
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing a non empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "auto" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );
				doAnimation.finish = function() {
					anim.stop( true );
				};
				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.cur && hooks.cur.finish ) {
				hooks.cur.finish.call( this );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== "undefined" ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.documentElement;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || document.documentElement;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// })();
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

})( window );

$.fn.rect = function() {
	var rect = this.offset();
	rect.width  = this.width();
	rect.height = this.height();
	return rect;
}

$.fn.sizeRect = function() {
	return {width: this.width(), height: this.height()};
}

$.fn.forEach = function(callback, bind) {
	return $.makeArray(this).forEach(callback, bind);
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
var FeedSearch = Class.extend({
	searchURL: function() {
		return Ext.isOnline() ? app.config.feeder.root + '/api/feed-search.json?q=$term' : 'https://ajax.googleapis.com/ajax/services/feed/find?q=$term&v=1.0'
	},
	
	proxyURL: function() {
		return app.config.feeder.root + '/api/feed-proxy?path=$url';
	},
	
	search: function(url, callback) {
		this.term = url;
		
		if ( ! url.match(/https?:\/\//) )
			url = "http://" + url;
		
		this.searchTerm = url;
		
		if ( Ext.isOnline() )
			url = this.proxyURL().replace('$url', encodeURIComponent(url));
		
		this.request = new Request({
			url: url,
			onComplete: this.searchComplete.withCallback(callback)
		});
		this.request.send();
	},
	
	searchComplete: function(status, data, xml, callback) {
		var feeds = [];
		if ( status === 200 )
			feeds = this.searchForFeedsInText(data, this.searchTerm);
			
		if ( ! feeds.length ) {
			this.keywordSearch(this.term, callback);
		} else {
			callback(feeds);
		}
	},
	
	keywordSearch: function(term, callback) {
		this.request = new Request({
			url: this.searchURL().replace('$term', encodeURIComponent(this.term)),
			onComplete: this.keywordSearchComplete.withCallback(callback)
		});
		this.request.send();
	},
	
	keywordSearchComplete: function(status, data, xml, callback) {
		var feeds = [];
		try {
			data = JSON.parse(data);
			feeds = data.responseData.entries.map(function(feed) {
				return {
					title: feed.title,
					href: feed.url
				};
			});
		} catch (e) {}
		
		callback(feeds);
	},
	
	searchForFeedsInText: function(text, url) {
		var html;
		var match = text.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
			
		var feeds = [];
			
		if ( match ) {
			html = match[1];
			
			var element = document.createElement('div');
			element.innerHTML = html;
			
			feeds = element.querySelectorAll('link[rel=alternate], link[type*=rss], link[type*=atom], link[type*=rdf]');
			for ( var i = 0, feed; feed = feeds[i]; i++ ) {
				// Get link
				var href = feed.getAttribute('href');
				if ( ! href.match(/^(http|https):/) ) {
					if ( url.substr(-1) != '/' && href.substr(0, 1) != '/' )
						url += '/';
					href = url + href;
				}
				feed.href = href;
			}
			feeds = Array.prototype.slice.call(feeds);
		} else {
			var doc = (new DOMParser()).parseFromString(text, 'text/xml');
			if ( doc.querySelector('rss') || doc.querySelector('feed') || doc.querySelector('rdf') || doc.querySelector('channel') )
				feeds = [{title: 'Feed', href: url}];
		}
		return feeds;
	}
});

;
var Controller = Class.extend({
	initialize: function() {
		this.created = Date.now();
		this.vc = Screen.currentVC;
		
		this.template = new PUI.Template(this.template);
		this.template.prepareVariables(this.vc);
		
		this.ui = this.template.getComponents();
		this.contextMenus = {};
		
		this.event = new PUI.Events(this.template.container, this);
		this.event.add(this.events || {});
		
		this.addStandardEvents();
		
		this.args = arguments;
		this.start.apply(this, arguments);
	},
	
	destroy: function() {
		// Remove events bound by data objects
		this.template.destroy();
	},
	
	start: function() {},
	onVisible: function() {}, // when page added to DOM
	onCurrent: function() {}, // when set as current screen
	onOff: function() {}, // when page has gone off screen
	onPopupVisible: function() {},
	onPopupHide: function() {},

	navNext: function() {},
	navPrevious: function() {},
	navForward: function() {},
	navBack: function() {},
	setCurrentNavFromItem: function() {},

	callbackAfterAnimation: function(callback) {
		return function() {
			return this.vc.addAnimationDoneCallback(callback, arguments);
		}.bind(this);
	},
	
	// Reused actions across every screen
	// Maybe this should be in a "Screen"-class, instead of Controller?
	
	addStandardEvents: function() {
		this.event.addEvent('click-or-touch .back, .escape', 'back');
		this.event.addEvent('click .tooltip-button', 'showTooltip');
		this.event.addEvent('click .get-feeder-pro', 'getFeederPro');
		this.event.addEvent('contextmenu', 'checkContextClick');
		this.event.addEvent('click .feeder-online', 'openOnline');
	},
	
	openOnline: function(e) {
		e.preventDefault();

		if (app.user.isPro())
			UI.openTab(app.config.feeder.root);
		else
			UI.openTab(app.config.feeder.connectURL);
	},

	showTooltip: function(e) {
		if ( this.currentTooltip || $(e.target).closest('.tooltip-item').length )
			return;

		var el = $(e.currentTarget);
		
		this.currentTooltip = el.find('.tooltip').addClass('show');
		
		// Add cover element over content
		window.addEventListener('click', this.blockAllClicksAndHideTooltip, true);
	},

	checkContextClick: function(e) {
		if ( e.which != 3 )
			return true;
		
		var found = false;
		for ( var key in this.contextMenus ) if ( this.contextMenus.hasOwnProperty(key) ) {
			if ( $(e.target).closest(key).length )
				found = key;
		}

		if ( ! found )
			return true;
		
		e.preventDefault();
		e.stopPropagation();
		
		var menu = new PUI.ContextMenu(this.contextMenus[key], false, e.pageX, e.pageY);
		menu.item = e.item;
		menu.show();
	},
	
	addContextMenu: function(selector, obj, options) {
		options = options || {};
		
		for ( var key in obj ) if ( obj.hasOwnProperty(key) )
			obj[key] = this[obj[key]];
		
		if ( ! options.onlyPopup || (options.onlyPopup && this.vc.isPopup()) )
			this.contextMenus[selector] = obj;
	},
	
	blockAllClicksAndHideTooltip: function(e) {
		this.hideTooltip();
		
		if ( $(e.target).closest('.tooltip').length )
			return;
			
		e.preventDefault();
		e.stopPropagation();
	},
	
	hideTooltip: function() {
		this.currentTooltip.removeClass('show');
		this.currentTooltip = false;
		window.removeEventListener('click', this.blockAllClicksAndHideTooltip, true);
	},

	back: function(e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		this.vc.popScreen();
	},
		
	openOptionsPage: function() {
		this.vc.openSettingsPage();
	},
	
	openEveryUnreadPost: function() {
		app.user.openEveryUnread();
	},
	
	clearAllUnread: function() {
		chain(this.disableEvents)
		.and(app.user.clearAllUnread)
		.and(this.enableEvents)
		.and(this.vc.currentScreen.onClearAllUnread)
		.and(this.vc.currentScreen.populate);
	},
	
	onClearAllUnread: function(callback) {
		fireCallback(callback);
	},
	
	getFeederPro: function(e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		UI.openTab(app.config.feeder.connectURL + (app.sync.get("google") ? '&googlereader=true' : ''));
		UI.closePopup();
	},
	
	disableEvents: function(callback) {
		this.vc.listener.disable = true;
		fireCallback(callback);
	},
	
	enableEvents: function(callback) {
		this.vc.listener.disable = false;
		fireCallback(callback);
	},
	
	startScreenLoading: function() {
		this.template.el('[data-loader]').addClass("loading-screen");
	},
	
	stopScreenLoading: function() {
		this.template.el('.loading-screen').removeClass("loading-screen");
	}
});
;
var Screen = {};

;
Screen.Organizeable = Controller.extend({
	onVisible: function() {
		if ( this.inOrganize() )
			this.makeSortables();
	},
	
	startOrganize: function() {
		// Indicate on body that we're organizing
		document.body.classList.add('organize-mode');
		
		// Add bottom bar
		var tpl = new PUI.Template("bar#organize");
		document.body.appendChild(tpl.container);
		
		// Add events to bottom bar
		var bottomEvents = new PUI.Events(tpl.element, this);
		bottomEvents.add({
			'click .done': 'endOrganize',
			'click .add-button': 'organizeAddFolder'
		});
		
		this.makeSortables();
	},
	
	inOrganize: function() {
		return document.body.classList.contains('organize-mode');
	},
	
	makeSortables: function() {
		this.sortable = new PUI.Sort({
			droppable: '.is-folder',
			onDrop: this.onDropIntoFolder,
			onDropArea: this.onDropOnElement,
			onEnd: this.onDropOrder,
			sortOptions: {
				include: '.item-move'
			},
			dropAreas: [
				this.template.element.find('.back')
			]
		});
		
		this.loadSortables();
	},
	
	loadSortables: function() {
		if ( ! this.sortable )
			return;
		
		this.sortable.clear();
		$.makeArray(this.template.element.find('.tpl-list-item-feed')).forEach(this.makeSortable);
	},
	
	makeSortable: function(element) {
		this.sortable.add(element);
	},
	
	endOrganize: function() {
		// Remove bottom bar and class on body
		$('.tpl-bar-organize').remove();
		document.body.classList.remove('organize-mode');
	},
	
	organizeAddFolder: function() {
		if ( ! this.vc.currentScreen.folder.standard && ! app.user.canHaveNestedFolders() ) {
			PUI.alert(_("Google Reader can't have nested folders."));
			return;
		}
		
		PUI.prompt("Enter a name for folder:")
		.done(this.createFolder);
	},
	
	createFolder: function(name) {
		if ( ! name )
			return;
		
		app.user.structure.addNewFolderToFolder(name, this.vc.currentScreen.folder.id, this.createFolderComplete);
	},
	
	createFolderComplete: function(folder) {
		var page = this.vc.currentScreen;
		
		var item = page.addFolder(folder);
		page.makeSortable(item.element);
		
		app.events.send('folder:added', {folder: folder.id});
	},
	
	onDropOrder: function() {
		var folder = this.folder;
		
		this.folder.setOrderFromArray(this.serializeOrder());
		
		this.folder.save(function() {
			app.events.send('folder:updated', {folder: folder.id, reason: 'order'})
		});
	},
	
	serializeOrder: function() {
		return this.template.element.find('.tpl-list-item-feed').get().map(function(item) {
			return item.store.model;
		});
	},
	
	onDropIntoFolder: function(folderSort, currentSort) {
		var currentItem = currentSort.el[0].store.model;
		
		if ( currentItem.isFolder && ! app.user.canHaveNestedFolders() ) {
			PUI.alert(_("Google Reader can't have nested folders."));
			return;
		}
		
		currentSort.el.remove();
		this.vc.refreshWindowHeight();
		
		var currentFolder = this.folder;
		
		// folderSort is either a folder model or an element with it as store
		var dropFolder = folderSort.model ? folderSort : folderSort.el[0].store.model;
		
		dropFolder.addItem(currentItem);
		
		app.user.structure.save(function() {
			if ( currentItem.isFeed )
				app.events.send('feed:updated', {feed: currentItem.id, reason: 'category', from: currentFolder.id, to: dropFolder.id});
		});
		
		// Removal of item from this.folder is handled by onDropOrder
	},
	
	onDropOnElement: function(element, currentSort) {
		if ( element.is(".back") ) {
			this.onDropIntoFolder(this.folder.getParent(), currentSort);
		}
	}
});
;
Screen.Feeds = Screen.Organizeable.extend({
	start: function() {
		this._super.apply(this, arguments);
		
		this.event.add({
			'click .item-edit-button': 'editFeed',
			'click-or-touch .tpl-list-item-feed': 'itemClicked',
			'click .tpl-list-item-feed .tpl-count-group': 'markAllAsRead',
			'click .cancel': 'cancelEdit',
			'click .edit-feed': 'editFeed',
			'click .item-remove': 'removeItem',
			'click .open-all-unread': 'openAllUnread',
			'click .flerp': 'openFlerp'
		});
		
		this.addContextMenu('.tpl-list-item-feed', {
			'Go to page': 'gotoPage',
			'Mark feed as read': 'markAllAsRead',
			'Open all unread in feed': 'openAllUnread',
			'--': '',
			'Open every unread post': 'openEveryUnreadPost',
			'Mark all as read': 'clearAllUnread',
			'---': '',
			'Go to options page': 'openOptionsPage',
		}, {onlyPopup: true});

		this.vc.history.wrapAround = true;
	},
	
	destroy: function() {
		this._super();
		this.vc.listener.removeModelListener(this.folder, this.folderChanged);
		this.clearPostsPage();
	},
	
	populate: function(callback) {
		this._onPopulatedCallback = callback;

		this.clearItems();
		this.startScreenLoading();
		
		if ( this.vc.currentFilter )
			this['on' + this.vc.currentFilter.upperCaseFirst()]();
		else
			this.onAll();
	},
	
	populateDone: function() {
		this.stopScreenLoading();
		
		try {
			this.vc.refreshWindowHeight();
		} catch(e) {}
		
		if ( this.inOrganize() )
			this.loadSortables();
		
		this.onPopulated();
		fireCallback(this._onPopulatedCallback);
	},
	
	onPopulated: function() {},
	
	onUnread: function() {
		this.setPostsPage(app.user.create('FeedOnlyUnread'), this.populateDone);
	},
	
	onStarred: function() {
		this.setPostsPage(app.user.create('FeedOnlyStarred'), this.populateDone);
	},
	
	onAll: function() {
		this.clearPostsPage();
		this.folder.forEachItem(this.addItem);
		this.populateDone();
	},
	
	setFolder: function(folder) {
		this.folder = folder;
		this.vc.listener.addModelListener(folder, this.folderChanged);
	},
	
	folderChanged: function(folder) {
		this.folder = folder;
		if ( this.disableFolderUpdates )
			return;
		this.populate();
	},
	
	clearItems: function() {
		this.hideNoScreen = false;
		this.items = [];
		this.vc.history.reset();
		this.template.setItems('feeds', []);
	},
	
	setPostsPage: function(magicFeed, callback) {
		this.clearPostsPage();
		this.postsPage = new Screen.Posts(magicFeed, true);
		this.postsPage.populate(this.onPostsPageSetPosts.withCallback(callback));

		this.postsPage.forceReload = this.populate;
	},
	
	onPostsPageSetPosts: function(posts, callback) {
		this.stopScreenLoading();
		
		if ( ! posts.length ) {
			fireCallback(callback);
			return this.clearPostsPage();
		}

		this.template.element.find('.screen-container').append(this.postsPage.template.container);
		
		// Remove 'no unread/starred' thing
		this.hideNoScreen = true,
		document.body.classList.add('no-posts-page');
		
		fireCallback(callback);
	},
	
	clearPostsPage: function() {
		document.body.classList.remove('no-posts-page');
		
		if ( this.postsPage ) {
			this.postsPage.destroy();
			this.postsPage.template.element.remove();
			this.postsPage = false;
		}
	},
	
	runItemFilter: function(item, callback) {
		var addItem = this.addItem;
		
		Screen.Feeds.currentFilter(item, function(res) {
			if ( res )
				addItem(item);
			callback();
		});
	},

	addItem: function(model) {
		var item;
		if ( model.isFolder )
			item = this.addFolder(model);
		else
			item = this.addFeed(model);

		this.vc.history.addAction(model);

		if (this.items.indexOf(item) === this.options.active) {
			this.vc.history.setActiveAction(model);
			$(item.element).addClass("active-highlighted");
			this.options.active = false;
		}
	},
	
	addFolder: function(folder) {
		var item = this.template.addItem('feeds', folder);
		item.element.classList.add('is-folder');
		this.items.push(item);
		return item;
	},
	
	addFeed: function(feed) {
		var item = this.template.addItem('feeds', feed);
		this.items.push(item);
		return item;
	},
	
	itemClicked: function(e) {
		if ( $(e.target).closest('.tpl-count-group, .tpl-drawer-menu, .item-remove, .item-edit-button, .flerp, .tpl-screen-no-feeds').length )
			return;
		
		if ( (e.ctrlKey || e.metaKey) && ! this.inOrganize() ) {
			e.preventDefault();
			$(e.target).closest('.tpl-list-item-feed').toggleClass('opened');
			return;
		}

		this.gotoItem(e.item);
	},

	gotoItem: function(item) {
		if ( item.model.model === "folder" )
			this.vc.pushFolder(item.model);
		else if ( ! this.inOrganize() )
			this.vc.pushFeed(item.model);
		else if ( this.inOrganize() )
			this.vc.showSettingsScreen(item.model);
	},
	
	markAllAsRead: function(e) {
		e.item.model.markAllAsRead();
	},
	
	cancelEdit: function(e) {
		$(e.target).closest('.tpl-list-item-feed').removeClass('opened');
	},
	
	editFeed: function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		this.vc.showSettingsScreen(e.item.model);
		this.cancelEdit(e);
	},
	
	removeItem: function(e) {
		var text = _("Delete %s?", e.item.get('title'));
		
		if ( e.item.model.isFolder ) {
			var total = e.item.model.countItems();
			if ( total == 1 )
				text = _("Delete %s and the one feed in it?", e.item.get('title'));
			else if ( total > 1 )
				text = _("Delete %s and the %s feeds in it?", e.item.get('title'), total);
		}
		
		PUI.confirm(text)
		.yes(this.yesRemoveItem.andArguments(e.item));
	},
	
	yesRemoveItem: function(item) {
		if ( item.model.isFeed )
			this.yesRemoveFeed(item.model);
		else
			this.yesRemoveFolder(item.model);
	},
	
	yesRemoveFeed: function(feed) {
		this.folder.removeFeed(feed.id);
		app.user.removeFeedIfNotInCategories(feed.id);
		this.folder.save();
		
		this.elementForModel(feed).remove();
		this.vc.refreshWindowHeight();
	},
	
	yesRemoveFolder: function(folder) {
		app.user.structure.removeFolder(folder, function() {
			app.events.send("folder:removed", {folder: folder.id, folderName: folder.name});
		});
		
		this.elementForModel(folder).remove();
		this.vc.refreshWindowHeight();
	},
	
	elementForModel: function(model) {
		return $(this.template.element.find('.tpl-list-item-feed').get().filter(function(el) {
			return el.store.model === model;
		})[0]);
	},
	
	openAllUnread: function(e) {
		e.item.model.unreadPosts(function(posts) {
			app.ui.openMany(posts);
		});
	},
	
	openFlerp: function(e) {
		$(e.target).closest('.tpl-list-item-feed').toggleClass('opened');
	},
	
	gotoPage: function(e) {
		UI.openTab(e.item.model.link);
	},

	navForward: function(to) {
		this.gotoItem({model: to});
	},

	navigateTo: function(model) {
		if ( ! model )
			return;
		this.template.el('.active-highlighted').removeClass('active-highlighted');
		
		var currentElement = this.elementForModel(model);
		currentElement.addClass("active-highlighted");
		currentElement[0].scrollIntoViewSmart();

		this.currentIndex = this.vc.history.list.indexOf(model);
	}
});

;
Screen.Main = Screen.Feeds.extend({
	template: 'screen#main',
	
	events: {
		'click .global-settings': 'showSettings',
		'click .add': 'showAdd',
		'click .reload': 'reloadSync',
		'click .organize': 'startOrganizeMode',
		'click #filter-settings .all': 'filterAll',
		'click #filter-settings .starred': 'filterStarred',
		'click #filter-settings .unread': 'filterUnread',
		'click .tooltip-button': 'showTooltip'
	},
	
	start: function(options) {
		this._super();
		
		this.options = options || {};
		
		this.feedList = this.template.element.find('.tpl-feed-list');
		
		this.setFolder(app.user.structure.base);
		
		this.updateAvailable();
		this.updateUnread();
		
		this.setActiveFilter();
		
		this.vc.listener.listen("feeds:found", this.feedsFound);
		this.vc.listener.listen("feeds:recount", this.feedsCountChanged);
		this.vc.listener.listen("post:added", this.postAdded);

		this.tooltipMenu = new PUI.ContextMenu({
			'<span class="icons wrench"></span> Settings [global-settings]': this.showSettings,
			'<span class="icons sort-list"></span> Organize your feeds [organize]': this.startOrganizeMode,
			'<span class="icons reload"></span> Reload feeds [reload]': this.reloadSync
		}, document.body, 0, 0, {destroyOnHide: false, elementPosition: this.template.el('.tooltip-button')});
		
		this.populate();
	},
	
	populate: function() {
		if (this.vc.currentFilter == 'unread') {
			this.numUnreadWhenLoaded = app.user.countStoredUnreads();
		}
		this.clearCurrentNoScreen();
		this._super();
	},
	
	onVisible: function() {
		this._super();

		setTimeout(this.pushGoogleReaderSettings, 500);
	},

	pushGoogleReaderSettings: function() {
		if (app.sync.get('google')) {
			this.vc.pushScreen(new Screen.Settings());
		}
	},

	byebyeGoogleReader: function() {
		this.removeSyncScreen = new Screen.RemoveSync();
		this.vc.pushScreen(this.removeSyncScreen);
		
		app.sync.removeSyncer('google', this.disconnectDone);
	},
	
	onPopupVisible: function() {
		this.updateAvailable();

		// This happens when we have just changed syncer, for example to Feeder pro
		if (this.folder !== app.user.structure.base || this.numUnreadWhenLoaded != app.user.countStoredUnreads() ) {
			this.setFolder(app.user.structure.base);
			this.populate();
		}
	},
	
	onPopupHide: function() {
		if ( this.vc.currentFilter === 'unread' )
			this.populate();
	},
	
	onClearAllUnread: function(callback) {
		this.updateUnread();
		fireCallback(callback);
	},
	
	destroy: function() {
		this._super();
		this.tooltipMenu.destroy();
		this.vc.listener.unlisten("feeds:found", this.feedsFound);
		this.vc.listener.unlisten("feeds:recount", this.feedsCountChanged);
		this.clearCurrentNoScreen();
	},
	
	feedsFound: function() {
		this.updateAvailable();
	},
	
	updateUnread: function() {
		this.setUnread(app.user.countStoredUnreads());
	},
	
	updateAvailable: function() {
		app.finder.countFeedsInCurrentTab(this.setNewFeeds);
	},

	feedsCountChanged: function(evt) {
		this.setUnread(evt.total);
		
		for (var i = 0; i < this.items.length; i++) {
			this.items[i].modelChanged(this.items[i].model);
		}
	},
	
	setUnread: function(unread) {
		this.template.set('num_unread', unread > 9999 ? "9999" : unread);
	},
	
	setNewFeeds: function(num) {
		this.template.set('num_feeds', num);
		if ( ! num )
			this.template.element.find('.add .bubble').hide();
		else
			this.template.element.find('.add .bubble').show();
	},

	showTooltip: function(e) {
		e.preventDefault();
		this.tooltipMenu.show();
		return false;
	},
	
	showAdd: function() {
		this.vc.showAddScreen();
	},
	
	showSettings: function() {
		this.vc.showSettingsScreen();
	},
	
	reloadSync: function() {
		chain(this.showLoading)
		.then(app.sync.fetchUpstream)
		.then(app.poller.forceUpdate)
		.and(this.hideLoading);
	},
	
	showLoading: function(callback) {
		this.template.element.find('.settings').addClass('loading');
		fireCallback(callback);
	},
	
	hideLoading: function(callback) {
		this.template.element.find('.settings').removeClass('loading');
		fireCallback(callback);
	},
	
	filterAll: function() {
		this.vc.setCurrentFilter('all');
		this.setActiveFilter();
		this.populate();
	},
	
	filterStarred: function() {
		this.vc.setCurrentFilter('starred');
		this.setActiveFilter();
		this.populate();
	},
	
	filterUnread: function() {
		this.vc.setCurrentFilter('unread');
		this.setActiveFilter();
		this.populate();
	},
	
	// Just set the active filter li in the topbar
	setActiveFilter: function() {
		var type = this.vc.currentFilter;
		this.template.element.find('#filter-settings .current').removeClass('current');
		this.template.element.find('#filter-settings .' + type).addClass('current');
	},
		
	onPopulated: function() {
		if ( ! this.vc.isPopup() )
			return;
		
		if ( this.items.length || this.hideNoScreen )
			return;
		
		var className = 'No' + this.vc.currentFilter.upperCaseFirst();
		if ( this.vc.currentFilter === 'all' ) {
			this.endOrganize();
			className = 'NoFeeds';
		}
		
		this.currentNoScreen = new Screen[className]();
		this.currentNoScreen.onDone = this.currentNoScreenCallback;
		this.feedList.parent().append(this.currentNoScreen.template.container);
		
		this.template.element.addClass('no-feeds');
		
		// If is first time
		if ( ! localStorage.hasSeenWelcome && this.vc.currentFilter === 'all' ) {
			localStorage.hasSeenWelcome = true;
			
			this.currentWelcomeScreen = new Screen.Welcome();
			this.feedList.parent().append(this.currentWelcomeScreen.template.container);
		}
		
		this.disableFolderUpdates = true;
	},
	
	currentNoScreenCallback: function() {
		this.clearCurrentNoScreen();
		this.populate();
	},
	
	clearCurrentNoScreen: function() {
		this.template.element.removeClass('no-feeds');
		
		if ( this.currentNoScreen ) {
			this.currentNoScreen.template.element.remove();
			this.currentNoScreen.destroy();
		}
		
		if ( this.currentWelcomeScreen ) {
			this.currentWelcomeScreen.template.element.remove();
			this.currentWelcomeScreen.destroy();
		}
		
		this.disableFolderUpdates = false;
	},
	
	highlightSyncSettings: function() {
		$('.tpl-screen-import-export').hide();
		
		this.importModal = new PUI.ScreenModal(Screen.ImportExport);
		this.importModal.show();
		this.importModal.instance.importDoneCallback = this.importModalDone;
		
		this.importModal.onDestroy = this.importClosed;
	},
	
	importClosed: function() {
		$('.tpl-screen-import-export').show();
		this.importModal.destroy();
	},
	
	importModalDone: function(res) {
		$('.tpl-screen-import-export').show();
		this.importModal.destroy();
	},
	
	fromWebintent: function() {
		var url = UI.getIntentFeedURL();
		PUI.confirm("Subscribe to:\n" + url)
		.yes(this.subscribeToIntent);
	},
	
	subscribeToIntent: function() {
		var url = UI.getIntentFeedURL();
		
		app.user.addFeed(url, function(feed) {
			if ( ! feed ) {
				PUI.alert("Could not subscribe to feed...");
			}
		});
	},
	
	startOrganizeMode: function() {
		if ( this.vc.currentFilter && this.vc.currentFilter !== 'all' ) {
			this.filterAll();
		}
		
		this.startOrganize();
	},
	
	getFeed: function() {
		if (this.postsPage.feed && this.postsPage.feed)
			return this.postsPage.feed;
		return false;
	},

	navForward: function() {
		if (this.postsPage)
			this.postsPage.navForward.apply(this, arguments);
		else
			this._super.apply(this, arguments);
	},

	navigateTo: function() {
		if (this.postsPage)
			this.postsPage.navigateTo.apply(this, arguments);
		else
			this._super.apply(this, arguments);
	},

	postAdded: function(e) {
		if (this.vc.currentFilter == 'unread' && this.postsPage) {
			this.postsPage.addMoreAvailable();
		}
	},

	id: function() {
		return {id: 'Main', active: this.currentIndex};
	}
});

Screen.Main.fromId = function(params) {
	return new Screen.Main(params);
};
;
Screen.Folder = Screen.Feeds.extend({
	template: 'screen#folder',
	
	start: function(folder, options) {
		this._super.apply(this, arguments);
		
		this.options = options || {};

		this.setFolder(folder);
		this.populate();
		
		this.template.set('count', 0);
		this.template.set('title', folder.name);
		this.template.set('favicon', app.config.images.folder);
	},
	
	id: function() {
		return {id: 'Folder', folder: this.folder.id, active: this.currentIndex};
	}
});

Screen.Folder.fromId = function(id) {
	var folder = app.user.structure.folder(id.folder);
	if ( ! folder )
		return false;
	return new Screen.Folder(folder, {active: id.active});
};
;
Screen.Posts = Controller.extend({
	template: 'screen#posts',
	
	events: {
		'click .tpl-bar-top': 'gotoPage',
		'click .tpl-list-item-post': 'postClicked',
		'mousedown .tpl-list-item-post': 'mousedownOnPost',
		'click .bar .mark-as-read': 'markAllAsRead',
		'click .tpl-post-list .tpl-drawer-menu .mark-as-read, .tpl-post-list .tpl-count-group': 'markAsRead',
		'click .tpl-post-list .mark-as-unread': 'markAsUnread',
		'click .tpl-post-list .star-post': 'toggleStar',
		'click .flerp': 'openFlerp',
		'click .cancel': 'cancelEdit',
		'click .item-starred': 'toggleStarFromItem',
		'click .load-more': 'loadMore',
		'click .x-more-available': 'moreAvailableClicked'
	},
	
	start: function(feed, wait, options) {
		this.feed = feed;
		this.offset = 0;
		
		this.template.data.setModel(feed);

		this.options = options || {};
		
		if ( this.feed.isMagic ) {
			this.template.element.addClass('is-magic-feed');
			
			if (this.feed.onlyUnread)
				this.removeReadPosts = false;
		}
		
		if ( ! wait)
			this.populate();
		
		this.vc.queue.setListener(this.queueChanged);

		this.vc.history.wrapAround = false;
		this.vc.history.onEnd(this.loadMoreForActions)
		
		this.addContextMenu('.tpl-list-item-post', {
			'Toggle read': 'toggleRead',
			'Mark feed as read': 'markAllAsRead',
			'Open all unread in feed': 'openAllUnread',
			'--': '',
			'Open every unread post': 'openEveryUnreadPost',
			'Mark all as read': 'clearAllUnread',
			'---': '',
			'Go to options page': 'openOptionsPage',
		});
		
		this.vc.listener.listen("post:updated", this.postUpdated);
	},
	
	populate: function(callback) {
		this.setMoreAvailable(0);
		this.onSetPostsDone = callback;
		this.feed.fetchPosts(this.callbackAfterAnimation(this.setPosts));
	},
	
	destroy: function() {
		this._super();
		if (this.noPostsPage)
			this.noPostsPage.destroy();
		this.vc.queue.removeListener(this.queueChanged);
		this.vc.listener.unlisten("post:updated", this.postUpdated);
	},
	
	onPopupHide: function() {
		this.checkIfHasToGoBackToClosestScreenWithUnreadPostsIfNoUnreadPostsHere();	
	},
	
	checkIfHasToGoBackToClosestScreenWithUnreadPostsIfNoUnreadPostsHere: function() {
		if ( this.vc.currentScreen instanceof Screen.Main )
			return;
		(this.feed || this.folder).countUnread(this.goBackToClosestScreenWithUnreadPostsIfNoUnreadPostsHere);
	},
	
	goBackToClosestScreenWithUnreadPostsIfNoUnreadPostsHere: function(unread) {
		if (unread)
			return;
		this.vc.popScreen(this.checkIfHasToGoBackToClosestScreenWithUnreadPostsIfNoUnreadPostsHere);
	},
	
	feedUpdated: function() {
		
	},
	
	postUpdated: function(e) {
		if ( ! this.removeReadPosts )
			return;
		
		var item;
		if (e.post)
			item = this.items[e.post];
		else
			item = e;
		$(item.element).remove();
		item.destroy();
		
		delete this.items[e.post];
	},
	
	setPosts: function(posts) {
		this.stopScreenLoading();
		
		this.items = {};
		this.itemsOrdered = [];
		this.vc.history.reset();

		posts.forEach(this.addPost);

		if ( ! posts.length ) {
			this.showNoPostsPage();
			this.toggleShowMore();
		}
		
		fireCallback(this.onSetPostsDone, posts);
	},
	
	addPost: function(post) {
		var item = this.template.addItem('posts', post);
		this.items[post.id] = item;
		this.itemsOrdered.push(item);
		this.vc.history.addAction(post);

		if ( this.vc.queue.contains(post.id) )
			item.element.classList.add('queued');

		this.toggleShowMore();
	},
	
	addPosts: function(posts, feed, callback) {
		this.template.el('.load-more').removeClass("loading");
		posts.forEach(this.addPost);
		fireCallback(callback);
	},
	
	showNoPostsPage: function() {
		this.noPostsPage = new Screen.NoPosts();
		this.template.container.appendChild(this.noPostsPage.template.container);
	},
	
	gotoPage: function(e) {
		if ( $(e.target).closest('.tpl-count-group, .back').length )
			return;
		
		UI.openTab(this.feed.link);
	},
	
	postClicked: function(e) {
		if ( $(e.target).closest('.tpl-count-group, .flerp, .tpl-drawer-menu, .item-starred').length )
			return;
		
		var post = e.item.model;
		
		// Queue post?
		if ( e.ctrlKey || e.metaKey || (e.which == 2 && ! Ext.isOnline()) ) {
			post.markAsRead();
			this.vc.queue.toggle(post.id);
			return;
		}

		this.gotoPost(post);
	},

	mousedownOnPost: function(e) {
		if (e.which == 2 && ! Ext.isOnline()) {
			e.preventDefault();
			e.stopPropagation();
			this.postClicked(e);
		}
	},

	gotoPost: function(post) {
		// If a link is pressed with a queue, add that and pump all
		if ( ! this.vc.queue.isEmpty() ) {
			post.markAsRead();
			this.vc.queue.add(post.id);
			this.vc.queue.pump();
			return;
		}
		
		this.rememberScreen(post.id);
		this.vc.history.setActiveAction(post);
			
		post.markAsRead(this.checkUnread);
		
		if ( typeof window.parent.onGotoPost !== "function" ) {
			if ( Ext.isMobile()) {
				this.vc.pushScreen(new Screen.Consume(post));
			} else {
				if ( app.user.preferences.get('global:openPostsInNewTab') )
					UI.openTab(post.getLink());
				else {
					UI.currentTab(function(tab) {
						UI.tabChangeURL(tab.id, post.getLink());
					});
				}
			}
		} else {
			window.parent.onGotoPost(post);
		}
	},
	
	checkUnread: function() {
	
	},
	
	markAsRead: function(e) {
		e.item.model.markAsRead();
		this.cancelEdit(e);
	},
	
	markAsUnread: function(e) {
		e.item.model.markAsUnread();
		this.cancelEdit(e);
	},
	
	toggleStar: function(e) {
		e.item.model.toggleStar();
		this.cancelEdit(e);
	},
	
	toggleStarFromItem: function(e) {
		this.toggleStar(e);
	},
	
	markAllAsRead: function(e) {
		this.feed.markAllAsRead();
	},
	
	rememberScreen: function(postId) {
		if ( this.feed.hasUnread(postId) )
			this.vc.storeScreenChain();
		else
			this.vc.forgetScreenChain();
	},
	
	queueChanged: function(id, isNew) {
		TRYIT(function() {
			if ( ! this.items[id] )
				return;
			this.items[id].element.classList[isNew ? 'add' : 'remove']('queued');
		}, this);
	},
	
	openFlerp: function(e) {
		$(e.target).closest('.tpl-list-item-post').addClass('opened');
	},
	
	cancelEdit: function(e) {
		$(e.target).closest('.tpl-list-item-post').removeClass('opened');
	},
	
	toggleRead: function(e) {
		var post = e.item.model;
		if (post.is_read)
			post.markAsUnread();
		else
			post.markAsRead();
	},
	
	openAllUnread: function() {
		this.feed.unreadPosts(function(posts) {
			app.ui.openMany(posts);
		});
	},
	
	loadMoreClicked: function(e) {
		e.preventDefault();
		this.loadMore();
	},

	loadMore: function(callback) {
		if ( ! this.hasMore() )
			return fireCallback(callback);

		this.template.el('.load-more').addClass("loading");
		
		this.offset += this.feed.getNumPosts();
		this.feed.fetchMorePosts(this.addPosts.withCallback(callback));
	},

	loadMoreForActions: function() {
		if ( ! this.hasMore() )
			return;

		this.loadMore(this.vc.historyNext);
	},
	
	toggleShowMore: function() {
		this.template.el('.load-more')[this.hasMore() ? 'show' : 'hide']();
	},
	
	hasMore: function() {
		return this.feed.hasMore(this.offset);
	},

	getFeed: function() {
		return this.feed;
	},

	navigateTo: function(post) {
		this.setCurrentNavFromPost(post);
		this.gotoPost(post);
	},

	setMoreAvailable: function(num) {
		var moreAvailable = this.template.el('.x-more-available');
		if (num == 0) {
			moreAvailable.hide();
		}  else {
			moreAvailable.show();
			moreAvailable.find('.num').text(num);

			if (num != 1) {
				moreAvailable.find('.multiple').css('display', 'inline');
			} else {
				moreAvailable.find('.multiple').css('display', 'none');
			}
		}

		moreAvailable.data('total-available', num);
	},

	addMoreAvailable: function() {
		var current = this.template.el('.x-more-available').data('total-available') || 0;
		this.setMoreAvailable(current + 1);
	},

	setCurrentNavFromPost: function(post) {
		var index = false;
		for ( var i = 0, item; item = this.itemsOrdered[i]; i++ ) {
			if (item.model.id === post.id) {
				index = i;
				break;
			}
		}

		if (this.itemsOrdered[this.currentHighlightedIndex])
			this.itemsOrdered[this.currentHighlightedIndex].element.classList.remove("active-highlighted");

		this.currentHighlightedIndex = index;

		var currentElement = this.itemsOrdered[this.currentHighlightedIndex];

		if (currentElement)
			currentElement.element.classList.add("active-highlighted");

		currentElement.element.scrollIntoViewSmart();
	},

	moreAvailableClicked: function(e) {
		e.preventDefault();
		if (typeof this.forceReload === "function")
			this.forceReload();
	},
	
	id: function() {
		if ( ! this.feed.id )
			return false;
		return {id: 'Posts', feed: this.feed.id};
	}
});

Screen.Posts.fromId = function(id) {
	var feed = app.user.feed(id.feed);
	if ( ! feed )
		return;
	return new Screen.Posts(feed, false, {active: id.active});
};
;
Screen.Add = Controller.extend({
	template: 'screen#add',
	
	events: {
		'submit .add-feed-form': 'addFeedSubmit',
		'submit .add-folder-form': 'addFolder',
		'click .done': 'done',
		'change .tpl-follow-button': 'followChanged'
	},
	
	start: function() {
		this.searchForm = this.template.element.find('.add-feed-form');
		this.fromPageFrom = this.template.element.find('.add-from-page-form');
		
		this.hideSearchResults();
		this.hideEmptyResult();
		
		app.finder.countFeedsInCurrentTab(this.showOrHideFeedsInCurrentTab);
		
		this.template.set('title', _('Add new feed or folder'));
	},
	
	onPopupVisible: function() {
		app.finder.countFeedsInCurrentTab(this.showOrHideFeedsInCurrentTab);
	},
	
	showOrHideFeedsInCurrentTab: function(count) {
		this.template.setItems('feeds-on-page', []);
		if ( ! count )
			this.template.element.find('.tpl-box-add-from-page').hide();
		else {
			this.template.element.find('.tpl-box-add-from-page').show();
			app.finder.forEachFeed(this.addFeedFromPage);
		}
	},
	
	addFeedFromPage: function(feed) {
		this.template.addItem('feeds-on-page', {
			title: feed.title || feed.href,
			link: feed.href,
			value: feed.href,
			following: !!app.user.feedBy("path", feed.href) ? "true" : ""
		});
	},
	
	addFeedSubmit: function(e) {
		e.preventDefault();
		
		this.showLoading(this.searchForm);
		
		var term = this.searchForm.find('input[name=url]').val();
		
		var search = new FeedSearch();
		search.search(term, this.searchDone);
	},
	
	searchDone: function(feeds) {
		this.hideLoading(this.searchForm);
		
		if ( feeds.length == 1 ) {
			this.addFeed(feeds[0].href, false, this.vc.popScreen);
		} else if ( feeds.length )
			this.showSearchResults(feeds);
		else
			this.showEmptyResult();
	},

	showSearchResults: function(feeds) {
		this.template.element.find('.search-results').show();
		
		this.template.setItems('search-results', feeds.map(function(feed) {
			return {
				title: feed.title || feed.href,
				link: feed.href,
				value: feed.href,
				following: !!app.user.feedBy("path", feed.href) ? "true" : ""
			};
		}));
	},
	
	hideSearchResults: function() {
		this.template.element.find('.search-results').hide();
		this.template.setItems('search-results', []);
	},
	
	showEmptyResult: function() {
		this.template.element.find('.empty-search-result').show();
	},
	
	hideEmptyResult: function() {
		this.template.element.find('.empty-search-result').hide();
	},
	
	showLoading: function(form, callback) {
		$(form).find('input[type=submit]').addClass('loading');
		fireCallback(callback);
	},
	
	hideLoading: function(form, callback) {
		$(form).find('input[type=submit]').removeClass('loading');
		fireCallback(callback);
	},
	
	followChanged: function(e) {
		var feed = e.item.get("link");
		
		if ( e.item.ui.isFollowing.get() )
			this.addFeed(feed, e.item);
		else
			this.removeFeed(feed, e.item);
	},
	
	addFeed: function(url, item, callback) {
		var currentFolderId = this.vc.currentFolderId;
		
		chain(app.user.addFeed, url)
		.then(function(feed, next) {
			if ( ! feed ) {
				if (item)
					item.ui.isFollowing.set(false);
				PUI.alert(_("Could not add:\n%s", url), next);
				return chain.exit;
			}
				
			if ( ! currentFolderId || app.user.structure.base.id == currentFolderId )
				return next();
				
			chain(app.user.structure.removeFeed, feed.id)
			.and(app.user.structure.addFeedToFolder, feed.id, currentFolderId)
			.end(next);
		})
		.end(callback);
	},
	
	removeFeed: function(url, item, callback) {
		var feed = app.user.feedBy("path", url);
		if ( ! feed )
			return fireCallback(callback);
		
		PUI.confirm(_('Remove "%s"?', feed.title))
		.yes(function() {
			chain(app.user.removeFeedFromAllFolders, feed)
			.end(callback);
		})
		.no(function() {
			item.ui.isFollowing.set("true");
			fireCallback(callback);
		});
	},
	
	done: function() {
		this.vc.popScreen();
	},

	addFolder: function(e) {
		e.preventDefault();
		
		var folder = this.vc.currentFolderId || app.user.structure.base.id;
		app.user.structure.addNewFolderToFolder(this.template.el('[name=folder-name]').val(), folder, this.done);
	}
});
;
Screen.Settings = Controller.extend({
	template: 'screen#settings',
	
	events: {
		'click .done': 'done',
		'click .connect-google-reader': 'openGoogleReaderSettings',
		'click .connected-to-google-reader .remove-subscription': 'disconnectGoogleReader',
		'click .connected-to-feeder-pro .remove-subscription': 'disconnectFeederPro',
		'click #open-external': 'openExternal',
		'change .tpl-box-switch-theme input[type=radio]': 'switchTheme',
		'change .tpl-box-social-feeder .tpl-follow-button': 'followFeederChanged',
		'click #social-bar a': 'openSocialLink',
		'click .about-tip': 'whatIsSkimlinks'
	},
	
	start: function() {
		this.template.set('title', _('Global settings'));
		
		this.ui.updateInterval.min = 1;
		this.ui.updateInterval.max = 60;
		
		this.ui.postsDisplay.min = 5;
		this.ui.postsDisplay.max = 80;
		
		this.containerElement = this.template.element.find('.tpl-box-global-settings');
		
		this.initGoogleReaderConnect();
		this.initFeederProConnect();
		
		this.ui.followFeeder.set(!!app.user.feedBy("path", app.config.feederBlog));
		this.toggleSkimlinksMessage(app.user.preferences.get("global:useSkimlinks"));
	
		this.vc.listener.listen("feeder:connected", this.initFeederProConnect);
		
		app.user.preferences.allThemes.forEach(this.addTheme);
	},

	destroy: function() {
		this._super();
		this.vc.listener.unlisten("feeder:connected", this.initFeederProConnect);
		if (this.gReaderBye)
			this.gReaderBye.destroy();
	},
	
	addTheme: function(theme) {
		var item = this.template.addItem('themes', theme);
		if ( this.isSelected(theme.identifier) )
			$(item.element).find("input[type=radio]").attr("checked", true);
	},
	
	initGoogleReaderConnect: function() {
		// Has Google Reader setup
		if ( app.sync.get('google') ) {
			this.template.element.find('.connected-to-google-reader').css('display', '');
			this.template.element.find('.connect-google-reader').hide();
			
			var googleSync = app.sync.get('google');
			
			this.template.set('google-reader-username', googleSync.getUsername());
			this.template.set('google-reader-email', googleSync.getEmail())
		// Doesn't have Google Reader setup
		} else {
			this.template.element.find('.connected-to-google-reader').hide();
			this.template.element.find('.connect-google-reader, .connected-to-google-reader').hide();
		}

		if (app.user.isPro()) {
			this.template.element.find('.connect-google-reader, .connected-to-google-reader').hide();	
		}
	},
	
	initFeederProConnect: function() {
		if ( app.user.isPro() ) {
			this.template.element.find('.support-us-button').hide();
			
			this.template.element.find('.connected-to-feeder-pro').css('display', '');
			this.template.element.find('.connect-feeder-pro').hide();
			
			this.template.set('feeder-pro-email', app.sync.get("feeder").getEmail());
		// Doesn't have Google Reader setup
		} else {
			this.template.element.find('.support-us-button').css('display', '');
			
			this.template.element.find('.connected-to-feeder-pro').hide();
			this.template.element.find('.connect-feeder-pro').css('display', '');
		}

		if (app.user.isPro()) {
			this.template.element.find('.connect-google-reader, .connected-to-google-reader').hide();
		}
	},

	reloadServices: function() {
		reloadProClasses();
		this.initGoogleReaderConnect();
		this.initFeederProConnect();
	},
	
	isSelected: function(ident) {
		return app.user.preferences.get("activeTheme") == ident;
	},
	
	onVisible: function() {
		this.monitor({
			'globalNotifications': 'global:notifications',
			'openPostsInNewTab': 'global:openPostsInNewTab',
			'updateInterval': 'global:updateInterval',
			'postsDisplay': 'global:postsDisplay',
			'useSkimlinks': 'global:useSkimlinks',
			'showUnreadCountInBadge': 'global:showUnreadCountInBadge'
		});

		if (app.sync.get('google')) {
			setTimeout(this.gReaderAlert, 500);
		}
	},
	
	onPopupVisible: function() {
		if (this.gReaderBye) {
			setTimeout(this.gReaderBye.position, 500);
		}
	},

	gReaderAlert: function() {
		this.gReaderBye = PUI.alert("Google Reader is shutting down. After you press OK we will disconnect Google Reader.\n\nSoon we will release integrations with new feed providers.\n\n<a href='http://blog.feeder.co/post/54280867264/google-reader-is-retiring-here-is-what-you-should-do'>Read more here</a>")
		.ok(this.yesDisconnectGoogleReader);
	},

	monitor: function(obj) {
		for ( var key in obj ) if ( obj.hasOwnProperty(key) )
			this.monitorKey(key, obj[key]);
	},
	
	monitorKey: function(uiKey, preferenceKey) {
		var setVal = app.user.preferences.get(preferenceKey);
		
		if ( uiKey === "updateInterval" )
			setVal = setVal/1000/60;
			
		this.ui[uiKey].set(setVal);
		
		var vc = this.vc;
		
		this.ui[uiKey].onChange(function(val) {
			if ( uiKey === "updateInterval" )
				val = val * 60*1000;
				
			if ( uiKey === "useSkimlinks" )
				this.toggleSkimlinksMessage(val);
				
			app.user.preferences.set(preferenceKey, val);
		}.bind(this));
	},
	
	openGoogleReaderSettings: function(e) {
		if ( this.vc.isPopup() ) {
			this.vc.openSettingsPage("settings", "connectGoogleReader");
			return;
		}
		
		this.connectGoogleReader();
	},
	
	connectGoogleReader: function() {
		if ( app.sync.get('google') )
			return;
		PUI.alert("Please note that Google Reader will be closing soon.\n\nYour feeds will not disappear from Feeder when that happens.\n\nMore information to come.")
		.ok(this.connectGoogleReaderOK);
	},

	connectGoogleReaderOK: function() {
		this.showLoading();
		app.sync.setupGoogle(this.setupDone);
	},
	
	setupDone: function(status, subscriptions) {
		this.hideLoading();
		
		if ( status === "fail-auth" ) {
			PUI.alert(_("We could not log you in"));
			return;
		}
		
		this.vc.showSyncSelect(subscriptions);
	},
	
	disconnectGoogleReader: function() {
		PUI.confirm('Are you sure you wish to disconnect from Google Reader?')
		.yes(this.yesDisconnectGoogleReader);
	},
	
	yesDisconnectGoogleReader: function() {
		this.removeSyncScreen = new Screen.RemoveSync();
		this.vc.pushScreen(this.removeSyncScreen);
		
		app.sync.removeSyncer('google', this.disconnectDone);
	},
	
	disconnectDone: function(feedsWithProblems) {
		this.removeSyncScreen.doneLoading();
		if ( feedsWithProblems.length > 0 )
			this.removeSyncScreen.setBadFeeds(feedsWithProblems);
	},
	
	disconnectFeederPro: function() {
		if (Ext.isOnline()) {
			PUI.confirm('Are you sure you want to log out?')
			.yes(this.yesLogoutFeederPro);
			return;
		}
		PUI.confirm('Are you sure you wish to disconnect your Feeder Pro account?')
		.yes(this.yesDisconnectFeederPro);
	},
	
	yesDisconnectFeederPro: function() {
		app.sync.get('feeder').uninstall(this.reloadServices);
	},

	yesLogoutFeederPro: function() {
		window.top.location.href = app.config.feeder.logoutUrl;
	},
	
	showLoading: function() {
		this.containerElement.addClass('loading');
	},
	
	hideLoading: function() {
		this.containerElement.removeClass('loading');
	},
	
	done: function() {
		this.vc.popScreen();
	},
		
	openExternal: function() {
		this.vc.openSettingsPage();
	},
	
	switchTheme: function(e) {
		if ( ! $(e.target).is(":checked") )
			return;
		app.user.preferences.set('activeTheme', e.item.get("identifier"));
		this.vc.refreshTheme();
	},
	
	followFeederChanged: function(e) {
		// Follow feeder
		if ( this.ui.followFeeder.get() )
			app.user.followFeed(app.config.feederBlog);
		// Unfollow feeder
		else
			app.user.unfollowFeed(app.config.feederBlog);
	},
	
	toggleSkimlinksMessage: function(show) {
		var text = this.template.element.find('.please-donate');
		if (!show)
			text.addClass("no-skimlinks");
		else
			text.removeClass("no-skimlinks");
	},
	
	openSocialLink: function(e) {
		e.preventDefault();
		UI.openTab($(e.target).closest('a').attr('href'));
		UI.closePopup();
	},
	
	pleaseDonate: function() {
		
	},
	
	whatIsSkimlinks: function() {
		UI.openTab(Ext.path("options/skimlinks.html"));
		UI.closePopup();
	},
	
	id: function() {
		return {id: 'Settings'};
	}
});

Screen.Settings.fromId = function(id) {
	return new Screen.Settings();
};

;
Screen.SettingsFeed = Controller.extend({
	template: 'screen#settings-feed',
	
	events: {
		'click .done': 'done',
		'click .delete': 'confirmRemoveFeed',
		'change .user-defined-enabled input': 'toggleUserDefinedUpdate',
		'blur .user-defined-seconds input': 'ensureUserDefinedInRange'
	},
	
	start: function(feed, folder) {
		this.feed = feed;
		this.folder = folder;
	},
	
	onVisible: function() {
		this.ui.postsDisplay.min = 5;
		this.ui.postsDisplay.max = 80;
		
		this.ui.updateInterval.min = 1;
		this.ui.updateInterval.max = 60;
		
		this.template.data.setModel(this.feed);
		
		this.titleField = this.template.element.find('input[name=title]');
		this.pathField = this.template.element.find('input[name=path]');

		this.ui.postsDisplay.set(this.feed.getNumPosts());
		this.ui.notifications.set(!!this.feed.usenotifications);
		this.ui.updateInterval.set((this.feed.updateinterval || app.config.defaultUpdateInterval)/60/1000);
		
		this.ui.updateInterval.onChange(this.updateIntervalSliderChanged);
		
		this.updateIntervalCheckbox = this.template.element.find('.user-defined-enabled input');
		this.updateIntervalInput = this.template.element.find('.user-defined-seconds input');
		
		if ( this.feed.getMeta("userDefinedInterval") )
			this.updateIntervalCheckbox.attr("checked", true);
		
		this.updateIntervalInput.val((this.feed.updateinterval || app.config.defaultUpdateInterval)/1000);
		
		this.titleField.val(this.feed.title);
		this.pathField.val(this.feed.path);
		
		this.toggleUserDefinedUpdate();
	},
	
	done: function() {
		var feed = this.feed;
		
		this.feed.title = this.titleField.val();
		this.feed.numposts = Math.round(this.ui.postsDisplay.value);
		this.feed.usenotifications = +this.ui.notifications.isToggled();
		
		var userDefined = !!this.updateIntervalCheckbox.is(":checked");
		this.feed.setMeta("userDefinedInterval", userDefined);
		
		if (! userDefined)
			this.feed.updateinterval = this.getUpdateIntervalFromSlider();
		else
			this.feed.updateinterval = this.getUpdateIntervalFromInput();
		
		if ( this.feed.updateinterval == app.config.defaultUpdateInterval )
			this.feed.updateinterval = 0;
		
		if ( this.feed.numposts == app.config.defaultNumPosts )
			this.feed.numposts = 0;
		
		chain(this.feed.save)
		.and(this.vc.popScreen)
		.and(function() {
			app.events.send('feed:updated', {feed: feed.id, reason: 'name'});
		});
	},
	
	getUpdateIntervalFromSlider: function() {
		return Math.round(this.ui.updateInterval.value)*1000*60;
	},
	
	getUpdateIntervalFromInput: function() {
		return this.updateIntervalInput.val()*1000;
	},
	
	confirmRemoveFeed: function() {
		PUI.confirm(_("Are you sure you want remove this feed?"))
		.yes(this.removeFeed);
	},
	
	toggleUserDefinedUpdate: function() {
		var container = this.template.element.find('.user-defined-update-interval');
		var isEnabled = this.updateIntervalCheckbox.is(":checked");
		
		if (isEnabled) { 
			container.addClass("is-enabled");
			this.ensureUserDefinedSeconds();
		} else {
			container.removeClass("is-enabled");
			this.setIntervalFromSlider();
		}
	},
	
	ensureUserDefinedSeconds: function() {
		var current = this.updateIntervalInput.val();
		var num = parseInt(current, 10);
		
		if (isNaN(num))
			this.setIntervalFromSlider();
		this.ensureUserDefinedInRange();
	},
	
	setIntervalFromSlider: function() {		
		this.updateIntervalInput.val(this.getUpdateIntervalFromSlider()/1000);	
	},
	
	ensureUserDefinedInRange: function() {
		if (this.getUpdateIntervalFromInput() < 5000)
			this.updateIntervalInput.val(5);
	},
	
	updateIntervalSliderChanged: function() {
		this.setIntervalFromSlider();
	},

	removeFeed: function() {
		this.folder.removeFeed(this.feed.id);
		
		chain(app.user.removeFeedIfNotInCategories, this.feed.id)
		.and(this.folder.save)
		.and(this.vc.popScreen);
	}
});
;
Screen.SettingsFolder = Controller.extend({
	template: 'screen#settings-folder',
	
	events: {
		'click .done': 'done',
		'submit .folder-settings-form': 'done'
	},
	
	start: function(folder) {
		this.folder = folder;
	},
	
	onVisible: function() {
		this.template.data.setModel(this.folder);
		
		this.nameField = this.template.element.find('input[name=name]');
		
		this.nameField.val(this.folder.name);
	},
	
	done: function(e) {
		e.preventDefault();
		
		var folder = this.folder;
		var prevName = this.folder.name;
		var vc = this.vc;
		
		this.folder.name = this.nameField.val();
		this.folder.save(function() {
			app.events.send('folder:updated', {folder: folder.id, prev: prevName, reason: 'name'});
			vc.popScreen();
		});
	}
});
;
Screen.SyncSelect = Controller.extend({
	template: 'screen#feeds-sync-select',
	
	events: {
		
	},
	
	start: function() {
		this.template.set('title', _('Syncing...'));
		app.events.subscribe("syncsetup:status", this.setStatus);
		
		this.merge();
	},

	destroy: function() {
		this._super();
		app.events.unsubscribe("syncsetup:status", this.setStatus);
	},
	
	checkResults: function(container, callback) {
		if ( container.nestedFolders.length > 0 ) {
			PUI.alert(_("Whoa!\n\nWe noticed that you have folders that contain other folders. Google Reader does not support this.\n\nSo we flattened your folders a bit. Sorry about this."))
			.ok(callback);
		} else
			callback();
	},
	
	merge: function() {
		this.showLoading();
		
		var googleSync = app.sync.addGoogle();
		
		chain(app.sync.push, googleSync)
		.then(this.checkResults)
		.and(googleSync.install)
		.and(app.poller.forceUpdate)
		.end(this.mergeDone);
	},
	
	mergeDone: function() {
		this.hideLoading();
		var googleSync = app.sync.get("google");
		if ( googleSync.badFeeds.length ) {
			PUI.alert("Something went wrong with " + googleSync.badFeeds.length + " feeds");
			return;
		}
		this.vc.toHome();
	},
		
	showLoading: function() {
		this.template.element.find('form').addClass("loading");
	},
	
	hideLoading: function() {
		this.template.element.find('form').removeClass("loading");
	},
	
	setStatus: function(evt) {
		this.template.set('title', evt.text);
	}
});

;
Screen.RemoveSync = Controller.extend({
	template: 'screen#remove-sync',
	
	events: {
		'click .done': 'done',
		'click .info-link': 'openLink'
	},

	openLink: function(e) {
		UI.openTab(e.currentTarget.href);
	},
	
	start: function() {
		this.template.set('title', _('Removing Google Reader sync'));
		app.events.subscribe("unsync:status", this.setStatus);
		
		this.container = this.template.element.find('.remove-sync');
		this.list = this.template.element.find('.bad-feeds');
		this.withBadFeeds = this.template.element.find('.with-bad-feeds');
		this.doneButton = this.template.element.find('.done');
		
		this.doneButton.css('visibility', 'hidden');
		this.list.hide();
		this.withBadFeeds.hide();
	},
	
	destroy: function() {
		this._super();
		app.events.unsubscribe("unsync:status", this.setStatus);
	},
	
	setStatus: function(evt) {
		this.template.set('title', evt.text);
	},
	
	doneLoading: function() {
		this.doneButton.css('visibility', 'visible');	
		this.container.removeClass('loading');
	},

	setBadFeeds: function(feeds) {
		feeds.forEach(this.setItem);
		
		this.withBadFeeds.show();
		this.list.show();
	},
	
	setItem: function(feed) {
		this.template.addItem('bad-feeds', {
			title: feed.title,
			link: feed.path
		});
	},
	
	done: function() {
		this.vc.popScreen();
	}
});

;
Screen.NoStarred = Controller.extend({
	template: 'screen#no-starred',
	
	events: {
		'click .start-tutorial': 'startTutorial',
		'click .end-tutorial': 'endTutorial'
	},
	
	start: function() {
		var post = app.store.randomPost();
		
		// No posts? Make one up
		if ( ! post ) {
			post = app.user.createPost();
			post.is_read = 0;
			post.title = "The greatest RSS extension ever";
		}
		
		var item = this.template.addItem('posts', post);
		item.element.classList.add('hover');
		
		this.startButton = this.template.element.find('.start-tutorial');
		this.endButton = this.template.element.find('.end-tutorial');
		
		this.tutorial = this.template.element.find('.tutorial');
		this.clickToOpenArrow = this.template.element.find('.click-to-open');
		this.clickToStarArrow = this.template.element.find('.click-to-star');
		
		this.post = this.template.element.find('.tpl-list-item-post');
	},
	
	startTutorial: function() {
		this.startButton.addClass('hidden');
		this.tutorial.removeClass('hidden');
		
		this.template.element.addClass('in-tutorial');
		
		this.step1.delay(2000);
	},
	
	step1: function() {
		this.clickToOpenArrow.removeClass('hidden');
		
		this.step2.delay(1200);
	},
	
	step2: function() {
		this.clickToOpenArrow.addClass('hidden');
		this.post.addClass('opened');
		
		this.step3.delay(1000);
	},
	
	step3: function() {
		this.clickToStarArrow.removeClass('hidden');
		
		this.step4.delay(2000);
	},
	
	step4: function() {
		this.endButton.removeClass('hidden');
		this.clickToStarArrow.addClass('hidden');
	},
	
	endTutorial: function() {
		this.tutorial.addClass('hidden');
		this.startButton.removeClass('hidden');
		this.post.removeClass('opened');
		this.endButton.addClass('hidden');
		
		this.template.element.removeClass('in-tutorial');
	}
});
;
Screen.NoUnread = Controller.extend({
	template: 'screen#no-unread',
	
	start: function() {
	
	}
});
;
Screen.NoFeeds = Controller.extend({
	template: 'screen#no-feeds',
	
	events: {
		'click .tpl-count-group': 'follow',
		'click .open-google-reader': 'openGoogleReader',
		'click .open-sync-settings': 'openSyncSettings',
		'click .done': 'done'
	},
	
	start: function() {
		this.template.set('title', _("Or add som recommended feeds"));
		document.body.classList.remove("organize-mode");
		
		var feeds = [
			app.user.createFeed({title: "Feeder development blog", path: app.config.feederBlog, favicon: 'http://www.tumblr.com/favicon.ico'}),
			//app.user.createFeed({title: "Your Gmail", path: "https://mail.google.com/mail/u/0/feed/atom", favicon: 'https://mail.google.com/mail/u/0/images/favicon.ico'}),
			app.user.createFeed({title: "BBC News - Home", path: "http://feeds.bbci.co.uk/news/rss.xml", favicon: 'http://www.bbc.co.uk/favicon.ico'}),
			app.user.createFeed({title: "XKCD", path: "http://xkcd.com/rss.xml", favicon: 'http://xkcd.com/favicon.ico'})
		];
		
		feeds.forEach(function(feed) {
			feed.posts = [];
			feed.numUnread = 0;
			feed.numberOfFetchedPosts = app.user.preferences.get("global:postsDisplay");
		});
		
		this.doneButton = this.template.element.find(".bar-settings .done");
		
		feeds.forEach(this.addFeed);
		this.followChanged();
	},
	
	addFeed: function(feed) {
		feed.isStale = true;
		
		var item = this.template.addItem('feeds', feed);
		item.set('count', _('+ Follow'));
	},
	
	follow: function(e) {
		var feed = e.item.model;
		
		if ( ! app.user.hasFeedByPath(feed.path) ) {
			app.user.addFeed(feed.path, this.checkFeedAdd.andArguments(e.item));
			e.item.set('count', _('✔ Followed'));
		} else {
			app.user.removeFeed(app.user.feedBy('path', feed.path), this.followChanged);
			e.item.set('count', _('+ Follow'));
		}
	},
	
	checkFeedAdd: function(feed, item) {
		if ( ! feed ) {
			item.set('count', _('+ Follow'));
			PUI.alert("There was an error adding this feed.");
		}
		this.followChanged();
	},
	
	followChanged: function() {
		if ( app.user.hasFeeds() )
			this.doneButton.addClass("visible");
		else
			this.doneButton.removeClass("visible");
	},

	openGoogleReader: function() {
		this.vc.openSettingsPage("settings");
	},
	
	openSyncSettings: function() {
		this.vc.openSettingsPage("main", "highlightSyncSettings");
	},
	
	done: function() {
		fireCallback(this.onDone);
	}
});
;
Screen.NoPosts = Controller.extend({
	template: 'screen#no-posts',
	
	start: function() {
	
	}
});
;
Screen.Welcome = Controller.extend({
	template: 'screen#welcome',
	
	events: {
		'click .start-using-feeder': 'start using RSS Feed Reader huzzah!'
	},
	
	start: function() {
	
	},
	
	'start using RSS Feed Reader huzzah!': function() {
		this.template.element.addClass('byebye');
	}
});
;
Screen.Consume = Controller.extend({
	template: 'screen#popup-consume',

	events: {
		'click-or-touch .title': 'toggleStar',
		'click-or-touch .history-previous': 'goPrevious',
		'click-or-touch .history-next': 'goNext'
	},

	start: function(post) {
		this.initialPost = post;
	},

	onVisible: function() {
		this.setPost(this.initialPost);
	},

	setPost: function(post) {
		if (this.isInitialized || ! post || this.post === post)
			return;

		this.post = post;

		this.isInitialized = true;
		this.template.set("title", post.title);
		
		var consumeIframe = $('<iframe class="popup-consume-iframe">');
		consumeIframe.attr('src', post.getConsumePath());
		consumeIframe.css('height', Math.min($(window).height() - this.template.el('.bar').height() - 5), 400);

		this.template.el('iframe, x-iframe').replaceWith(consumeIframe);
		this.post.markAsRead();

		this.setStar();
	},

	toggleStar: function(e) {
		e.preventDefault();
		this.post.toggleStar();
		this.setStar();
	},

	setStar: function() {
		if (this.post.is_starred) {
			this.template.el('.bar').addClass('starred-post')
		} else {
			this.template.el('.bar').removeClass('starred-post')
		}
	},

	navigateTo: function(post) {
		this.isInitialized = false;
		this.setPost(post);
	},

	goPrevious: function() {
		this.vc.historyPrevious();
	},

	goNext: function() {
		this.vc.historyNext();
	}
});

;
var PUI = {};
;
PUI.Template = Class.extend({
	initialize: function(rootTemplate, attributes) {
		var uiElement = document.getElementById('ui');
		if ( ! uiElement )
			debugger;
		this.root = uiElement.contentDocument.getElementById(rootTemplate);
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
;
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
;
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
;
PUI.Draggable = Class.extend({
	initialize: function(el, options) {
		this.options = toOptions(options, {
			exclude: '',
			include: '',
			waitForDrag: false
		});
		
		this.handle.on('mousedown', this.mousedown);
	},
	
	destroy: function() {
		this.handle.off('mousedown', this.mousedown);
	},
	
	mousedown: function(e, forceIt) {
		if ( this.options.exclude && $(e.target).closest(this.options.exclude).length )
			return;
		
		if ( this.options.include && ! $(e.target).closest(this.options.include).length )
			return;
		
		e.preventDefault();
		
		this.bindDragEvents();
		this.started = false;
			
		if ( this.options.waitForDrag && ! forceIt )
			return;
		
		this.started = true;
		
		e.stopPropagation();
		
		this.el.addClass('in-drag');
		
		this.start = this.pointer = {x: e.pageX, y: e.pageY};
		
		this.onDragStart();
	},
	
	bindDragEvents: function() {
		this.startedDraggingAt = Date.now();
		$(window).on('mousemove', this.mousemove).on('mouseup', this.mouseup);
	},
	
	mousemove: function(e) {
		if ( ! this.started && this.options.waitForDrag ) {
			this.mousedown(e, true);
		}
		
		e.preventDefault();
		
		this.dir = {
			x: e.pageX - this.pointer.x > 0 ? 'right' : 'left',
			y: e.pageY - this.pointer.y > 0 ? 'down' : 'up'
		};
		
		this.pointer = {x: e.pageX, y: e.pageY};
		this.delta = {x: e.pageX - this.start.x, y: e.pageY - this.start.y};
		
		this.onDrag(this.delta);
	},
	
	mouseup: function(e) {
		e.preventDefault();

		$(window).off('mousemove', this.mousemove).off('mouseup', this.mouseup);
		
		if ( ! this.started )
			return;
		
		this.el.removeClass('in-drag');
		this.onDragEnd();
	},
	
	onDragStart: function() {},
	onDrag: function(delta) {},
	onDragEnd: function() {}
});
;
PUI.Sortable = PUI.Draggable.extend({
	initialize: function(el, sort, options) {
		this.sortOptions = toOptions(options, {
			onStart: function() {},
			onEnd: function() {},
			processGhost: function(ghost, sortable) { return ghost; }
		});
		
		this.sort = sort;
		
		this.el = $(el);
		this.handle = this.el;
		
		this._super(el, {
			exclude: options.exclude,
			include: options.include,
			waitForDrag: options.waitForDrag
		});
	},
	
	onDragStart: function() {
		this.startOffset = this.el.rect();
		
		this.ghost = this.sortOptions.processGhost(this.el.clone(), this)
		.css({
			position: 'absolute'
		})
		.css(this.startOffset)
		.addClass('ghost')
		.appendTo(document.body);
		
		this.el.addClass('in-sort');
		
		this.sort.onStart(this);
	},
	
	onDrag: function(delta) {
		this.ghost.css({
			left: this.startOffset.left + delta.x,
			top: this.startOffset.top + delta.y
		});
		
		this.sort.check(this)
	},
	
	onDragEnd: function() {
		this.sort.onEnd();
		
		this.ghost.remove();
		this.el.removeClass('in-sort');
		this.sortOptions.onEnd(this);
		
		this.sort.onDragEnd();
	}
});
;
PUI.YesNo = PUI.Draggable.extend({
	initialize: function(el) {
		this.el = $(el);
		this.yesNo = this.handle = this.el.find('.yes-no');
		
		this.maxLeft = -29; // Match this with the CSS-style
		
		this._super();
	},
	
	set: function(val) {
		var method = val ? 'removeClass' : 'addClass'; 
		this.yesNo[method]('is-no');
		
		fireCallback(this.onChangeCallback, !!val);
	},
	
	activate: function() {
		this.set(true);
	},
	
	deactivate: function() {
		this.set(false);
	},
	
	toggle: function() {
		this.set(!this.isToggled());
	},
	
	isToggled: function() {
		return !this.yesNo.hasClass('is-no');
	},
	
	onChange: function(callback) {
		this.onChangeCallback = callback;
	},
	
	onDragStart: function(e) {
		this.startLeft = parseInt(this.yesNo.css('margin-left'), 10);
	},
	
	onDrag: function(delta) {
		var left = this.startLeft + delta.x;
		this.yesNo.css('margin-left', Math.max(Math.min(left, 0), this.maxLeft) + 'px');
	},
	
	onDragEnd: function(e) {
		if ( Date.now() - this.startedDraggingAt > 250 ) {
			this.determineSetting();
			this.el.removeClass('in-drag');
		} else {
			// Unset margin-left so it reverts to what is set by stylesheet
			this.yesNo.css('margin-left', '');
			
			this.el.removeClass('in-drag');
			this.toggle();
		}
	},
	
	determineSetting: function() {
		var left = parseInt(this.yesNo.css('margin-left'), 10);
		this.yesNo.css('margin-left', '');
		this.set(left/this.maxLeft < 0.5);
	}
});
;
// This class is officially shit

PUI.Slider = PUI.Draggable.extend({
	initialize: function(el) {
		this.el = $(el).find('.slider');
		this.handle = this.el.find('.handle');
		this.bar = this.el.find('.current');
		
		this.sliderValues = this.el.closest('.tpl-slider').next('.slider-values').find('li');
		
		this._super();
		this.highlightActive(0);
	},
	
	set: function(value) {
		this.setActive(value);
		fireCallback(this.onChangeCallback, this.value);
	},
	
	onChange: function(callback) {
		this.onChangeCallback = callback;
	},
	
	onDragStart: function(e) {
		this.startWidth = parseInt(this.bar.css('width'), 10);
	},
	
	onDrag: function(delta) {
		var width = this.startWidth + delta.x;
		var position = Math.min(Math.max(width, 0), this.maxWidth());
		this.bar.css('width', position);
		
		var active = this.highlightActive(position);
		this.setActive(active.text());
	},
	
	highlightActive: function(position) {
		var sliderValues = $.makeArray(this.sliderValues);
		
		var refOffset = this.el.rect();
		var percent = position/this.maxWidth();
		
		var order = sliderValues.map(function(el, i) {
			var offset = $(el).rect();
			return {p: percent - ((offset.left + offset.width/2 - refOffset.left) / refOffset.width), el: el};
		}).sort(function(a, b) {
			if (Math.abs(a.p) == Math.abs(b.p))
				return 0;
			return Math.abs(a.p) > Math.abs(b.p) ? 1 : -1;
		});

		var active = order.shift().el;
		active.classList.add('highlighted');
		order.forEach(function(p) {
			p.el.classList.remove('highlighted');
		});
		
		return $(active); 
	},
	
	setActive: function(val) {
		this.sliderValues.removeClass('highlighted');
		
		var smallest = {diff: 1000000, el: false};
		for ( var i = 0, el; el = this.sliderValues[i]; i++ ) {
			el = $(el);
			var diff = Math.abs(val - el.text());
			if ( diff < smallest.diff ) {
				smallest.diff = diff;
				smallest.el = el;
			}
		}
		
		var w = Math.min(this.maxWidth(), Math.max(0, Math.round(smallest.el[0].offsetLeft - smallest.el.width()/2-7, 10))) + 'px';
		var w = smallest.el[0].offsetLeft;
		
		smallest.el.addClass('highlighted');
		this.bar.css('width', w + 'px');
		
		this.value = parseInt(smallest.el.text(), 10);
		fireCallback(this.onChangeCallback, this.value);
	},
	
	getActive: function() {
		return parseInt(this.sliderValues.filter('.highlighted'), 10);
	},
	
	maxWidth: function() {
		return this.el.width();
	}
});
;
PUI.Checkbox = Class.extend({
	initialize: function(el) {
		this.el = $(el);
		
		this.el.on('click', this.onClick);
	},
	
	set: function(checked) {
		if ( checked )
			this.el.addClass('checked');
		else
			this.el.removeClass('checked');
		
		var event = document.createEvent("HTMLEvents");
		event.initEvent("change", true, true);
		this.el[0].dispatchEvent(event);
	},
	
	isChecked: function() {
		return this.el.hasClass('checked');
	},
	
	toggle: function() {
		return this.set(!this.isChecked());
	},
	
	onClick: function(e) {
		e.preventDefault();
		e.stopPropagation();
		this.toggle();
	}
})
;
PUI.Sort = Class.extend({
	initialize: function(options) {
		this.options = toOptions(options, {
			droppable: false,
			dropAreas: [],
			onMove: function() {},
			onDrop: function() {},
			onDropArea: function() {},
			onEnd: function() {},
			sortOptions: {
				processGhost: function() {}
			}
		});
		
		this.sortables = [];
	},
	
	add: function(el) {
		this.sortables.push(new PUI.Sortable(el, this, this.options.sortOptions));
	},
	
	clear: function() {
		this.sortables = [];
	},
	
	onStart: function(sortable) {
		var globalDrops = [];
		
		PUI.Sort.drops.forEach(function(drop) {
			$(drop.selector).not('.ghost').forEach(function(el) {
				el = $(el);
				el.drop = drop;
				globalDrops.push(el);
			});
		});
		
		// Remove anything that can confuse sorting, for example, items in the current this.sortable
		this.globalDrops = globalDrops.filter(function(el) {
			return el[0] != sortable.el[0] && ! this.sortables.some(function(s) { return s.el[0] == el[0]; });
		}, this);
	},
	
	onEnd: function() {
		this.globalDrops = false;
	},
	
	check: function(sortable) {
		this.currentSortable = sortable;
		this.resetDroppable();
		
		for ( var i = 0, area; area = this.options.dropAreas[i]; i++ ) {
			if ( ! area.length || ! this.isOver(area, sortable) )
				continue;
			
			area.addClass('drop-over');
			this.currentDropArea = area;
			return;
		}
		
		for ( var i = 0, globalDrop; globalDrop = this.globalDrops[i]; i++ ) {
			if ( ! globalDrop || ! this.isOver(globalDrop, sortable) )
				continue;
			
			globalDrop.addClass('drop-over');
			this.currentGlobalDrop = {el: globalDrop, drop: globalDrop.drop};
			return;
		}
		
		for ( var i = 0, sort; sort = this.sortables[i]; i++ ) {
			if ( sort == sortable || sort.el.hasClass('in-sort') )
				continue;
			
			var rect = sort.el.rect();
			rect.bottom = rect.top + rect.height;
			rect.right = rect.left + rect.width;
			
			if ( sortable.pointer.y > rect.top && sortable.pointer.y < rect.bottom && sortable.pointer.x < rect.right && sortable.pointer.x > rect.left ) {
				var dir;
				
				var deltas = [0.4, 0.6];
				
				// If sorting is disabled the drop areas are bigger
				if ( this.options.disableSort )
					deltas = [1.0, 0.0];
				
				if ( this.options.droppable && sort.el.is(this.options.droppable) ) {
					var delta = (sortable.pointer.y - rect.top)/(rect.bottom-rect.top);

					if ( delta < deltas[0] || delta > deltas[1] ) {
						this.currentDroppable = sort;
						this.currentDroppable.el.addClass('drop-over');
						return;
					}
				}
				
				if ( this.options.disableSort )
					continue;
				
				if ( sortable.dir.y == 'down' ) {
					sortable.el.insertAfter(sort.el);
					dir = 'after';
				} else {
					sortable.el.insertBefore(sort.el);
					dir = 'before';
				}
				this.options.onMove(sortable, sort, dir);
				
				// Abort?
				return;
			}
		}
	},
	
	isOver: function(area, sortable) {
		var rect = area.rect();
		rect.bottom = rect.top + rect.height;
		rect.right = rect.left + rect.width;
			
		var x = sortable.pointer.x;
		var y = sortable.pointer.y;

		var res = x > rect.left && x < rect.right && y < rect.bottom && y > rect.top;

		return res;
	},
	
	resetDroppable: function() {
		if ( this.currentDroppable )
			this.currentDroppable.el.removeClass('drop-over');
		
		if ( this.currentDropArea )
			this.currentDropArea.removeClass('drop-over');
		
		if ( this.currentGlobalDrop )
			this.currentGlobalDrop.el.removeClass('drop-over');

		this.currentGlobalDrop = this.currentDropArea = this.currentDroppable = false;
	},
	
	onDragEnd: function() {
		if ( this.currentDroppable )
			this.options.onDrop(this.currentDroppable, this.currentSortable);
		
		if ( this.currentDropArea )
			this.options.onDropArea(this.currentDropArea, this.currentSortable);
		
		if ( this.currentGlobalDrop ) {
			this.currentGlobalDrop.drop.callback(this.currentGlobalDrop.el, this.currentSortable);
			this.resetDroppable();
			return;
		}
		
		this.resetDroppable();
		this.options.onEnd();
	}
});

PUI.Sort.drops = [];

PUI.Sort.addDrop = function(selector, func) {
	PUI.Sort.drops.push({selector: selector, callback: func});
};

;
PUI.Modal = Class.extend({
	initialize: function() {
		this.parent = $(document.body);
		this.makeContainer();
	},
	
	destroy: function() {
		if ( this.isDestroyed )
			return;
			
		this.isDestroyed = true;
		
		this.container.remove();
		this.overlay.remove();
		
		fireCallback(this.onDestroy);
	},
	
	makeContainer: function() {
		this.container = $('<div></div>').addClass('pui-modal').css({
			position: 'fixed',
			zIndex: '20'
		});
		this.container.appendTo(this.parent);
	},
	
	show: function() {
		this.container.show();
		this.position();
		
		this.addOverlay();
	},
	
	addOverlay: function() {
		this.overlay = $('<div class="pui-overlay"></div>').css({
			position: 'fixed',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			width: '100%',
			height: '100%',
			zIndex: '15'
		}).appendTo(this.parent);
	},
	
	position: function() {
		var rect = this.container.rect();
		
		var x = this.pointX ? this.pointX : $(window).width()/2 - rect.width/2;
		var y = this.pointY ? this.pointY : $(window).height()/2 - rect.height/2;
		
		this.container.css({
			left: x,
			top: y
		});
	},
	
	setText: function(text) {
		this.container.find('.pui-alert-text').html(text.replace(/\n/g, '<br>')).on('click', 'a', function() {
			UI.openTab(this.href);
		});
	}
});
;
PUI.Confirm = PUI.Modal.extend({
	initialize: function(text) {
		this._super();
		
		this.container.addClass('pui-confirm');
		this.container.append($('<div class="pui-confirm-text"></div>').html(text.replace(/\n/g, '<br>')));
		
		this.noButton = $('<div class="pui-button">No</div>').click(this.noClick).appendTo(this.container);
		this.yesButton = $('<div class="pui-button confirm">Yes</div>').click(this.yesClick).appendTo(this.container);

		$(window).on('keydown', this.keydown);
	},
	
	destroy: function() {
		this._super();
		$(window).off('keydown', this.keydown);
	},
	
	keydown: function(e) {
		if (e.keyCode != 13)
			return;
		
		this.yesClick();
	},
	
	yesClick: function() {
		this.destroy();
		fireCallback(this.yesCallback);
	},
	
	noClick: function() {
		this.destroy();
		fireCallback(this.noCallback);
	},
	
	yes: function(func) {
		this.yesCallback = func;
		return this;
	},
	
	no: function(func) {
		this.noCallback = func;
		return this;
	}
});

PUI.confirm = function(text) {
	var win = new PUI.Confirm(text);
	win.show();
	return win;
};
;
PUI.Alert = PUI.Modal.extend({
	initialize: function(text) {
		this._super();
		
		this.container.addClass('pui-alert');		
		this.container.append($('<div class="pui-alert-text"></div>'));
		this.container.append($('<div class="pui-button">Okay</div>').click(this.onClick));
		
		this.setText(text);
	},
	
	onClick: function() {
		this.destroy();
		fireCallback(this.okCallback);
	},
	
	ok: function(func) {
		this.okCallback = func;
		return this;
	}
});

PUI.alert = function(text) {
	var win = new PUI.Alert(text);
	win.show();
	return win;
};

PUI.alertLoader = function(text) {
	var win = new PUI.Alert(text);
	win.container.addClass('pui-loading');
	win.show();
	return win;
}
;
PUI.Prompt = PUI.Confirm.extend({
	initialize: function(text) {
		this._super(text);
		
		this.container.addClass('pui-confirm');
		
		var textElement = this.container.find('.pui-confirm-text');
		this.input = $('<div class="pui-prompt-text"><input type="text" /></div>').insertAfter(textElement).find('input');
		this.input.on('keydown', this.onKeyDown);
		
		this.yesButton.text("OK");
		this.noButton.text("Cancel");
	},
	
	onKeyDown: function(e) {
		if ( e.keyCode !== 13 )
			return; 
		
		e.preventDefault();
		e.stopPropagation();
		
		if ( this.input.val().length > 0 )
			this.yesClick();
	},
	
	show: function() {
		this._super();
		this.input.focus();
	},
	
	yesClick: function() {
		this.destroy();
		fireCallback(this.yesCallback, this.input.val());
	},
	
	done: function(callback) {
		this.yesCallback = callback;
	}
});

PUI.prompt = function(text) {
	var modal = new PUI.Prompt(text);
	modal.show();
	return modal;
}
;
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
			
		document.body.classList[this.queue.length ? 'add' : 'remove']('in-queue');
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

;
PUI.ContextMenu = Class.extend({
	initialize: function(data, parent, x, y, options) {
		options = options || {};

		this.destroyOnHide = typeof options.destroyOnHide === "undefined" ? true : options.destroyOnHide;
		this.elementPosition = typeof options.elementPosition === "undefined" ? false : options.elementPosition;

		this.parent = $(parent || document.body);
		this.x = x;
		this.y = y;
		this.marginLeft = options.marginLeft || 0;
		this.marginTop = options.marginTop || 0;
		this.create();
		
		this.extraMargin = 30;

		for ( var key in data ) {
			this.addLink(key, data[key]);
		}
	},
	
	destroy: function() {
		this.container.remove();
	},
	
	create: function() {
		this.container = $('<div class="tooltip context-menu"></div>');
		this.container.appendTo(this.parent);
		this.container[0].ctxMenu = this;
		this.container.css({top: -1000, left: 0});
	},
	
	show: function() {
		this.hideAll();
		
		this.reposition();
		setTimeout(function() { this.container.addClass('is-active'); }.bind(this), 10);
		setTimeout(function() { this.container.addClass('show').css({top: this.y}) }.bind(this), 20);
		
		window.addEventListener('click', this.hideEvent, true);
		
		this.adjustDocumentSize();
	},
	
	hideEvent: function(e) {
		e.preventDefault();
		
		if ( ! this.container.find('*').get().contains(e.target) || ! $(e.target).closest('.tooltip-item').length )
			e.stopPropagation();

		this.hide();
	},
	
	hide: function() {
		this.container.removeClass('show');
		window.removeEventListener('click', this.hideEvent, true);
		
		this.revertDocumentSize();

		if ( this.destroyOnHide )
			this.destroy.delay(500);
	},
	
	hideAll: function() {
		$('.tooltip').get().forEach(function(el) {
			if ( el.ctxMenu && el.ctxMenu !== this )
				el.ctxMenu.hide();
		}, this);
	},
	
	addLink: function(text, callback) {
		var link = $('<div class="tooltip-item"></div>');
		
		// Replace "balbla [classes foo bar]" with "balbla"
		var classes = "";
		text = text.replace(/\[.*\]/, function(a) {
			classes = a.split(/\[|\]/)[1];
			return "";
		})

		link.addClass(classes);

		if ( text.match(/^--/) ) {
			link.addClass('separator');
			link.html('<span>...</span>');
		} else {
			link.html(text);
		}
		
		link.appendTo(this.container);
		link.on('click', this.itemClicked.withCallback(callback));
	},
	
	itemClicked: function(e, callback) {
		e.preventDefault();
		e.stopPropagation();
		fireCallback(callback, {item: this.item});
		this.hide();
	},

	reposition: function() {
		var x = this.x;
		var y = this.y;
		
		if (this.elementPosition) {
			var r = this.elementPosition.rect();
			x = r.left + r.width/2;
			y = r.top + r.height/2;
		}

		var containerSize = this.container.rect();

		// If bottom
		if ( y + containerSize.height > window.innerHeight && y - $(window).scrollTop() - containerSize.height > 0  ) {
			y -= containerSize.height;
			this.container.addClass("bottom");
		} else {
			this.container.addClass("top");
		}
		
		// Check bounds x
		if ( x + containerSize.width > window.innerWidth ) {
			this.container.addClass("right");
		}
		
		this.x = x + this.marginLeft;
		this.y = y + this.marginTop;
		
		this.container.css({
			left: this.x,
			top: this.y
		});
	},
	
	adjustDocumentSize: function() {
		var rect = this.container.rect();
		var bottom = rect.top + rect.height;
		
		if (document.body.clientHeight > bottom)
			return;
		
		$(document.body).css('height', bottom + this.extraMargin);
		this.adjustedDocument = true;
	},
	
	revertDocumentSize: function() {
		if (! this.adjustedDocument)
			return;
		$(document.body).css('height', '');
	}
});

;
PUI.FollowButton = Class.extend({
	initialize: function(el) {
		this.el = $(el);
		this.isFollowing = !! this.el.find(".following").attr("data-following");
		
		this.setClass();
		
		this.el.on('click', this.clicked);
	},
	
	set: function(isFollowing) {
		this.isFollowing = isFollowing;
		this.setClass();
	},
	
	setClass: function() {
		if ( this.isFollowing )
			this.el.addClass("is-following");
		else
			this.el.removeClass("is-following");
	},
	
	clicked: function(e) {
		e.preventDefault();
		this.set(!this.isFollowing);

		
		var event = document.createEvent("HTMLEvents");
		event.initEvent("change", true, true);
		this.el[0].dispatchEvent(event);
	},
	
	get: function() {
		return this.isFollowing;
	}
});
;
dataHook('count .tpl-count-group .count', function(count, element) {
	if ( ! count )
		$(element).closest('.tpl-count-group').hide();
	else
		$(element).closest('.tpl-count-group').show();
	
	$(element).closest('.list-item')[!count ? 'removeClass' : 'addClass']('has-unread');
});

dataHook('starred .item', function(starred, element) {
	element.classList[starred ? 'add' : 'remove']('is-starred');
});

translateHook('post', function(post, callback) {
	callback({
		title: post.title,
		link: post.link,
		count: post.is_read ? "" : _("NEW"),
		starred: post.is_starred,
		favicon: app.user.feed(post.feed_id) ? app.user.feed(post.feed_id).favicon : app.config.defaultFavicon()
	});
});

translateHook('feed', function(feed, callback) {
	var data = {
		title: feed.title || "error",
		favicon: feed.favicon || "",
		link: feed.link || "",
		count: 0
	};
	
	if (feed.isStale)
		return callback(data);
	
	chain(feed.countUnread)
	.then(function(unread) {
		data.count = unread;
		callback(data);
	});
});

translateHook('folder', function(folder, callback) {
	chain(folder.countUnread)
	.then(function(unread) {
		callback({
			folder: folder,
			title: folder.name,
			favicon: app.config.images.folder,
			count: unread
		});
	});
});
;
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
		console.log("message for:", method, evt);
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
		this.listeners[model.model][model.id].remove(func);
	},
	
	send: function(type, data) {
		var event = new CustomEvent(type, data);
		event.initCustomEvent(type, true, true, data);
		this.element.dispatchEvent(event);
	}
});
;
var ViewController = Class.extend({
	animationDuration: 300,

	initialize: function(containerId) {
		this.container = typeof containerId === "string" ? document.getElementById(containerId) : containerId;
		this.screenStack = [];
		this.animationCallbacks = [];

		this.listener = new EventListener(this.container);
	},
	
	onScreenChange: function() {},

	isPopup: function() {
		return isPopup;
	},
	
	setCurrentScreen: function(page, callback) {
		window.scrollTo(0, 0);
		
		if ( this.currentScreen ) {
			this.currentScreen.onOff();
		
			// Destroy old screen if it isn't used anymore
			this.currentScreen.destroy();
		}
			
		this.currentScreen = page;
		
		if (!$(this.container).children().is(page.template.container)) {
			this.container.appendChild(page.template.container);
		}

		page.onVisible();

		if ( this.screenStack.length )
			this.serializeStackObject(this.screenStack.length-1);
		
		this.screenStack.push(page);
		page.onCurrent();

		this.listener.send("screen:navigate", {page: this.currentScreen});
		
		this.refreshWindowHeight();
		
		if ( window.parent && typeof window.parent.onScreenChange === "function" ) {
			window.parent.onScreenChange(page);
		}
		
		fireCallback(callback);
	},
	
	pushScreen: function(page, callback) {
		this.slideHScreen(this.currentScreen, page, 'in', callback);
	},
	
	popScreen: function(callback) {
		var from = this.screenStackPop();
		if ( ! from )
			return;
		this.slideScreen(from._inFunc || "h-animation", from, this.screenStackPop(), 'out', callback);
	},

	slideHScreen: function(from, to, dir, callback) {
		this.slideScreen('h-animation', from, to, dir, callback);
	},

	slideVScreen: function(from, to, dir, callback) {
		this.slideScreen('v-animation', from, to, dir, callback);
	},
	
	slideScreen: function(type, from, to, dir, callback) {
		window.scrollTo(0, 0);		

		if ( dir == 'in' )
			to._inFunc = type;
		
		if ( this.disableScreenAnimation || window.nooooo )
			return this.setCurrentScreen(to, callback);

		var cont = $(this.container).addClass(type);
		cont.addClass("in-progress").addClass("viewcontroller-animated");
		
		this.container.appendChild(to.template.container);
		
		if (dir == 'out')
			cont.addClass('reverse-animation')

		var old = $(from.template.container).addClass("out");
		var next  = $(to.template.container).addClass('in');

		var emptyRect = {'width': '', 'height': ''};
		var oldRect = old.sizeRect();
		var windowHeight = $(window).height();

		var maxRect = {width: oldRect.width, height: windowHeight};

		document.body.style.minHeight = maxRect.height + "px";
		next.css(maxRect);
		$(this.container).css(maxRect).css('overflow', 'hidden');

		// Start animation
		setTimeout(function() {
			var oldClass = cont[0].className;
			oldClass = oldClass.replace("in-progress", "");
			oldClass = oldClass + " in-animation";
			cont[0].className = oldClass;
		}, 10);
		// end Start animation

		function onTransitionEnd(e) {
			if (e && ! [old[0], next[0]].contains(e.target)) 
				return;
			onComplete();
			removeTransitionEndEvent(cont[0], onTransitionEnd);
		}
		
		if ( Modernizr.csstransitions ) {
			addTransitionEndEvent(cont[0], onTransitionEnd);
		} else {
			setTimeout(function() { onTransitionEnd(); }, 20);
		}

		setTimeout(function() {
			this.inAnimation = true;
			this.onScreenChange();
		}.bind(this), 0);

		var onComplete = function() {
			this.animationDone();
			
			this.setCurrentScreen(to, callback);

			document.body.style.minHeight = '';
			cont.removeClass('in-animation ' + type + ' reverse-animation viewcontroller-animated');
			next.removeClass('in').css(emptyRect);
			$(this.container).css(emptyRect).css('overflow', '');
		}.bind(this);
	},
	
	setWindowHeight: function(height) {
		if (Ext.isChrome() || Ext.isSafari()) {
			//this.container.style.height = height ? height + "px" : '';
		}
		
		if ( window.parent && typeof window.parent.onHeightChange === "function" ) {
			window.parent.onHeightChange($(this.container).height());
		}
	},
	
	// Only wait for animation complete if on a touch/mobile device, because it's mostly for slow devices that we do this
	addAnimationDoneCallback: function(callback, args) {
		if (!this.inAnimation || ! Modernizr.touch)
			return callback.apply(this, args);
		this.animationCallbacks.push([callback, args]);
	},

	animationDone: function() {
		this.inAnimation = false;
		while (this.animationCallbacks.length) {
			var callback = this.animationCallbacks.pop();
			callback[0].apply(this, callback[1]);
		}
	},

	refreshWindowHeight: function() {
		this.setWindowHeight(false);
	},
	
	slideUpScreen: function(page, callback) {
		this.slideVScreen(this.currentScreen, page, 'in', callback);
	},
	
	toHome: function(callback) {
		if ( this.screenStack.length > 1 )
			this.popScreen(this.toHome.withCallback(callback));
		else
			fireCallback(callback);
	},
	
	toIndex: function(i) {
		var numPages = (this.screenStack.length-1) - i;
		if ( numPages <= 0 )
			return;
		
		this.popScreen(this.toIndex.andArguments(i));
	},
	
	serializeStackObject: function(index) {
		var page = this.screenStack[index];
		if ( typeof page.id !== "function" )
			return;
		this.screenStack[index] = page.id();
	},
	
	screenStackPop: function() {
		var page = this.screenStack.pop();
		return this.unserializeStackObject(page);
	},
		
	unserializeStackObject: function(page) {
		if ( page && page.template )
			return page;
		
		if ( ! page || typeof page.id === "undefined" )
			return false;

		return TRYIT(function() {
			var klass = Screen[page.id];
			page = klass.fromId(page);

			return page;
		});
	},
	
	/*
		Pages
	*/
	
	pushFeed: function(feed) {
		Screen.currentVC = this;
		
		var page = new Screen.Posts(feed);
		this.pushScreen(page);
	},
	
	pushFolder: function(folder, callback) {
		Screen.currentVC = this;
		
		var page = new Screen.Folder(folder);
		this.pushScreen(page, callback);
	},
	
	pushToFolders: function(folder) {
		var queue = folder.getStructure().reverse();
		queue.shift();
		
		var pushFolder = this.pushFolder;
		this.toHome(function done() {
			if (! queue.length )
				return;
			pushFolder(queue.shift(), done);
		});
	},
	
	showAddScreen: function() {
		Screen.currentVC = this;
		
		var page = new Screen.Add();
		this.slideUpScreen(page);
	},
	
	showSettingsScreen: function(feed) {
		Screen.currentVC = this;
		
		var page = Screen.Settings;
		if ( feed )
			page = feed.isFeed ? Screen.SettingsFeed : Screen.SettingsFolder;

		page = new (page)(feed, this.currentScreen.folder);
		this.slideUpScreen(page);
		
		return page;
	},
	
	showGoogleReader: function() {
		Screen.currentVC = this;
		
		this.pushScreen(new Screen.GoogleReader());
	},
	
	showSyncSelect: function(subscriptions) {
		Screen.currentVC = this;
		
		this.pushScreen(new Screen.SyncSelect(subscriptions));
	},
	
	openSettingsPage: function(page, method, opts) {
		var url = Ext.path("options/options.html?page=" + page + "&run=" + method + '&' + objectToQueryString(opts || {}));
		if ( Ext.isSafari() ) {
			document.body.style.WebkitTransition = "opacity 300ms";
			setTimeout(function() {
				document.body.style.opacity = "0";
			}, 0);
			setTimeout(function() {
				UI.setPopupSize(app.config.optionsPageSize.width, app.config.optionsPageSize.height);
				document.location.href = url;
			}, 300);
			return;
		}
		UI.openTab(url);
		window.close();	
	},

	setContainerHeight: function(cont, suggestedHeight) {
		var height = $(window).height();
		if (Ext.isChrome())
			height = suggestedHeight;
		cont.css('height', height);
	}
});

;
var ActionHistory = Class.extend({
	initialize: function() {
		this.reset();

		this.wrapAround = true;
		this.onEndCallback = function() {};
		this.onStartCallback = function() {};
	},

	reset: function() {
		this.list = [];
		this.index = -1;
	},

	addAction: function(action) {
		this.list.push(action);
	},

	setActiveAction: function(action) {
		this.index = this.list.indexOf(action);
	},

	next: function() {
		this.byOffset(1);
		return this.current();
	},

	previous: function() {
		this.byOffset(-1);
		return this.current();
	},

	current: function() {
		return this.list[this.index];
	},

	byOffset: function(offset) {
		this.index += offset;

		if (this.wrapAround) {
			if (this.index >= this.list.length)
				this.index = 0;
			else if (this.index < 0)
				this.index = this.list.length - 1;
		} else {
			if (this.index >= this.list.length) {
				this.index = this.list.length - 1;
				this.onEndCallback();
			} else if (this.index < 0) {
				this.index = 0;
				this.onStartCallback();
			}
		}
	},

	onEnd: function(callback) {
		this.onEndCallback = callback;
	},

	onStart: function(callback) {
		this.onStartCallback = callback;
	}
});
;
if ( navigator.userAgent.toLowerCase().indexOf('chrome') > -1 ) { // lol
	if ( ! chrome.extension ) // lol
		chrome.extension = window.parent.chrome.extension; // lol
} // lol

var app, Platform, UI;

// -- PLACEHOLDER TRANSLATION FUNCTION
function _(a) {
	var args = Array.prototype.slice.call(arguments, 1);
	return a.replace(/%s/g, function() {
		return args.shift();
	});
}
// -- END PLACEHOLDER

var isPopup = false;
var isLoaded = false;
var isLoadedDone = false;

function runOnLoad(callback) {
	Init.callbacks.push(callback);
}

function trackSafariPageView() {
	if (! Ext.isSafari())
		return;
	_gaq.push(['_trackPageview']);
}

function reloadProClasses() {
	if (app.user.isPro() || Ext.isOnline()) {
		document.body.classList.add("is-pro");
	} else {
		document.body.classList.remove("is-pro");
	}
}

var Init = {
	callbacks: [],

	// In this method the backend might not even exist yet, nor has the popup fully loaded
	start: function() {
		Init.errorHide();

		if ( Init.backendDoesntExistYet() ) {
			Init.reloadWaitingForBackendToExist();
			return;
		}

		if ( Init.backendPageHasntEvenLoadedYet() ) {
			Ext.getBackgroundPage().addEventListener('load', function() {
				Init.start();
			});
			return;
		}

		if (Ext.isSafari())
			window.addEventListener('unload', Init.safariPopupCleanup, false);

		window.addEventListener('load', Init.onDOMLoad, false);
	},

	// In this page the popup has fully loaded, but we don't know if the backend is here yet
	// It might be that the backend is error'd
	onDOMLoad: function() {
		// Check that the UI frame has loaded
		var okUIFrame = Init.initUIFrame();

		if (! okUIFrame)
			return;

		if (Ext.isMobile())
			Init.mobileHideScrollBars();

		window.isLoaded = true;
		
		setTimeout(function() {
			window.isLoadedDone = true;
		}, 50);
		
		Init.removeLoader();

		Ext.getBackgroundPage().onAppReady(Init.onAppReady, Init.backendShowIsLoading);
	},

	// On this page the backend is loaded and exists, but it might still be errored
	onAppReady: function() {
		if (Init.backendIsInBrokenState())
			return Init.askBackendToRetryInitialize();

		Init.initGlobalVariables();
		reloadProClasses();
	
		if ( Ext.isChrome() )
			Init.chromeFixPortScopingIssues();
		
		if (Ext.isSafari())
			Init.safariSetPageViewTracking();
		
		Init.removeLoader();
		Init.errorHide();

		Init.fireCallbacks();
	},

	initUIFrame: function() {
		var frame = document.getElementById("ui");
		
		if ( ! frame.contentWindow.isLoaded ) {
			// Wait till UI frame has signaled that it is ready, then retry the load process
			window.onUILoad = Init.onDOMLoad;
			return false;
		}

		return true;
	},

	initGlobalVariables: function() {
		app = Ext.getBackgroundPage().app;
		Platform = Ext.getBackgroundPage().Platform;
		UI = Ext.getBackgroundPage().UI;
	},

	fireCallbacks: function() {
		for (var i = 0; i < Init.callbacks.length; i++)
			Init.callbacks[i]();
	},

	backendIsInBrokenState: function() {
		return Ext.getBackgroundPage().app.isFailedState();
	},

	askBackendToRetryInitialize: function() {
		Init.backendShowIsLoading();
		Ext.getBackgroundPage().app.retryInitialize(function(succeeded) {
			if (! succeeded) {
				Init.errorShow();
				Init.removeLoader()
				return;
			}
			Init.onAppReady();
		});
	},

	mobileHideScrollBars: function() {
		$('#popup-content').css('min-height', $(window).height() + 60);
		window.scrollTo(0, 0);
	},

	safariSetPageViewTracking: function() {
		Platform.env.onPopoverVisible(trackSafariPageView);
	},

	safariPopupCleanup: function() {
		Platform.env.removePopoverVisible(trackSafariPageView);
	},

	chromeFixPortScopingIssues: function() {
		// Ugly hack because Chrome sucks
		Ext.getBackgroundPage().PlatformPort.chrome.prototype.initialize = function(port) {
			this.port = port || chrome.extension.connect();
		};
		// \Ugly hack because Chrome sucks
	},

	backendShowIsLoading: function() {
		if (document.getElementById("ERROR"))
			document.getElementById("ERROR").style.display = "none";
		
		Init.loader = document.getElementById('backend-is-loading');
		Init.loader.style.display = "block";
		
		Init.loaderErrorTimer = setTimeout(function() {
			Init.removeLoader();
			Init.errorShow();
		}, 20*1000);
	},

	removeLoader: function() {
		if ( ! Init.loader )
			return;

		Init.loader.style.display = "none";
		clearTimeout(Init.loaderErrorTimer);
	},

	errorHide: function() {
		if (document.getElementById("ERROR"))
			document.getElementById("ERROR").style.display = "none";
	},

	errorShow: function() {
		if ( document.getElementById("ERROR") )
			document.getElementById("ERROR").style.display = "block";
	},

	backendDoesntExistYet: function() {
		return ! Ext.isOnline() && (! Ext.getBackgroundPage() || ! Ext.getBackgroundPage().onAppReady);
	},

	backendPageHasntEvenLoadedYet: function() {
		return Ext.isOnline() && ! Ext.getBackgroundPage().onAppReady;
	},

	reloadWaitingForBackendToExist: function() {
		setTimeout(function() {
			document.location.reload();
		}, 5000);
	}
};


Init.start();
;
if (Ext.isOnline()) {
	document.body.classList.add("fat-top-bar");
}

if (Ext.isChrome()) {
	document.body.classList.add("transition-transform-bug");
} else {
	document.body.classList.add("no-transition-transform-bug");
}

if (Modernizr.touch) {
	document.body.classList.add("touch");
} else {
	document.body.classList.add("no-touch");
}
;
var Popup = ViewController.extend({
	initialize: function() {
		this._super('popup-content');
		
		this.refreshTheme();
		
		this.setCurrentFilter(app.user.preferences.get('popup:filter') || "all");
		
		this.outerContainer = document.getElementById('popup');
		
		// Add head
		this.head = new PUI.Template('popup#head');
		this.outerContainer.insertBefore(this.head.container, this.container);
		
		this.queue = new PUI.LinkQueue(this.head.element.find('#link-queue'));
		this.queue.setListener(this.queueChanged)
		
		window.addEventListener('unload', this.onUnload, false);
		if (Ext.isSafari()) {
			window.addEventListener('blur', this.onPopupHide, true);
		}
		
		// Add a popupVisible event for Safari, which never unloads the popup
		Platform.env.onPopoverVisible(this.onPopupVisible);
		
		// Listen for feeder:connect changes to set/unset "is-pro" class
		this.listener.listen("feeder:connect", this.feederConnectChanged);
		
		if ( this.isPopup() )
			$(Ext.isSafari() ? '#main-scroll' : document).on('scroll', this.onScroll);

		window.addEventListener('keydown', this.onKeyDown, false);

		this.showNotification();

		// History actions is a list of posts, feeds or folders that should be navigate:able with keyboard navigation
		this.history = new ActionHistory();
	},
	
	start: function() {
		if ( ! this.hasStoredScreenChain() || ! this.rememberScreenChain() )
			this.setCurrentScreen(new Screen.Main());
	},
	
	onUnload: function() {
		this.queue.pump();
		this.queue.queue = [];
		
		this.listener.unlisten("feeder:connect", this.feederConnectChanged);
		
		$(Ext.isSafari() ? '#main-scroll' : document).off('scroll', this.onScroll);
		this.queue.removeListener(this.queueChanged);
		
		Platform.env.removePopoverVisible(this.onPopupVisible);
	},
	
	onPopupVisible: function() {
		setTimeout(function() { window.focus(); }, 1000);
		this.currentScreen.onPopupVisible();
	},
	
	onPopupHide: function() {
		this.queue.pump();
		this.queue.queue = [];
		
		if ( this.currentScreen && typeof this.currentScreen.onPopupHide === "function" )
			this.currentScreen.onPopupHide();
	},
	
	feederConnectChanged: function() {
		if (app.user.isPro())
			document.body.classList.add("is-pro");
		else
			document.body.classList.remove("is-pro");
	},
	
	refreshTheme: function() {
		var theme = queryStringGet('theme') || app.user.preferences.get('activeTheme');
		app.user.preferences.allThemes.forEach(function(t) {
			document.body.classList.remove(t.identifier);
		});
		document.body.classList.add(theme);
	},
	
	// screenChain related
	
	storeScreenChain: function() {
		var stack = this.screenStack.map(function(page) {
			var id = typeof page.id !== "function" ? false : page.id();
			if ( ! id )
				return page;
			return page.id();
		});
		localStorage.screenChain = JSON.stringify(stack);
	},
	
	forgetScreenChain: function() {
		localStorage.removeItem("screenChain");
	},
	
	rememberScreenChain: function() {
		var stack = JSON.parse(localStorage.screenChain);
		this.forgetScreenChain();
		
		for (var i = 0, page; page = stack[i]; i++ ) {
			var klass = Screen[page.id];
			var page = klass.fromId(page);
			if ( ! page )
				return false;
			this.screenStack.push(page);
		}
		this.setCurrentScreen(this.screenStack.pop());
		return true;
	},
	
	hasStoredScreenChain: function() {
		try {
			JSON.parse(localStorage.screenChain);
			return true;
		} catch (e) {}
		return false;
	},
	
	setCurrentFilter: function(name, func, postFilter) {
		this.currentFilter = name;
		app.user.preferences.set('popup:filter', name);
	},
	
	onScroll: function() {
		if ( this.queue.isEmpty() || this.inAnimation )
			return;

		this.setBarTop();
	},

	setBarTop: function() {
		var maxY = 33;
		var minY = 2;

		var scrollY = Ext.isSafari() ? document.getElementById('main-scroll').scrollTop : window.scrollY;
		var top = Math.min(Math.max(minY, maxY-scrollY), maxY);
		
		$('.bar.bottom, .bar.top').css('top', top + 'px !important');
	},
	
	onScreenChange: function() {
		this.disableTopBar();
	},
	
	disableTopBar: function() {
		$('.bar.bottom, .bar.top').css('top', '');
		document.body.classList.remove("at-top");
	},
	
	queueChanged: function() {
		if ( this.queue.isEmpty() ) {
			this.disableTopBar();
		}
	},

	onKeyDown: function(e) {
		onKeyDownEvent(e, this);
	},

	showNotification: function() {
		this.notification = $('#notifications');
		this.notification.on('click', this.noteClicked);

		if (app.notifications.current && ! app.user.isPro()) {
			this.notification.find('div').html(app.notifications.current);
			document.body.classList.add("with-notifications");
		} else {
			document.body.classList.remove("with-notifications");
		}
	},

	noteClicked: function(e) {
		e.preventDefault();
		if ($(e.target).closest('.close').length) {
			document.body.classList.remove("with-notifications");
			app.notifications.hideCurrent();
			return;
		}
		UI.openTab(this.notification.find('a').attr('href'));
	},

	historyNext: function() {
		var action = this.history.next();
		this.currentScreen.navigateTo(action);
	},

	historyPrevious: function() {
		var action = this.history.previous();
		this.currentScreen.navigateTo(action);
	},

	navForward: function() {
		this.currentScreen.navForward(this.history.current());
	},

	navBack: function() {
		this.currentScreen.back();
	}
});

runOnLoad(function() {
	isPopup = true;
	
	popup = Screen.currentVC = new Popup();
	popup.start();
});
;
setTimeout(function() {
    var script = document.createElement('script');
    script.async = true;
    script.src = '../library/js/analytics.js';
    document.body.appendChild(script);
}, 500);
;
var VALID_KEYS = {
	38: "up", // up
	40: "down", // down
	75: "up", // k
	74: "down", // j
	8: "back", // backspace
	13: "forward", // enter
	32: "forward", // space
	76: "forward", // l
	72: "back" // h
};

function validNavigationEvent(e) {
	var target = $(e.target);

	// Don't do anything when in input fields
	if (target.closest('input, textarea').length)
		return false;
	
	return !!VALID_KEYS[e.keyCode];
}

function eventNavigationDirection(e) {
	return VALID_KEYS[e.keyCode];
}

function onKeyDownEvent(e, vc) {
	if (! validNavigationEvent(e))
		return;
	
	e.preventDefault();

	var dir = eventNavigationDirection(e);

	if (dir === "up")
		vc.historyPrevious();
	else if (dir === "down")
		vc.historyNext();
	else if (dir === "forward")
		vc.navForward();
	else if (dir === "back")
		vc.navBack();
}