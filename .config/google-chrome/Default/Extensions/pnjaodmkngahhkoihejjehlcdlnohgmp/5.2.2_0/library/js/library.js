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