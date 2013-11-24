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
if (!nativeBind) {
	Function.prototype.bind = function(b) {
		var func = this;
		var ret = function() {
			return func.apply(b, arguments);
		};
		ret.toString = function() {
			return 'BOUND(' + func.toString() + ')';
		};
		return ret;
	};
}

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