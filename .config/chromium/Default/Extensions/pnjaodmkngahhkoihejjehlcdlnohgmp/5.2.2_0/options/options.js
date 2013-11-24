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
/*! jQuery v1.10.1 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license
*/
(function(e,t){var n,r,i=typeof t,o=e.location,a=e.document,s=a.documentElement,l=e.jQuery,u=e.$,c={},p=[],f="1.10.1",d=p.concat,h=p.push,g=p.slice,m=p.indexOf,y=c.toString,v=c.hasOwnProperty,b=f.trim,x=function(e,t){return new x.fn.init(e,t,r)},w=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,T=/\S+/g,C=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,N=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,k=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,E=/^[\],:{}\s]*$/,S=/(?:^|:|,)(?:\s*\[)+/g,A=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,j=/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,D=/^-ms-/,L=/-([\da-z])/gi,H=function(e,t){return t.toUpperCase()},q=function(e){(a.addEventListener||"load"===e.type||"complete"===a.readyState)&&(_(),x.ready())},_=function(){a.addEventListener?(a.removeEventListener("DOMContentLoaded",q,!1),e.removeEventListener("load",q,!1)):(a.detachEvent("onreadystatechange",q),e.detachEvent("onload",q))};x.fn=x.prototype={jquery:f,constructor:x,init:function(e,n,r){var i,o;if(!e)return this;if("string"==typeof e){if(i="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&e.length>=3?[null,e,null]:N.exec(e),!i||!i[1]&&n)return!n||n.jquery?(n||r).find(e):this.constructor(n).find(e);if(i[1]){if(n=n instanceof x?n[0]:n,x.merge(this,x.parseHTML(i[1],n&&n.nodeType?n.ownerDocument||n:a,!0)),k.test(i[1])&&x.isPlainObject(n))for(i in n)x.isFunction(this[i])?this[i](n[i]):this.attr(i,n[i]);return this}if(o=a.getElementById(i[2]),o&&o.parentNode){if(o.id!==i[2])return r.find(e);this.length=1,this[0]=o}return this.context=a,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):x.isFunction(e)?r.ready(e):(e.selector!==t&&(this.selector=e.selector,this.context=e.context),x.makeArray(e,this))},selector:"",length:0,toArray:function(){return g.call(this)},get:function(e){return null==e?this.toArray():0>e?this[this.length+e]:this[e]},pushStack:function(e){var t=x.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e,t){return x.each(this,e,t)},ready:function(e){return x.ready.promise().done(e),this},slice:function(){return this.pushStack(g.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0);return this.pushStack(n>=0&&t>n?[this[n]]:[])},map:function(e){return this.pushStack(x.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:h,sort:[].sort,splice:[].splice},x.fn.init.prototype=x.fn,x.extend=x.fn.extend=function(){var e,n,r,i,o,a,s=arguments[0]||{},l=1,u=arguments.length,c=!1;for("boolean"==typeof s&&(c=s,s=arguments[1]||{},l=2),"object"==typeof s||x.isFunction(s)||(s={}),u===l&&(s=this,--l);u>l;l++)if(null!=(o=arguments[l]))for(i in o)e=s[i],r=o[i],s!==r&&(c&&r&&(x.isPlainObject(r)||(n=x.isArray(r)))?(n?(n=!1,a=e&&x.isArray(e)?e:[]):a=e&&x.isPlainObject(e)?e:{},s[i]=x.extend(c,a,r)):r!==t&&(s[i]=r));return s},x.extend({expando:"jQuery"+(f+Math.random()).replace(/\D/g,""),noConflict:function(t){return e.$===x&&(e.$=u),t&&e.jQuery===x&&(e.jQuery=l),x},isReady:!1,readyWait:1,holdReady:function(e){e?x.readyWait++:x.ready(!0)},ready:function(e){if(e===!0?!--x.readyWait:!x.isReady){if(!a.body)return setTimeout(x.ready);x.isReady=!0,e!==!0&&--x.readyWait>0||(n.resolveWith(a,[x]),x.fn.trigger&&x(a).trigger("ready").off("ready"))}},isFunction:function(e){return"function"===x.type(e)},isArray:Array.isArray||function(e){return"array"===x.type(e)},isWindow:function(e){return null!=e&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?c[y.call(e)]||"object":typeof e},isPlainObject:function(e){var n;if(!e||"object"!==x.type(e)||e.nodeType||x.isWindow(e))return!1;try{if(e.constructor&&!v.call(e,"constructor")&&!v.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(r){return!1}if(x.support.ownLast)for(n in e)return v.call(e,n);for(n in e);return n===t||v.call(e,n)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw Error(e)},parseHTML:function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||a;var r=k.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=x.buildFragment([e],t,i),i&&x(i).remove(),x.merge([],r.childNodes))},parseJSON:function(n){return e.JSON&&e.JSON.parse?e.JSON.parse(n):null===n?n:"string"==typeof n&&(n=x.trim(n),n&&E.test(n.replace(A,"@").replace(j,"]").replace(S,"")))?Function("return "+n)():(x.error("Invalid JSON: "+n),t)},parseXML:function(n){var r,i;if(!n||"string"!=typeof n)return null;try{e.DOMParser?(i=new DOMParser,r=i.parseFromString(n,"text/xml")):(r=new ActiveXObject("Microsoft.XMLDOM"),r.async="false",r.loadXML(n))}catch(o){r=t}return r&&r.documentElement&&!r.getElementsByTagName("parsererror").length||x.error("Invalid XML: "+n),r},noop:function(){},globalEval:function(t){t&&x.trim(t)&&(e.execScript||function(t){e.eval.call(e,t)})(t)},camelCase:function(e){return e.replace(D,"ms-").replace(L,H)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,n){var r,i=0,o=e.length,a=M(e);if(n){if(a){for(;o>i;i++)if(r=t.apply(e[i],n),r===!1)break}else for(i in e)if(r=t.apply(e[i],n),r===!1)break}else if(a){for(;o>i;i++)if(r=t.call(e[i],i,e[i]),r===!1)break}else for(i in e)if(r=t.call(e[i],i,e[i]),r===!1)break;return e},trim:b&&!b.call("\ufeff\u00a0")?function(e){return null==e?"":b.call(e)}:function(e){return null==e?"":(e+"").replace(C,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(M(Object(e))?x.merge(n,"string"==typeof e?[e]:e):h.call(n,e)),n},inArray:function(e,t,n){var r;if(t){if(m)return m.call(t,e,n);for(r=t.length,n=n?0>n?Math.max(0,r+n):n:0;r>n;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,n){var r=n.length,i=e.length,o=0;if("number"==typeof r)for(;r>o;o++)e[i++]=n[o];else while(n[o]!==t)e[i++]=n[o++];return e.length=i,e},grep:function(e,t,n){var r,i=[],o=0,a=e.length;for(n=!!n;a>o;o++)r=!!t(e[o],o),n!==r&&i.push(e[o]);return i},map:function(e,t,n){var r,i=0,o=e.length,a=M(e),s=[];if(a)for(;o>i;i++)r=t(e[i],i,n),null!=r&&(s[s.length]=r);else for(i in e)r=t(e[i],i,n),null!=r&&(s[s.length]=r);return d.apply([],s)},guid:1,proxy:function(e,n){var r,i,o;return"string"==typeof n&&(o=e[n],n=e,e=o),x.isFunction(e)?(r=g.call(arguments,2),i=function(){return e.apply(n||this,r.concat(g.call(arguments)))},i.guid=e.guid=e.guid||x.guid++,i):t},access:function(e,n,r,i,o,a,s){var l=0,u=e.length,c=null==r;if("object"===x.type(r)){o=!0;for(l in r)x.access(e,n,l,r[l],!0,a,s)}else if(i!==t&&(o=!0,x.isFunction(i)||(s=!0),c&&(s?(n.call(e,i),n=null):(c=n,n=function(e,t,n){return c.call(x(e),n)})),n))for(;u>l;l++)n(e[l],r,s?i:i.call(e[l],l,n(e[l],r)));return o?e:c?n.call(e):u?n(e[0],r):a},now:function(){return(new Date).getTime()},swap:function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i}}),x.ready.promise=function(t){if(!n)if(n=x.Deferred(),"complete"===a.readyState)setTimeout(x.ready);else if(a.addEventListener)a.addEventListener("DOMContentLoaded",q,!1),e.addEventListener("load",q,!1);else{a.attachEvent("onreadystatechange",q),e.attachEvent("onload",q);var r=!1;try{r=null==e.frameElement&&a.documentElement}catch(i){}r&&r.doScroll&&function o(){if(!x.isReady){try{r.doScroll("left")}catch(e){return setTimeout(o,50)}_(),x.ready()}}()}return n.promise(t)},x.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){c["[object "+t+"]"]=t.toLowerCase()});function M(e){var t=e.length,n=x.type(e);return x.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===n||"function"!==n&&(0===t||"number"==typeof t&&t>0&&t-1 in e)}r=x(a),function(e,t){var n,r,i,o,a,s,l,u,c,p,f,d,h,g,m,y,v,b="sizzle"+-new Date,w=e.document,T=0,C=0,N=lt(),k=lt(),E=lt(),S=!1,A=function(){return 0},j=typeof t,D=1<<31,L={}.hasOwnProperty,H=[],q=H.pop,_=H.push,M=H.push,O=H.slice,F=H.indexOf||function(e){var t=0,n=this.length;for(;n>t;t++)if(this[t]===e)return t;return-1},B="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",P="[\\x20\\t\\r\\n\\f]",R="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",W=R.replace("w","w#"),$="\\["+P+"*("+R+")"+P+"*(?:([*^$|!~]?=)"+P+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+W+")|)|)"+P+"*\\]",I=":("+R+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+$.replace(3,8)+")*)|.*)\\)|)",z=RegExp("^"+P+"+|((?:^|[^\\\\])(?:\\\\.)*)"+P+"+$","g"),X=RegExp("^"+P+"*,"+P+"*"),U=RegExp("^"+P+"*([>+~]|"+P+")"+P+"*"),V=RegExp(P+"*[+~]"),Y=RegExp("="+P+"*([^\\]'\"]*)"+P+"*\\]","g"),J=RegExp(I),G=RegExp("^"+W+"$"),Q={ID:RegExp("^#("+R+")"),CLASS:RegExp("^\\.("+R+")"),TAG:RegExp("^("+R.replace("w","w*")+")"),ATTR:RegExp("^"+$),PSEUDO:RegExp("^"+I),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+P+"*(even|odd|(([+-]|)(\\d*)n|)"+P+"*(?:([+-]|)"+P+"*(\\d+)|))"+P+"*\\)|)","i"),bool:RegExp("^(?:"+B+")$","i"),needsContext:RegExp("^"+P+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+P+"*((?:-\\d)?\\d*)"+P+"*\\)|)(?=[^-]|$)","i")},K=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,et=/^(?:input|select|textarea|button)$/i,tt=/^h\d$/i,nt=/'|\\/g,rt=RegExp("\\\\([\\da-f]{1,6}"+P+"?|("+P+")|.)","ig"),it=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:0>r?String.fromCharCode(r+65536):String.fromCharCode(55296|r>>10,56320|1023&r)};try{M.apply(H=O.call(w.childNodes),w.childNodes),H[w.childNodes.length].nodeType}catch(ot){M={apply:H.length?function(e,t){_.apply(e,O.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function at(e,t,n,i){var o,a,s,l,u,c,d,m,y,x;if((t?t.ownerDocument||t:w)!==f&&p(t),t=t||f,n=n||[],!e||"string"!=typeof e)return n;if(1!==(l=t.nodeType)&&9!==l)return[];if(h&&!i){if(o=Z.exec(e))if(s=o[1]){if(9===l){if(a=t.getElementById(s),!a||!a.parentNode)return n;if(a.id===s)return n.push(a),n}else if(t.ownerDocument&&(a=t.ownerDocument.getElementById(s))&&v(t,a)&&a.id===s)return n.push(a),n}else{if(o[2])return M.apply(n,t.getElementsByTagName(e)),n;if((s=o[3])&&r.getElementsByClassName&&t.getElementsByClassName)return M.apply(n,t.getElementsByClassName(s)),n}if(r.qsa&&(!g||!g.test(e))){if(m=d=b,y=t,x=9===l&&e,1===l&&"object"!==t.nodeName.toLowerCase()){c=bt(e),(d=t.getAttribute("id"))?m=d.replace(nt,"\\$&"):t.setAttribute("id",m),m="[id='"+m+"'] ",u=c.length;while(u--)c[u]=m+xt(c[u]);y=V.test(e)&&t.parentNode||t,x=c.join(",")}if(x)try{return M.apply(n,y.querySelectorAll(x)),n}catch(T){}finally{d||t.removeAttribute("id")}}}return At(e.replace(z,"$1"),t,n,i)}function st(e){return K.test(e+"")}function lt(){var e=[];function t(n,r){return e.push(n+=" ")>o.cacheLength&&delete t[e.shift()],t[n]=r}return t}function ut(e){return e[b]=!0,e}function ct(e){var t=f.createElement("div");try{return!!e(t)}catch(n){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function pt(e,t,n){e=e.split("|");var r,i=e.length,a=n?null:t;while(i--)(r=o.attrHandle[e[i]])&&r!==t||(o.attrHandle[e[i]]=a)}function ft(e,t){var n=e.getAttributeNode(t);return n&&n.specified?n.value:e[t]===!0?t.toLowerCase():null}function dt(e,t){return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}function ht(e){return"input"===e.nodeName.toLowerCase()?e.defaultValue:t}function gt(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&(~t.sourceIndex||D)-(~e.sourceIndex||D);if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function mt(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function yt(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function vt(e){return ut(function(t){return t=+t,ut(function(n,r){var i,o=e([],n.length,t),a=o.length;while(a--)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}s=at.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},r=at.support={},p=at.setDocument=function(e){var n=e?e.ownerDocument||e:w,i=n.parentWindow;return n!==f&&9===n.nodeType&&n.documentElement?(f=n,d=n.documentElement,h=!s(n),i&&i.frameElement&&i.attachEvent("onbeforeunload",function(){p()}),r.attributes=ct(function(e){return e.innerHTML="<a href='#'></a>",pt("type|href|height|width",dt,"#"===e.firstChild.getAttribute("href")),pt(B,ft,null==e.getAttribute("disabled")),e.className="i",!e.getAttribute("className")}),r.input=ct(function(e){return e.innerHTML="<input>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")}),pt("value",ht,r.attributes&&r.input),r.getElementsByTagName=ct(function(e){return e.appendChild(n.createComment("")),!e.getElementsByTagName("*").length}),r.getElementsByClassName=ct(function(e){return e.innerHTML="<div class='a'></div><div class='a i'></div>",e.firstChild.className="i",2===e.getElementsByClassName("i").length}),r.getById=ct(function(e){return d.appendChild(e).id=b,!n.getElementsByName||!n.getElementsByName(b).length}),r.getById?(o.find.ID=function(e,t){if(typeof t.getElementById!==j&&h){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){return e.getAttribute("id")===t}}):(delete o.find.ID,o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){var n=typeof e.getAttributeNode!==j&&e.getAttributeNode("id");return n&&n.value===t}}),o.find.TAG=r.getElementsByTagName?function(e,n){return typeof n.getElementsByTagName!==j?n.getElementsByTagName(e):t}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},o.find.CLASS=r.getElementsByClassName&&function(e,n){return typeof n.getElementsByClassName!==j&&h?n.getElementsByClassName(e):t},m=[],g=[],(r.qsa=st(n.querySelectorAll))&&(ct(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||g.push("\\["+P+"*(?:value|"+B+")"),e.querySelectorAll(":checked").length||g.push(":checked")}),ct(function(e){var t=n.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("t",""),e.querySelectorAll("[t^='']").length&&g.push("[*^$]="+P+"*(?:''|\"\")"),e.querySelectorAll(":enabled").length||g.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),g.push(",.*:")})),(r.matchesSelector=st(y=d.webkitMatchesSelector||d.mozMatchesSelector||d.oMatchesSelector||d.msMatchesSelector))&&ct(function(e){r.disconnectedMatch=y.call(e,"div"),y.call(e,"[s!='']:x"),m.push("!=",I)}),g=g.length&&RegExp(g.join("|")),m=m.length&&RegExp(m.join("|")),v=st(d.contains)||d.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},r.sortDetached=ct(function(e){return 1&e.compareDocumentPosition(n.createElement("div"))}),A=d.compareDocumentPosition?function(e,t){if(e===t)return S=!0,0;var i=t.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(t);return i?1&i||!r.sortDetached&&t.compareDocumentPosition(e)===i?e===n||v(w,e)?-1:t===n||v(w,t)?1:c?F.call(c,e)-F.call(c,t):0:4&i?-1:1:e.compareDocumentPosition?-1:1}:function(e,t){var r,i=0,o=e.parentNode,a=t.parentNode,s=[e],l=[t];if(e===t)return S=!0,0;if(!o||!a)return e===n?-1:t===n?1:o?-1:a?1:c?F.call(c,e)-F.call(c,t):0;if(o===a)return gt(e,t);r=e;while(r=r.parentNode)s.unshift(r);r=t;while(r=r.parentNode)l.unshift(r);while(s[i]===l[i])i++;return i?gt(s[i],l[i]):s[i]===w?-1:l[i]===w?1:0},n):f},at.matches=function(e,t){return at(e,null,null,t)},at.matchesSelector=function(e,t){if((e.ownerDocument||e)!==f&&p(e),t=t.replace(Y,"='$1']"),!(!r.matchesSelector||!h||m&&m.test(t)||g&&g.test(t)))try{var n=y.call(e,t);if(n||r.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(i){}return at(t,f,null,[e]).length>0},at.contains=function(e,t){return(e.ownerDocument||e)!==f&&p(e),v(e,t)},at.attr=function(e,n){(e.ownerDocument||e)!==f&&p(e);var i=o.attrHandle[n.toLowerCase()],a=i&&L.call(o.attrHandle,n.toLowerCase())?i(e,n,!h):t;return a===t?r.attributes||!h?e.getAttribute(n):(a=e.getAttributeNode(n))&&a.specified?a.value:null:a},at.error=function(e){throw Error("Syntax error, unrecognized expression: "+e)},at.uniqueSort=function(e){var t,n=[],i=0,o=0;if(S=!r.detectDuplicates,c=!r.sortStable&&e.slice(0),e.sort(A),S){while(t=e[o++])t===e[o]&&(i=n.push(o));while(i--)e.splice(n[i],1)}return e},a=at.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=a(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r];r++)n+=a(t);return n},o=at.selectors={cacheLength:50,createPseudo:ut,match:Q,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(rt,it),e[3]=(e[4]||e[5]||"").replace(rt,it),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||at.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&at.error(e[0]),e},PSEUDO:function(e){var n,r=!e[5]&&e[2];return Q.CHILD.test(e[0])?null:(e[3]&&e[4]!==t?e[2]=e[4]:r&&J.test(r)&&(n=bt(r,!0))&&(n=r.indexOf(")",r.length-n)-r.length)&&(e[0]=e[0].slice(0,n),e[2]=r.slice(0,n)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(rt,it).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=N[e+" "];return t||(t=RegExp("(^|"+P+")"+e+"("+P+"|$)"))&&N(e,function(e){return t.test("string"==typeof e.className&&e.className||typeof e.getAttribute!==j&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=at.attr(r,e);return null==i?"!="===t:t?(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i+" ").indexOf(n)>-1:"|="===t?i===n||i.slice(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,l){var u,c,p,f,d,h,g=o!==a?"nextSibling":"previousSibling",m=t.parentNode,y=s&&t.nodeName.toLowerCase(),v=!l&&!s;if(m){if(o){while(g){p=t;while(p=p[g])if(s?p.nodeName.toLowerCase()===y:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?m.firstChild:m.lastChild],a&&v){c=m[b]||(m[b]={}),u=c[e]||[],d=u[0]===T&&u[1],f=u[0]===T&&u[2],p=d&&m.childNodes[d];while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if(1===p.nodeType&&++f&&p===t){c[e]=[T,d,f];break}}else if(v&&(u=(t[b]||(t[b]={}))[e])&&u[0]===T)f=u[1];else while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if((s?p.nodeName.toLowerCase()===y:1===p.nodeType)&&++f&&(v&&((p[b]||(p[b]={}))[e]=[T,f]),p===t))break;return f-=i,f===r||0===f%r&&f/r>=0}}},PSEUDO:function(e,t){var n,r=o.pseudos[e]||o.setFilters[e.toLowerCase()]||at.error("unsupported pseudo: "+e);return r[b]?r(t):r.length>1?(n=[e,e,"",t],o.setFilters.hasOwnProperty(e.toLowerCase())?ut(function(e,n){var i,o=r(e,t),a=o.length;while(a--)i=F.call(e,o[a]),e[i]=!(n[i]=o[a])}):function(e){return r(e,0,n)}):r}},pseudos:{not:ut(function(e){var t=[],n=[],r=l(e.replace(z,"$1"));return r[b]?ut(function(e,t,n,i){var o,a=r(e,null,i,[]),s=e.length;while(s--)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),!n.pop()}}),has:ut(function(e){return function(t){return at(e,t).length>0}}),contains:ut(function(e){return function(t){return(t.textContent||t.innerText||a(t)).indexOf(e)>-1}}),lang:ut(function(e){return G.test(e||"")||at.error("unsupported lang: "+e),e=e.replace(rt,it).toLowerCase(),function(t){var n;do if(n=h?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===d},focus:function(e){return e===f.activeElement&&(!f.hasFocus||f.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!o.pseudos.empty(e)},header:function(e){return tt.test(e.nodeName)},input:function(e){return et.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:vt(function(){return[0]}),last:vt(function(e,t){return[t-1]}),eq:vt(function(e,t,n){return[0>n?n+t:n]}),even:vt(function(e,t){var n=0;for(;t>n;n+=2)e.push(n);return e}),odd:vt(function(e,t){var n=1;for(;t>n;n+=2)e.push(n);return e}),lt:vt(function(e,t,n){var r=0>n?n+t:n;for(;--r>=0;)e.push(r);return e}),gt:vt(function(e,t,n){var r=0>n?n+t:n;for(;t>++r;)e.push(r);return e})}};for(n in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})o.pseudos[n]=mt(n);for(n in{submit:!0,reset:!0})o.pseudos[n]=yt(n);function bt(e,t){var n,r,i,a,s,l,u,c=k[e+" "];if(c)return t?0:c.slice(0);s=e,l=[],u=o.preFilter;while(s){(!n||(r=X.exec(s)))&&(r&&(s=s.slice(r[0].length)||s),l.push(i=[])),n=!1,(r=U.exec(s))&&(n=r.shift(),i.push({value:n,type:r[0].replace(z," ")}),s=s.slice(n.length));for(a in o.filter)!(r=Q[a].exec(s))||u[a]&&!(r=u[a](r))||(n=r.shift(),i.push({value:n,type:a,matches:r}),s=s.slice(n.length));if(!n)break}return t?s.length:s?at.error(e):k(e,l).slice(0)}function xt(e){var t=0,n=e.length,r="";for(;n>t;t++)r+=e[t].value;return r}function wt(e,t,n){var r=t.dir,o=n&&"parentNode"===r,a=C++;return t.first?function(t,n,i){while(t=t[r])if(1===t.nodeType||o)return e(t,n,i)}:function(t,n,s){var l,u,c,p=T+" "+a;if(s){while(t=t[r])if((1===t.nodeType||o)&&e(t,n,s))return!0}else while(t=t[r])if(1===t.nodeType||o)if(c=t[b]||(t[b]={}),(u=c[r])&&u[0]===p){if((l=u[1])===!0||l===i)return l===!0}else if(u=c[r]=[p],u[1]=e(t,n,s)||i,u[1]===!0)return!0}}function Tt(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function Ct(e,t,n,r,i){var o,a=[],s=0,l=e.length,u=null!=t;for(;l>s;s++)(o=e[s])&&(!n||n(o,r,i))&&(a.push(o),u&&t.push(s));return a}function Nt(e,t,n,r,i,o){return r&&!r[b]&&(r=Nt(r)),i&&!i[b]&&(i=Nt(i,o)),ut(function(o,a,s,l){var u,c,p,f=[],d=[],h=a.length,g=o||St(t||"*",s.nodeType?[s]:s,[]),m=!e||!o&&t?g:Ct(g,f,e,s,l),y=n?i||(o?e:h||r)?[]:a:m;if(n&&n(m,y,s,l),r){u=Ct(y,d),r(u,[],s,l),c=u.length;while(c--)(p=u[c])&&(y[d[c]]=!(m[d[c]]=p))}if(o){if(i||e){if(i){u=[],c=y.length;while(c--)(p=y[c])&&u.push(m[c]=p);i(null,y=[],u,l)}c=y.length;while(c--)(p=y[c])&&(u=i?F.call(o,p):f[c])>-1&&(o[u]=!(a[u]=p))}}else y=Ct(y===a?y.splice(h,y.length):y),i?i(null,a,y,l):M.apply(a,y)})}function kt(e){var t,n,r,i=e.length,a=o.relative[e[0].type],s=a||o.relative[" "],l=a?1:0,c=wt(function(e){return e===t},s,!0),p=wt(function(e){return F.call(t,e)>-1},s,!0),f=[function(e,n,r){return!a&&(r||n!==u)||((t=n).nodeType?c(e,n,r):p(e,n,r))}];for(;i>l;l++)if(n=o.relative[e[l].type])f=[wt(Tt(f),n)];else{if(n=o.filter[e[l].type].apply(null,e[l].matches),n[b]){for(r=++l;i>r;r++)if(o.relative[e[r].type])break;return Nt(l>1&&Tt(f),l>1&&xt(e.slice(0,l-1).concat({value:" "===e[l-2].type?"*":""})).replace(z,"$1"),n,r>l&&kt(e.slice(l,r)),i>r&&kt(e=e.slice(r)),i>r&&xt(e))}f.push(n)}return Tt(f)}function Et(e,t){var n=0,r=t.length>0,a=e.length>0,s=function(s,l,c,p,d){var h,g,m,y=[],v=0,b="0",x=s&&[],w=null!=d,C=u,N=s||a&&o.find.TAG("*",d&&l.parentNode||l),k=T+=null==C?1:Math.random()||.1;for(w&&(u=l!==f&&l,i=n);null!=(h=N[b]);b++){if(a&&h){g=0;while(m=e[g++])if(m(h,l,c)){p.push(h);break}w&&(T=k,i=++n)}r&&((h=!m&&h)&&v--,s&&x.push(h))}if(v+=b,r&&b!==v){g=0;while(m=t[g++])m(x,y,l,c);if(s){if(v>0)while(b--)x[b]||y[b]||(y[b]=q.call(p));y=Ct(y)}M.apply(p,y),w&&!s&&y.length>0&&v+t.length>1&&at.uniqueSort(p)}return w&&(T=k,u=C),x};return r?ut(s):s}l=at.compile=function(e,t){var n,r=[],i=[],o=E[e+" "];if(!o){t||(t=bt(e)),n=t.length;while(n--)o=kt(t[n]),o[b]?r.push(o):i.push(o);o=E(e,Et(i,r))}return o};function St(e,t,n){var r=0,i=t.length;for(;i>r;r++)at(e,t[r],n);return n}function At(e,t,n,i){var a,s,u,c,p,f=bt(e);if(!i&&1===f.length){if(s=f[0]=f[0].slice(0),s.length>2&&"ID"===(u=s[0]).type&&r.getById&&9===t.nodeType&&h&&o.relative[s[1].type]){if(t=(o.find.ID(u.matches[0].replace(rt,it),t)||[])[0],!t)return n;e=e.slice(s.shift().value.length)}a=Q.needsContext.test(e)?0:s.length;while(a--){if(u=s[a],o.relative[c=u.type])break;if((p=o.find[c])&&(i=p(u.matches[0].replace(rt,it),V.test(s[0].type)&&t.parentNode||t))){if(s.splice(a,1),e=i.length&&xt(s),!e)return M.apply(n,i),n;break}}}return l(e,f)(i,t,!h,n,V.test(e)),n}o.pseudos.nth=o.pseudos.eq;function jt(){}jt.prototype=o.filters=o.pseudos,o.setFilters=new jt,r.sortStable=b.split("").sort(A).join("")===b,p(),[0,0].sort(A),r.detectDuplicates=S,x.find=at,x.expr=at.selectors,x.expr[":"]=x.expr.pseudos,x.unique=at.uniqueSort,x.text=at.getText,x.isXMLDoc=at.isXML,x.contains=at.contains}(e);var O={};function F(e){var t=O[e]={};return x.each(e.match(T)||[],function(e,n){t[n]=!0}),t}x.Callbacks=function(e){e="string"==typeof e?O[e]||F(e):x.extend({},e);var n,r,i,o,a,s,l=[],u=!e.once&&[],c=function(t){for(r=e.memory&&t,i=!0,a=s||0,s=0,o=l.length,n=!0;l&&o>a;a++)if(l[a].apply(t[0],t[1])===!1&&e.stopOnFalse){r=!1;break}n=!1,l&&(u?u.length&&c(u.shift()):r?l=[]:p.disable())},p={add:function(){if(l){var t=l.length;(function i(t){x.each(t,function(t,n){var r=x.type(n);"function"===r?e.unique&&p.has(n)||l.push(n):n&&n.length&&"string"!==r&&i(n)})})(arguments),n?o=l.length:r&&(s=t,c(r))}return this},remove:function(){return l&&x.each(arguments,function(e,t){var r;while((r=x.inArray(t,l,r))>-1)l.splice(r,1),n&&(o>=r&&o--,a>=r&&a--)}),this},has:function(e){return e?x.inArray(e,l)>-1:!(!l||!l.length)},empty:function(){return l=[],o=0,this},disable:function(){return l=u=r=t,this},disabled:function(){return!l},lock:function(){return u=t,r||p.disable(),this},locked:function(){return!u},fireWith:function(e,t){return t=t||[],t=[e,t.slice?t.slice():t],!l||i&&!u||(n?u.push(t):c(t)),this},fire:function(){return p.fireWith(this,arguments),this},fired:function(){return!!i}};return p},x.extend({Deferred:function(e){var t=[["resolve","done",x.Callbacks("once memory"),"resolved"],["reject","fail",x.Callbacks("once memory"),"rejected"],["notify","progress",x.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return x.Deferred(function(n){x.each(t,function(t,o){var a=o[0],s=x.isFunction(e[t])&&e[t];i[o[1]](function(){var e=s&&s.apply(this,arguments);e&&x.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[a+"With"](this===r?n.promise():this,s?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?x.extend(e,r):r}},i={};return r.pipe=r.then,x.each(t,function(e,o){var a=o[2],s=o[3];r[o[1]]=a.add,s&&a.add(function(){n=s},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=a.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=g.call(arguments),r=n.length,i=1!==r||e&&x.isFunction(e.promise)?r:0,o=1===i?e:x.Deferred(),a=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?g.call(arguments):r,n===s?o.notifyWith(t,n):--i||o.resolveWith(t,n)}},s,l,u;if(r>1)for(s=Array(r),l=Array(r),u=Array(r);r>t;t++)n[t]&&x.isFunction(n[t].promise)?n[t].promise().done(a(t,u,n)).fail(o.reject).progress(a(t,l,s)):--i;return i||o.resolveWith(u,n),o.promise()}}),x.support=function(t){var n,r,o,s,l,u,c,p,f,d=a.createElement("div");if(d.setAttribute("className","t"),d.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=d.getElementsByTagName("*")||[],r=d.getElementsByTagName("a")[0],!r||!r.style||!n.length)return t;s=a.createElement("select"),u=s.appendChild(a.createElement("option")),o=d.getElementsByTagName("input")[0],r.style.cssText="top:1px;float:left;opacity:.5",t.getSetAttribute="t"!==d.className,t.leadingWhitespace=3===d.firstChild.nodeType,t.tbody=!d.getElementsByTagName("tbody").length,t.htmlSerialize=!!d.getElementsByTagName("link").length,t.style=/top/.test(r.getAttribute("style")),t.hrefNormalized="/a"===r.getAttribute("href"),t.opacity=/^0.5/.test(r.style.opacity),t.cssFloat=!!r.style.cssFloat,t.checkOn=!!o.value,t.optSelected=u.selected,t.enctype=!!a.createElement("form").enctype,t.html5Clone="<:nav></:nav>"!==a.createElement("nav").cloneNode(!0).outerHTML,t.inlineBlockNeedsLayout=!1,t.shrinkWrapBlocks=!1,t.pixelPosition=!1,t.deleteExpando=!0,t.noCloneEvent=!0,t.reliableMarginRight=!0,t.boxSizingReliable=!0,o.checked=!0,t.noCloneChecked=o.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!u.disabled;try{delete d.test}catch(h){t.deleteExpando=!1}o=a.createElement("input"),o.setAttribute("value",""),t.input=""===o.getAttribute("value"),o.value="t",o.setAttribute("type","radio"),t.radioValue="t"===o.value,o.setAttribute("checked","t"),o.setAttribute("name","t"),l=a.createDocumentFragment(),l.appendChild(o),t.appendChecked=o.checked,t.checkClone=l.cloneNode(!0).cloneNode(!0).lastChild.checked,d.attachEvent&&(d.attachEvent("onclick",function(){t.noCloneEvent=!1}),d.cloneNode(!0).click());for(f in{submit:!0,change:!0,focusin:!0})d.setAttribute(c="on"+f,"t"),t[f+"Bubbles"]=c in e||d.attributes[c].expando===!1;d.style.backgroundClip="content-box",d.cloneNode(!0).style.backgroundClip="",t.clearCloneStyle="content-box"===d.style.backgroundClip;for(f in x(t))break;return t.ownLast="0"!==f,x(function(){var n,r,o,s="padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",l=a.getElementsByTagName("body")[0];l&&(n=a.createElement("div"),n.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",l.appendChild(n).appendChild(d),d.innerHTML="<table><tr><td></td><td>t</td></tr></table>",o=d.getElementsByTagName("td"),o[0].style.cssText="padding:0;margin:0;border:0;display:none",p=0===o[0].offsetHeight,o[0].style.display="",o[1].style.display="none",t.reliableHiddenOffsets=p&&0===o[0].offsetHeight,d.innerHTML="",d.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",x.swap(l,null!=l.style.zoom?{zoom:1}:{},function(){t.boxSizing=4===d.offsetWidth}),e.getComputedStyle&&(t.pixelPosition="1%"!==(e.getComputedStyle(d,null)||{}).top,t.boxSizingReliable="4px"===(e.getComputedStyle(d,null)||{width:"4px"}).width,r=d.appendChild(a.createElement("div")),r.style.cssText=d.style.cssText=s,r.style.marginRight=r.style.width="0",d.style.width="1px",t.reliableMarginRight=!parseFloat((e.getComputedStyle(r,null)||{}).marginRight)),typeof d.style.zoom!==i&&(d.innerHTML="",d.style.cssText=s+"width:1px;padding:1px;display:inline;zoom:1",t.inlineBlockNeedsLayout=3===d.offsetWidth,d.style.display="block",d.innerHTML="<div></div>",d.firstChild.style.width="5px",t.shrinkWrapBlocks=3!==d.offsetWidth,t.inlineBlockNeedsLayout&&(l.style.zoom=1)),l.removeChild(n),n=d=o=r=null)
}),n=s=l=u=r=o=null,t}({});var B=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,P=/([A-Z])/g;function R(e,n,r,i){if(x.acceptData(e)){var o,a,s=x.expando,l=e.nodeType,u=l?x.cache:e,c=l?e[s]:e[s]&&s;if(c&&u[c]&&(i||u[c].data)||r!==t||"string"!=typeof n)return c||(c=l?e[s]=p.pop()||x.guid++:s),u[c]||(u[c]=l?{}:{toJSON:x.noop}),("object"==typeof n||"function"==typeof n)&&(i?u[c]=x.extend(u[c],n):u[c].data=x.extend(u[c].data,n)),a=u[c],i||(a.data||(a.data={}),a=a.data),r!==t&&(a[x.camelCase(n)]=r),"string"==typeof n?(o=a[n],null==o&&(o=a[x.camelCase(n)])):o=a,o}}function W(e,t,n){if(x.acceptData(e)){var r,i,o=e.nodeType,a=o?x.cache:e,s=o?e[x.expando]:x.expando;if(a[s]){if(t&&(r=n?a[s]:a[s].data)){x.isArray(t)?t=t.concat(x.map(t,x.camelCase)):t in r?t=[t]:(t=x.camelCase(t),t=t in r?[t]:t.split(" ")),i=t.length;while(i--)delete r[t[i]];if(n?!I(r):!x.isEmptyObject(r))return}(n||(delete a[s].data,I(a[s])))&&(o?x.cleanData([e],!0):x.support.deleteExpando||a!=a.window?delete a[s]:a[s]=null)}}}x.extend({cache:{},noData:{applet:!0,embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(e){return e=e.nodeType?x.cache[e[x.expando]]:e[x.expando],!!e&&!I(e)},data:function(e,t,n){return R(e,t,n)},removeData:function(e,t){return W(e,t)},_data:function(e,t,n){return R(e,t,n,!0)},_removeData:function(e,t){return W(e,t,!0)},acceptData:function(e){if(e.nodeType&&1!==e.nodeType&&9!==e.nodeType)return!1;var t=e.nodeName&&x.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),x.fn.extend({data:function(e,n){var r,i,o=null,a=0,s=this[0];if(e===t){if(this.length&&(o=x.data(s),1===s.nodeType&&!x._data(s,"parsedAttrs"))){for(r=s.attributes;r.length>a;a++)i=r[a].name,0===i.indexOf("data-")&&(i=x.camelCase(i.slice(5)),$(s,i,o[i]));x._data(s,"parsedAttrs",!0)}return o}return"object"==typeof e?this.each(function(){x.data(this,e)}):arguments.length>1?this.each(function(){x.data(this,e,n)}):s?$(s,e,x.data(s,e)):null},removeData:function(e){return this.each(function(){x.removeData(this,e)})}});function $(e,n,r){if(r===t&&1===e.nodeType){var i="data-"+n.replace(P,"-$1").toLowerCase();if(r=e.getAttribute(i),"string"==typeof r){try{r="true"===r?!0:"false"===r?!1:"null"===r?null:+r+""===r?+r:B.test(r)?x.parseJSON(r):r}catch(o){}x.data(e,n,r)}else r=t}return r}function I(e){var t;for(t in e)if(("data"!==t||!x.isEmptyObject(e[t]))&&"toJSON"!==t)return!1;return!0}x.extend({queue:function(e,n,r){var i;return e?(n=(n||"fx")+"queue",i=x._data(e,n),r&&(!i||x.isArray(r)?i=x._data(e,n,x.makeArray(r)):i.push(r)),i||[]):t},dequeue:function(e,t){t=t||"fx";var n=x.queue(e,t),r=n.length,i=n.shift(),o=x._queueHooks(e,t),a=function(){x.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return x._data(e,n)||x._data(e,n,{empty:x.Callbacks("once memory").add(function(){x._removeData(e,t+"queue"),x._removeData(e,n)})})}}),x.fn.extend({queue:function(e,n){var r=2;return"string"!=typeof e&&(n=e,e="fx",r--),r>arguments.length?x.queue(this[0],e):n===t?this:this.each(function(){var t=x.queue(this,e,n);x._queueHooks(this,e),"fx"===e&&"inprogress"!==t[0]&&x.dequeue(this,e)})},dequeue:function(e){return this.each(function(){x.dequeue(this,e)})},delay:function(e,t){return e=x.fx?x.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,n){var r,i=1,o=x.Deferred(),a=this,s=this.length,l=function(){--i||o.resolveWith(a,[a])};"string"!=typeof e&&(n=e,e=t),e=e||"fx";while(s--)r=x._data(a[s],e+"queueHooks"),r&&r.empty&&(i++,r.empty.add(l));return l(),o.promise(n)}});var z,X,U=/[\t\r\n\f]/g,V=/\r/g,Y=/^(?:input|select|textarea|button|object)$/i,J=/^(?:a|area)$/i,G=/^(?:checked|selected)$/i,Q=x.support.getSetAttribute,K=x.support.input;x.fn.extend({attr:function(e,t){return x.access(this,x.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){x.removeAttr(this,e)})},prop:function(e,t){return x.access(this,x.prop,e,t,arguments.length>1)},removeProp:function(e){return e=x.propFix[e]||e,this.each(function(){try{this[e]=t,delete this[e]}catch(n){}})},addClass:function(e){var t,n,r,i,o,a=0,s=this.length,l="string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).addClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):" ")){o=0;while(i=t[o++])0>r.indexOf(" "+i+" ")&&(r+=i+" ");n.className=x.trim(r)}return this},removeClass:function(e){var t,n,r,i,o,a=0,s=this.length,l=0===arguments.length||"string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).removeClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):"")){o=0;while(i=t[o++])while(r.indexOf(" "+i+" ")>=0)r=r.replace(" "+i+" "," ");n.className=e?x.trim(r):""}return this},toggleClass:function(e,t){var n=typeof e,r="boolean"==typeof t;return x.isFunction(e)?this.each(function(n){x(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if("string"===n){var o,a=0,s=x(this),l=t,u=e.match(T)||[];while(o=u[a++])l=r?l:!s.hasClass(o),s[l?"addClass":"removeClass"](o)}else(n===i||"boolean"===n)&&(this.className&&x._data(this,"__className__",this.className),this.className=this.className||e===!1?"":x._data(this,"__className__")||"")})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;r>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(U," ").indexOf(t)>=0)return!0;return!1},val:function(e){var n,r,i,o=this[0];{if(arguments.length)return i=x.isFunction(e),this.each(function(n){var o;1===this.nodeType&&(o=i?e.call(this,n,x(this).val()):e,null==o?o="":"number"==typeof o?o+="":x.isArray(o)&&(o=x.map(o,function(e){return null==e?"":e+""})),r=x.valHooks[this.type]||x.valHooks[this.nodeName.toLowerCase()],r&&"set"in r&&r.set(this,o,"value")!==t||(this.value=o))});if(o)return r=x.valHooks[o.type]||x.valHooks[o.nodeName.toLowerCase()],r&&"get"in r&&(n=r.get(o,"value"))!==t?n:(n=o.value,"string"==typeof n?n.replace(V,""):null==n?"":n)}}}),x.extend({valHooks:{option:{get:function(e){var t=x.find.attr(e,"value");return null!=t?t:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||0>i,a=o?null:[],s=o?i+1:r.length,l=0>i?s:o?i:0;for(;s>l;l++)if(n=r[l],!(!n.selected&&l!==i||(x.support.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&x.nodeName(n.parentNode,"optgroup"))){if(t=x(n).val(),o)return t;a.push(t)}return a},set:function(e,t){var n,r,i=e.options,o=x.makeArray(t),a=i.length;while(a--)r=i[a],(r.selected=x.inArray(x(r).val(),o)>=0)&&(n=!0);return n||(e.selectedIndex=-1),o}}},attr:function(e,n,r){var o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return typeof e.getAttribute===i?x.prop(e,n,r):(1===s&&x.isXMLDoc(e)||(n=n.toLowerCase(),o=x.attrHooks[n]||(x.expr.match.bool.test(n)?X:z)),r===t?o&&"get"in o&&null!==(a=o.get(e,n))?a:(a=x.find.attr(e,n),null==a?t:a):null!==r?o&&"set"in o&&(a=o.set(e,r,n))!==t?a:(e.setAttribute(n,r+""),r):(x.removeAttr(e,n),t))},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(T);if(o&&1===e.nodeType)while(n=o[i++])r=x.propFix[n]||n,x.expr.match.bool.test(n)?K&&Q||!G.test(n)?e[r]=!1:e[x.camelCase("default-"+n)]=e[r]=!1:x.attr(e,n,""),e.removeAttribute(Q?n:r)},attrHooks:{type:{set:function(e,t){if(!x.support.radioValue&&"radio"===t&&x.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},propFix:{"for":"htmlFor","class":"className"},prop:function(e,n,r){var i,o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return a=1!==s||!x.isXMLDoc(e),a&&(n=x.propFix[n]||n,o=x.propHooks[n]),r!==t?o&&"set"in o&&(i=o.set(e,r,n))!==t?i:e[n]=r:o&&"get"in o&&null!==(i=o.get(e,n))?i:e[n]},propHooks:{tabIndex:{get:function(e){var t=x.find.attr(e,"tabindex");return t?parseInt(t,10):Y.test(e.nodeName)||J.test(e.nodeName)&&e.href?0:-1}}}}),X={set:function(e,t,n){return t===!1?x.removeAttr(e,n):K&&Q||!G.test(n)?e.setAttribute(!Q&&x.propFix[n]||n,n):e[x.camelCase("default-"+n)]=e[n]=!0,n}},x.each(x.expr.match.bool.source.match(/\w+/g),function(e,n){var r=x.expr.attrHandle[n]||x.find.attr;x.expr.attrHandle[n]=K&&Q||!G.test(n)?function(e,n,i){var o=x.expr.attrHandle[n],a=i?t:(x.expr.attrHandle[n]=t)!=r(e,n,i)?n.toLowerCase():null;return x.expr.attrHandle[n]=o,a}:function(e,n,r){return r?t:e[x.camelCase("default-"+n)]?n.toLowerCase():null}}),K&&Q||(x.attrHooks.value={set:function(e,n,r){return x.nodeName(e,"input")?(e.defaultValue=n,t):z&&z.set(e,n,r)}}),Q||(z={set:function(e,n,r){var i=e.getAttributeNode(r);return i||e.setAttributeNode(i=e.ownerDocument.createAttribute(r)),i.value=n+="","value"===r||n===e.getAttribute(r)?n:t}},x.expr.attrHandle.id=x.expr.attrHandle.name=x.expr.attrHandle.coords=function(e,n,r){var i;return r?t:(i=e.getAttributeNode(n))&&""!==i.value?i.value:null},x.valHooks.button={get:function(e,n){var r=e.getAttributeNode(n);return r&&r.specified?r.value:t},set:z.set},x.attrHooks.contenteditable={set:function(e,t,n){z.set(e,""===t?!1:t,n)}},x.each(["width","height"],function(e,n){x.attrHooks[n]={set:function(e,r){return""===r?(e.setAttribute(n,"auto"),r):t}}})),x.support.hrefNormalized||x.each(["href","src"],function(e,t){x.propHooks[t]={get:function(e){return e.getAttribute(t,4)}}}),x.support.style||(x.attrHooks.style={get:function(e){return e.style.cssText||t},set:function(e,t){return e.style.cssText=t+""}}),x.support.optSelected||(x.propHooks.selected={get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}}),x.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){x.propFix[this.toLowerCase()]=this}),x.support.enctype||(x.propFix.enctype="encoding"),x.each(["radio","checkbox"],function(){x.valHooks[this]={set:function(e,n){return x.isArray(n)?e.checked=x.inArray(x(e).val(),n)>=0:t}},x.support.checkOn||(x.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var Z=/^(?:input|select|textarea)$/i,et=/^key/,tt=/^(?:mouse|contextmenu)|click/,nt=/^(?:focusinfocus|focusoutblur)$/,rt=/^([^.]*)(?:\.(.+)|)$/;function it(){return!0}function ot(){return!1}function at(){try{return a.activeElement}catch(e){}}x.event={global:{},add:function(e,n,r,o,a){var s,l,u,c,p,f,d,h,g,m,y,v=x._data(e);if(v){r.handler&&(c=r,r=c.handler,a=c.selector),r.guid||(r.guid=x.guid++),(l=v.events)||(l=v.events={}),(f=v.handle)||(f=v.handle=function(e){return typeof x===i||e&&x.event.triggered===e.type?t:x.event.dispatch.apply(f.elem,arguments)},f.elem=e),n=(n||"").match(T)||[""],u=n.length;while(u--)s=rt.exec(n[u])||[],g=y=s[1],m=(s[2]||"").split(".").sort(),g&&(p=x.event.special[g]||{},g=(a?p.delegateType:p.bindType)||g,p=x.event.special[g]||{},d=x.extend({type:g,origType:y,data:o,handler:r,guid:r.guid,selector:a,needsContext:a&&x.expr.match.needsContext.test(a),namespace:m.join(".")},c),(h=l[g])||(h=l[g]=[],h.delegateCount=0,p.setup&&p.setup.call(e,o,m,f)!==!1||(e.addEventListener?e.addEventListener(g,f,!1):e.attachEvent&&e.attachEvent("on"+g,f))),p.add&&(p.add.call(e,d),d.handler.guid||(d.handler.guid=r.guid)),a?h.splice(h.delegateCount++,0,d):h.push(d),x.event.global[g]=!0);e=null}},remove:function(e,t,n,r,i){var o,a,s,l,u,c,p,f,d,h,g,m=x.hasData(e)&&x._data(e);if(m&&(c=m.events)){t=(t||"").match(T)||[""],u=t.length;while(u--)if(s=rt.exec(t[u])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){p=x.event.special[d]||{},d=(r?p.delegateType:p.bindType)||d,f=c[d]||[],s=s[2]&&RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),l=o=f.length;while(o--)a=f[o],!i&&g!==a.origType||n&&n.guid!==a.guid||s&&!s.test(a.namespace)||r&&r!==a.selector&&("**"!==r||!a.selector)||(f.splice(o,1),a.selector&&f.delegateCount--,p.remove&&p.remove.call(e,a));l&&!f.length&&(p.teardown&&p.teardown.call(e,h,m.handle)!==!1||x.removeEvent(e,d,m.handle),delete c[d])}else for(d in c)x.event.remove(e,d+t[u],n,r,!0);x.isEmptyObject(c)&&(delete m.handle,x._removeData(e,"events"))}},trigger:function(n,r,i,o){var s,l,u,c,p,f,d,h=[i||a],g=v.call(n,"type")?n.type:n,m=v.call(n,"namespace")?n.namespace.split("."):[];if(u=f=i=i||a,3!==i.nodeType&&8!==i.nodeType&&!nt.test(g+x.event.triggered)&&(g.indexOf(".")>=0&&(m=g.split("."),g=m.shift(),m.sort()),l=0>g.indexOf(":")&&"on"+g,n=n[x.expando]?n:new x.Event(g,"object"==typeof n&&n),n.isTrigger=o?2:3,n.namespace=m.join("."),n.namespace_re=n.namespace?RegExp("(^|\\.)"+m.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,n.result=t,n.target||(n.target=i),r=null==r?[n]:x.makeArray(r,[n]),p=x.event.special[g]||{},o||!p.trigger||p.trigger.apply(i,r)!==!1)){if(!o&&!p.noBubble&&!x.isWindow(i)){for(c=p.delegateType||g,nt.test(c+g)||(u=u.parentNode);u;u=u.parentNode)h.push(u),f=u;f===(i.ownerDocument||a)&&h.push(f.defaultView||f.parentWindow||e)}d=0;while((u=h[d++])&&!n.isPropagationStopped())n.type=d>1?c:p.bindType||g,s=(x._data(u,"events")||{})[n.type]&&x._data(u,"handle"),s&&s.apply(u,r),s=l&&u[l],s&&x.acceptData(u)&&s.apply&&s.apply(u,r)===!1&&n.preventDefault();if(n.type=g,!o&&!n.isDefaultPrevented()&&(!p._default||p._default.apply(h.pop(),r)===!1)&&x.acceptData(i)&&l&&i[g]&&!x.isWindow(i)){f=i[l],f&&(i[l]=null),x.event.triggered=g;try{i[g]()}catch(y){}x.event.triggered=t,f&&(i[l]=f)}return n.result}},dispatch:function(e){e=x.event.fix(e);var n,r,i,o,a,s=[],l=g.call(arguments),u=(x._data(this,"events")||{})[e.type]||[],c=x.event.special[e.type]||{};if(l[0]=e,e.delegateTarget=this,!c.preDispatch||c.preDispatch.call(this,e)!==!1){s=x.event.handlers.call(this,e,u),n=0;while((o=s[n++])&&!e.isPropagationStopped()){e.currentTarget=o.elem,a=0;while((i=o.handlers[a++])&&!e.isImmediatePropagationStopped())(!e.namespace_re||e.namespace_re.test(i.namespace))&&(e.handleObj=i,e.data=i.data,r=((x.event.special[i.origType]||{}).handle||i.handler).apply(o.elem,l),r!==t&&(e.result=r)===!1&&(e.preventDefault(),e.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,e),e.result}},handlers:function(e,n){var r,i,o,a,s=[],l=n.delegateCount,u=e.target;if(l&&u.nodeType&&(!e.button||"click"!==e.type))for(;u!=this;u=u.parentNode||this)if(1===u.nodeType&&(u.disabled!==!0||"click"!==e.type)){for(o=[],a=0;l>a;a++)i=n[a],r=i.selector+" ",o[r]===t&&(o[r]=i.needsContext?x(r,this).index(u)>=0:x.find(r,this,null,[u]).length),o[r]&&o.push(i);o.length&&s.push({elem:u,handlers:o})}return n.length>l&&s.push({elem:this,handlers:n.slice(l)}),s},fix:function(e){if(e[x.expando])return e;var t,n,r,i=e.type,o=e,s=this.fixHooks[i];s||(this.fixHooks[i]=s=tt.test(i)?this.mouseHooks:et.test(i)?this.keyHooks:{}),r=s.props?this.props.concat(s.props):this.props,e=new x.Event(o),t=r.length;while(t--)n=r[t],e[n]=o[n];return e.target||(e.target=o.srcElement||a),3===e.target.nodeType&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,s.filter?s.filter(e,o):e},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,n){var r,i,o,s=n.button,l=n.fromElement;return null==e.pageX&&null!=n.clientX&&(i=e.target.ownerDocument||a,o=i.documentElement,r=i.body,e.pageX=n.clientX+(o&&o.scrollLeft||r&&r.scrollLeft||0)-(o&&o.clientLeft||r&&r.clientLeft||0),e.pageY=n.clientY+(o&&o.scrollTop||r&&r.scrollTop||0)-(o&&o.clientTop||r&&r.clientTop||0)),!e.relatedTarget&&l&&(e.relatedTarget=l===e.target?n.toElement:l),e.which||s===t||(e.which=1&s?1:2&s?3:4&s?2:0),e}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==at()&&this.focus)try{return this.focus(),!1}catch(e){}},delegateType:"focusin"},blur:{trigger:function(){return this===at()&&this.blur?(this.blur(),!1):t},delegateType:"focusout"},click:{trigger:function(){return x.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):t},_default:function(e){return x.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){e.result!==t&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,r){var i=x.extend(new x.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?x.event.trigger(i,null,t):x.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},x.removeEvent=a.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var r="on"+t;e.detachEvent&&(typeof e[r]===i&&(e[r]=null),e.detachEvent(r,n))},x.Event=function(e,n){return this instanceof x.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?it:ot):this.type=e,n&&x.extend(this,n),this.timeStamp=e&&e.timeStamp||x.now(),this[x.expando]=!0,t):new x.Event(e,n)},x.Event.prototype={isDefaultPrevented:ot,isPropagationStopped:ot,isImmediatePropagationStopped:ot,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=it,e&&(e.preventDefault?e.preventDefault():e.returnValue=!1)},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=it,e&&(e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=it,this.stopPropagation()}},x.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){x.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return(!i||i!==r&&!x.contains(r,i))&&(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),x.support.submitBubbles||(x.event.special.submit={setup:function(){return x.nodeName(this,"form")?!1:(x.event.add(this,"click._submit keypress._submit",function(e){var n=e.target,r=x.nodeName(n,"input")||x.nodeName(n,"button")?n.form:t;r&&!x._data(r,"submitBubbles")&&(x.event.add(r,"submit._submit",function(e){e._submit_bubble=!0}),x._data(r,"submitBubbles",!0))}),t)},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&x.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){return x.nodeName(this,"form")?!1:(x.event.remove(this,"._submit"),t)}}),x.support.changeBubbles||(x.event.special.change={setup:function(){return Z.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(x.event.add(this,"propertychange._change",function(e){"checked"===e.originalEvent.propertyName&&(this._just_changed=!0)}),x.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),x.event.simulate("change",this,e,!0)})),!1):(x.event.add(this,"beforeactivate._change",function(e){var t=e.target;Z.test(t.nodeName)&&!x._data(t,"changeBubbles")&&(x.event.add(t,"change._change",function(e){!this.parentNode||e.isSimulated||e.isTrigger||x.event.simulate("change",this.parentNode,e,!0)}),x._data(t,"changeBubbles",!0))}),t)},handle:function(e){var n=e.target;return this!==n||e.isSimulated||e.isTrigger||"radio"!==n.type&&"checkbox"!==n.type?e.handleObj.handler.apply(this,arguments):t},teardown:function(){return x.event.remove(this,"._change"),!Z.test(this.nodeName)}}),x.support.focusinBubbles||x.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){x.event.simulate(t,e.target,x.event.fix(e),!0)};x.event.special[t]={setup:function(){0===n++&&a.addEventListener(e,r,!0)},teardown:function(){0===--n&&a.removeEventListener(e,r,!0)}}}),x.fn.extend({on:function(e,n,r,i,o){var a,s;if("object"==typeof e){"string"!=typeof n&&(r=r||n,n=t);for(a in e)this.on(a,n,r,e[a],o);return this}if(null==r&&null==i?(i=n,r=n=t):null==i&&("string"==typeof n?(i=r,r=t):(i=r,r=n,n=t)),i===!1)i=ot;else if(!i)return this;return 1===o&&(s=i,i=function(e){return x().off(e),s.apply(this,arguments)},i.guid=s.guid||(s.guid=x.guid++)),this.each(function(){x.event.add(this,e,i,r,n)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,n,r){var i,o;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,x(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if("object"==typeof e){for(o in e)this.off(o,n,e[o]);return this}return(n===!1||"function"==typeof n)&&(r=n,n=t),r===!1&&(r=ot),this.each(function(){x.event.remove(this,e,r,n)})},trigger:function(e,t){return this.each(function(){x.event.trigger(e,t,this)})},triggerHandler:function(e,n){var r=this[0];return r?x.event.trigger(e,n,r,!0):t}});var st=/^.[^:#\[\.,]*$/,lt=/^(?:parents|prev(?:Until|All))/,ut=x.expr.match.needsContext,ct={children:!0,contents:!0,next:!0,prev:!0};x.fn.extend({find:function(e){var t,n=[],r=this,i=r.length;if("string"!=typeof e)return this.pushStack(x(e).filter(function(){for(t=0;i>t;t++)if(x.contains(r[t],this))return!0}));for(t=0;i>t;t++)x.find(e,r[t],n);return n=this.pushStack(i>1?x.unique(n):n),n.selector=this.selector?this.selector+" "+e:e,n},has:function(e){var t,n=x(e,this),r=n.length;return this.filter(function(){for(t=0;r>t;t++)if(x.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(ft(this,e||[],!0))},filter:function(e){return this.pushStack(ft(this,e||[],!1))},is:function(e){return!!ft(this,"string"==typeof e&&ut.test(e)?x(e):e||[],!1).length},closest:function(e,t){var n,r=0,i=this.length,o=[],a=ut.test(e)||"string"!=typeof e?x(e,t||this.context):0;for(;i>r;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(11>n.nodeType&&(a?a.index(n)>-1:1===n.nodeType&&x.find.matchesSelector(n,e))){n=o.push(n);break}return this.pushStack(o.length>1?x.unique(o):o)},index:function(e){return e?"string"==typeof e?x.inArray(this[0],x(e)):x.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){var n="string"==typeof e?x(e,t):x.makeArray(e&&e.nodeType?[e]:e),r=x.merge(this.get(),n);return this.pushStack(x.unique(r))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function pt(e,t){do e=e[t];while(e&&1!==e.nodeType);return e}x.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return x.dir(e,"parentNode")},parentsUntil:function(e,t,n){return x.dir(e,"parentNode",n)},next:function(e){return pt(e,"nextSibling")},prev:function(e){return pt(e,"previousSibling")},nextAll:function(e){return x.dir(e,"nextSibling")},prevAll:function(e){return x.dir(e,"previousSibling")},nextUntil:function(e,t,n){return x.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return x.dir(e,"previousSibling",n)},siblings:function(e){return x.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return x.sibling(e.firstChild)},contents:function(e){return x.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:x.merge([],e.childNodes)}},function(e,t){x.fn[e]=function(n,r){var i=x.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=x.filter(r,i)),this.length>1&&(ct[e]||(i=x.unique(i)),lt.test(e)&&(i=i.reverse())),this.pushStack(i)}}),x.extend({filter:function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?x.find.matchesSelector(r,e)?[r]:[]:x.find.matches(e,x.grep(t,function(e){return 1===e.nodeType}))},dir:function(e,n,r){var i=[],o=e[n];while(o&&9!==o.nodeType&&(r===t||1!==o.nodeType||!x(o).is(r)))1===o.nodeType&&i.push(o),o=o[n];return i},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}});function ft(e,t,n){if(x.isFunction(t))return x.grep(e,function(e,r){return!!t.call(e,r,e)!==n});if(t.nodeType)return x.grep(e,function(e){return e===t!==n});if("string"==typeof t){if(st.test(t))return x.filter(t,e,n);t=x.filter(t,e)}return x.grep(e,function(e){return x.inArray(e,t)>=0!==n})}function dt(e){var t=ht.split("|"),n=e.createDocumentFragment();if(n.createElement)while(t.length)n.createElement(t.pop());return n}var ht="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",gt=/ jQuery\d+="(?:null|\d+)"/g,mt=RegExp("<(?:"+ht+")[\\s/>]","i"),yt=/^\s+/,vt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bt=/<([\w:]+)/,xt=/<tbody/i,wt=/<|&#?\w+;/,Tt=/<(?:script|style|link)/i,Ct=/^(?:checkbox|radio)$/i,Nt=/checked\s*(?:[^=]|=\s*.checked.)/i,kt=/^$|\/(?:java|ecma)script/i,Et=/^true\/(.*)/,St=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,At={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:x.support.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},jt=dt(a),Dt=jt.appendChild(a.createElement("div"));At.optgroup=At.option,At.tbody=At.tfoot=At.colgroup=At.caption=At.thead,At.th=At.td,x.fn.extend({text:function(e){return x.access(this,function(e){return e===t?x.text(this):this.empty().append((this[0]&&this[0].ownerDocument||a).createTextNode(e))},null,e,arguments.length)},append:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.appendChild(e)}})},prepend:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){var n,r=e?x.filter(e,this):this,i=0;for(;null!=(n=r[i]);i++)t||1!==n.nodeType||x.cleanData(Ft(n)),n.parentNode&&(t&&x.contains(n.ownerDocument,n)&&_t(Ft(n,"script")),n.parentNode.removeChild(n));return this},empty:function(){var e,t=0;for(;null!=(e=this[t]);t++){1===e.nodeType&&x.cleanData(Ft(e,!1));while(e.firstChild)e.removeChild(e.firstChild);e.options&&x.nodeName(e,"select")&&(e.options.length=0)}return this},clone:function(e,t){return e=null==e?!1:e,t=null==t?e:t,this.map(function(){return x.clone(this,e,t)})},html:function(e){return x.access(this,function(e){var n=this[0]||{},r=0,i=this.length;if(e===t)return 1===n.nodeType?n.innerHTML.replace(gt,""):t;if(!("string"!=typeof e||Tt.test(e)||!x.support.htmlSerialize&&mt.test(e)||!x.support.leadingWhitespace&&yt.test(e)||At[(bt.exec(e)||["",""])[1].toLowerCase()])){e=e.replace(vt,"<$1></$2>");try{for(;i>r;r++)n=this[r]||{},1===n.nodeType&&(x.cleanData(Ft(n,!1)),n.innerHTML=e);n=0}catch(o){}}n&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=x.map(this,function(e){return[e.nextSibling,e.parentNode]}),t=0;return this.domManip(arguments,function(n){var r=e[t++],i=e[t++];i&&(r&&r.parentNode!==i&&(r=this.nextSibling),x(this).remove(),i.insertBefore(n,r))},!0),t?this:this.remove()},detach:function(e){return this.remove(e,!0)},domManip:function(e,t,n){e=d.apply([],e);var r,i,o,a,s,l,u=0,c=this.length,p=this,f=c-1,h=e[0],g=x.isFunction(h);if(g||!(1>=c||"string"!=typeof h||x.support.checkClone)&&Nt.test(h))return this.each(function(r){var i=p.eq(r);g&&(e[0]=h.call(this,r,i.html())),i.domManip(e,t,n)});if(c&&(l=x.buildFragment(e,this[0].ownerDocument,!1,!n&&this),r=l.firstChild,1===l.childNodes.length&&(l=r),r)){for(a=x.map(Ft(l,"script"),Ht),o=a.length;c>u;u++)i=l,u!==f&&(i=x.clone(i,!0,!0),o&&x.merge(a,Ft(i,"script"))),t.call(this[u],i,u);if(o)for(s=a[a.length-1].ownerDocument,x.map(a,qt),u=0;o>u;u++)i=a[u],kt.test(i.type||"")&&!x._data(i,"globalEval")&&x.contains(s,i)&&(i.src?x._evalUrl(i.src):x.globalEval((i.text||i.textContent||i.innerHTML||"").replace(St,"")));l=r=null}return this}});function Lt(e,t){return x.nodeName(e,"table")&&x.nodeName(1===t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function Ht(e){return e.type=(null!==x.find.attr(e,"type"))+"/"+e.type,e}function qt(e){var t=Et.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function _t(e,t){var n,r=0;for(;null!=(n=e[r]);r++)x._data(n,"globalEval",!t||x._data(t[r],"globalEval"))}function Mt(e,t){if(1===t.nodeType&&x.hasData(e)){var n,r,i,o=x._data(e),a=x._data(t,o),s=o.events;if(s){delete a.handle,a.events={};for(n in s)for(r=0,i=s[n].length;i>r;r++)x.event.add(t,n,s[n][r])}a.data&&(a.data=x.extend({},a.data))}}function Ot(e,t){var n,r,i;if(1===t.nodeType){if(n=t.nodeName.toLowerCase(),!x.support.noCloneEvent&&t[x.expando]){i=x._data(t);for(r in i.events)x.removeEvent(t,r,i.handle);t.removeAttribute(x.expando)}"script"===n&&t.text!==e.text?(Ht(t).text=e.text,qt(t)):"object"===n?(t.parentNode&&(t.outerHTML=e.outerHTML),x.support.html5Clone&&e.innerHTML&&!x.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):"input"===n&&Ct.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):"option"===n?t.defaultSelected=t.selected=e.defaultSelected:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}}x.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){x.fn[e]=function(e){var n,r=0,i=[],o=x(e),a=o.length-1;for(;a>=r;r++)n=r===a?this:this.clone(!0),x(o[r])[t](n),h.apply(i,n.get());return this.pushStack(i)}});function Ft(e,n){var r,o,a=0,s=typeof e.getElementsByTagName!==i?e.getElementsByTagName(n||"*"):typeof e.querySelectorAll!==i?e.querySelectorAll(n||"*"):t;if(!s)for(s=[],r=e.childNodes||e;null!=(o=r[a]);a++)!n||x.nodeName(o,n)?s.push(o):x.merge(s,Ft(o,n));return n===t||n&&x.nodeName(e,n)?x.merge([e],s):s}function Bt(e){Ct.test(e.type)&&(e.defaultChecked=e.checked)}x.extend({clone:function(e,t,n){var r,i,o,a,s,l=x.contains(e.ownerDocument,e);if(x.support.html5Clone||x.isXMLDoc(e)||!mt.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(Dt.innerHTML=e.outerHTML,Dt.removeChild(o=Dt.firstChild)),!(x.support.noCloneEvent&&x.support.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||x.isXMLDoc(e)))for(r=Ft(o),s=Ft(e),a=0;null!=(i=s[a]);++a)r[a]&&Ot(i,r[a]);if(t)if(n)for(s=s||Ft(e),r=r||Ft(o),a=0;null!=(i=s[a]);a++)Mt(i,r[a]);else Mt(e,o);return r=Ft(o,"script"),r.length>0&&_t(r,!l&&Ft(e,"script")),r=s=i=null,o},buildFragment:function(e,t,n,r){var i,o,a,s,l,u,c,p=e.length,f=dt(t),d=[],h=0;for(;p>h;h++)if(o=e[h],o||0===o)if("object"===x.type(o))x.merge(d,o.nodeType?[o]:o);else if(wt.test(o)){s=s||f.appendChild(t.createElement("div")),l=(bt.exec(o)||["",""])[1].toLowerCase(),c=At[l]||At._default,s.innerHTML=c[1]+o.replace(vt,"<$1></$2>")+c[2],i=c[0];while(i--)s=s.lastChild;if(!x.support.leadingWhitespace&&yt.test(o)&&d.push(t.createTextNode(yt.exec(o)[0])),!x.support.tbody){o="table"!==l||xt.test(o)?"<table>"!==c[1]||xt.test(o)?0:s:s.firstChild,i=o&&o.childNodes.length;while(i--)x.nodeName(u=o.childNodes[i],"tbody")&&!u.childNodes.length&&o.removeChild(u)}x.merge(d,s.childNodes),s.textContent="";while(s.firstChild)s.removeChild(s.firstChild);s=f.lastChild}else d.push(t.createTextNode(o));s&&f.removeChild(s),x.support.appendChecked||x.grep(Ft(d,"input"),Bt),h=0;while(o=d[h++])if((!r||-1===x.inArray(o,r))&&(a=x.contains(o.ownerDocument,o),s=Ft(f.appendChild(o),"script"),a&&_t(s),n)){i=0;while(o=s[i++])kt.test(o.type||"")&&n.push(o)}return s=null,f},cleanData:function(e,t){var n,r,o,a,s=0,l=x.expando,u=x.cache,c=x.support.deleteExpando,f=x.event.special;for(;null!=(n=e[s]);s++)if((t||x.acceptData(n))&&(o=n[l],a=o&&u[o])){if(a.events)for(r in a.events)f[r]?x.event.remove(n,r):x.removeEvent(n,r,a.handle);
u[o]&&(delete u[o],c?delete n[l]:typeof n.removeAttribute!==i?n.removeAttribute(l):n[l]=null,p.push(o))}},_evalUrl:function(e){return x.ajax({url:e,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})}}),x.fn.extend({wrapAll:function(e){if(x.isFunction(e))return this.each(function(t){x(this).wrapAll(e.call(this,t))});if(this[0]){var t=x(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstChild&&1===e.firstChild.nodeType)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return x.isFunction(e)?this.each(function(t){x(this).wrapInner(e.call(this,t))}):this.each(function(){var t=x(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=x.isFunction(e);return this.each(function(n){x(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){x.nodeName(this,"body")||x(this).replaceWith(this.childNodes)}).end()}});var Pt,Rt,Wt,$t=/alpha\([^)]*\)/i,It=/opacity\s*=\s*([^)]*)/,zt=/^(top|right|bottom|left)$/,Xt=/^(none|table(?!-c[ea]).+)/,Ut=/^margin/,Vt=RegExp("^("+w+")(.*)$","i"),Yt=RegExp("^("+w+")(?!px)[a-z%]+$","i"),Jt=RegExp("^([+-])=("+w+")","i"),Gt={BODY:"block"},Qt={position:"absolute",visibility:"hidden",display:"block"},Kt={letterSpacing:0,fontWeight:400},Zt=["Top","Right","Bottom","Left"],en=["Webkit","O","Moz","ms"];function tn(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=en.length;while(i--)if(t=en[i]+n,t in e)return t;return r}function nn(e,t){return e=t||e,"none"===x.css(e,"display")||!x.contains(e.ownerDocument,e)}function rn(e,t){var n,r,i,o=[],a=0,s=e.length;for(;s>a;a++)r=e[a],r.style&&(o[a]=x._data(r,"olddisplay"),n=r.style.display,t?(o[a]||"none"!==n||(r.style.display=""),""===r.style.display&&nn(r)&&(o[a]=x._data(r,"olddisplay",ln(r.nodeName)))):o[a]||(i=nn(r),(n&&"none"!==n||!i)&&x._data(r,"olddisplay",i?n:x.css(r,"display"))));for(a=0;s>a;a++)r=e[a],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[a]||"":"none"));return e}x.fn.extend({css:function(e,n){return x.access(this,function(e,n,r){var i,o,a={},s=0;if(x.isArray(n)){for(o=Rt(e),i=n.length;i>s;s++)a[n[s]]=x.css(e,n[s],!1,o);return a}return r!==t?x.style(e,n,r):x.css(e,n)},e,n,arguments.length>1)},show:function(){return rn(this,!0)},hide:function(){return rn(this)},toggle:function(e){var t="boolean"==typeof e;return this.each(function(){(t?e:nn(this))?x(this).show():x(this).hide()})}}),x.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Wt(e,"opacity");return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":x.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,n,r,i){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var o,a,s,l=x.camelCase(n),u=e.style;if(n=x.cssProps[l]||(x.cssProps[l]=tn(u,l)),s=x.cssHooks[n]||x.cssHooks[l],r===t)return s&&"get"in s&&(o=s.get(e,!1,i))!==t?o:u[n];if(a=typeof r,"string"===a&&(o=Jt.exec(r))&&(r=(o[1]+1)*o[2]+parseFloat(x.css(e,n)),a="number"),!(null==r||"number"===a&&isNaN(r)||("number"!==a||x.cssNumber[l]||(r+="px"),x.support.clearCloneStyle||""!==r||0!==n.indexOf("background")||(u[n]="inherit"),s&&"set"in s&&(r=s.set(e,r,i))===t)))try{u[n]=r}catch(c){}}},css:function(e,n,r,i){var o,a,s,l=x.camelCase(n);return n=x.cssProps[l]||(x.cssProps[l]=tn(e.style,l)),s=x.cssHooks[n]||x.cssHooks[l],s&&"get"in s&&(a=s.get(e,!0,r)),a===t&&(a=Wt(e,n,i)),"normal"===a&&n in Kt&&(a=Kt[n]),""===r||r?(o=parseFloat(a),r===!0||x.isNumeric(o)?o||0:a):a}}),e.getComputedStyle?(Rt=function(t){return e.getComputedStyle(t,null)},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s.getPropertyValue(n)||s[n]:t,u=e.style;return s&&(""!==l||x.contains(e.ownerDocument,e)||(l=x.style(e,n)),Yt.test(l)&&Ut.test(n)&&(i=u.width,o=u.minWidth,a=u.maxWidth,u.minWidth=u.maxWidth=u.width=l,l=s.width,u.width=i,u.minWidth=o,u.maxWidth=a)),l}):a.documentElement.currentStyle&&(Rt=function(e){return e.currentStyle},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s[n]:t,u=e.style;return null==l&&u&&u[n]&&(l=u[n]),Yt.test(l)&&!zt.test(n)&&(i=u.left,o=e.runtimeStyle,a=o&&o.left,a&&(o.left=e.currentStyle.left),u.left="fontSize"===n?"1em":l,l=u.pixelLeft+"px",u.left=i,a&&(o.left=a)),""===l?"auto":l});function on(e,t,n){var r=Vt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function an(e,t,n,r,i){var o=n===(r?"border":"content")?4:"width"===t?1:0,a=0;for(;4>o;o+=2)"margin"===n&&(a+=x.css(e,n+Zt[o],!0,i)),r?("content"===n&&(a-=x.css(e,"padding"+Zt[o],!0,i)),"margin"!==n&&(a-=x.css(e,"border"+Zt[o]+"Width",!0,i))):(a+=x.css(e,"padding"+Zt[o],!0,i),"padding"!==n&&(a+=x.css(e,"border"+Zt[o]+"Width",!0,i)));return a}function sn(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=Rt(e),a=x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,o);if(0>=i||null==i){if(i=Wt(e,t,o),(0>i||null==i)&&(i=e.style[t]),Yt.test(i))return i;r=a&&(x.support.boxSizingReliable||i===e.style[t]),i=parseFloat(i)||0}return i+an(e,t,n||(a?"border":"content"),r,o)+"px"}function ln(e){var t=a,n=Gt[e];return n||(n=un(e,t),"none"!==n&&n||(Pt=(Pt||x("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(t.documentElement),t=(Pt[0].contentWindow||Pt[0].contentDocument).document,t.write("<!doctype html><html><body>"),t.close(),n=un(e,t),Pt.detach()),Gt[e]=n),n}function un(e,t){var n=x(t.createElement(e)).appendTo(t.body),r=x.css(n[0],"display");return n.remove(),r}x.each(["height","width"],function(e,n){x.cssHooks[n]={get:function(e,r,i){return r?0===e.offsetWidth&&Xt.test(x.css(e,"display"))?x.swap(e,Qt,function(){return sn(e,n,i)}):sn(e,n,i):t},set:function(e,t,r){var i=r&&Rt(e);return on(e,t,r?an(e,n,r,x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,i),i):0)}}}),x.support.opacity||(x.cssHooks.opacity={get:function(e,t){return It.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=x.isNumeric(t)?"alpha(opacity="+100*t+")":"",o=r&&r.filter||n.filter||"";n.zoom=1,(t>=1||""===t)&&""===x.trim(o.replace($t,""))&&n.removeAttribute&&(n.removeAttribute("filter"),""===t||r&&!r.filter)||(n.filter=$t.test(o)?o.replace($t,i):o+" "+i)}}),x(function(){x.support.reliableMarginRight||(x.cssHooks.marginRight={get:function(e,n){return n?x.swap(e,{display:"inline-block"},Wt,[e,"marginRight"]):t}}),!x.support.pixelPosition&&x.fn.position&&x.each(["top","left"],function(e,n){x.cssHooks[n]={get:function(e,r){return r?(r=Wt(e,n),Yt.test(r)?x(e).position()[n]+"px":r):t}}})}),x.expr&&x.expr.filters&&(x.expr.filters.hidden=function(e){return 0>=e.offsetWidth&&0>=e.offsetHeight||!x.support.reliableHiddenOffsets&&"none"===(e.style&&e.style.display||x.css(e,"display"))},x.expr.filters.visible=function(e){return!x.expr.filters.hidden(e)}),x.each({margin:"",padding:"",border:"Width"},function(e,t){x.cssHooks[e+t]={expand:function(n){var r=0,i={},o="string"==typeof n?n.split(" "):[n];for(;4>r;r++)i[e+Zt[r]+t]=o[r]||o[r-2]||o[0];return i}},Ut.test(e)||(x.cssHooks[e+t].set=on)});var cn=/%20/g,pn=/\[\]$/,fn=/\r?\n/g,dn=/^(?:submit|button|image|reset|file)$/i,hn=/^(?:input|select|textarea|keygen)/i;x.fn.extend({serialize:function(){return x.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=x.prop(this,"elements");return e?x.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!x(this).is(":disabled")&&hn.test(this.nodeName)&&!dn.test(e)&&(this.checked||!Ct.test(e))}).map(function(e,t){var n=x(this).val();return null==n?null:x.isArray(n)?x.map(n,function(e){return{name:t.name,value:e.replace(fn,"\r\n")}}):{name:t.name,value:n.replace(fn,"\r\n")}}).get()}}),x.param=function(e,n){var r,i=[],o=function(e,t){t=x.isFunction(t)?t():null==t?"":t,i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(n===t&&(n=x.ajaxSettings&&x.ajaxSettings.traditional),x.isArray(e)||e.jquery&&!x.isPlainObject(e))x.each(e,function(){o(this.name,this.value)});else for(r in e)gn(r,e[r],n,o);return i.join("&").replace(cn,"+")};function gn(e,t,n,r){var i;if(x.isArray(t))x.each(t,function(t,i){n||pn.test(e)?r(e,i):gn(e+"["+("object"==typeof i?t:"")+"]",i,n,r)});else if(n||"object"!==x.type(t))r(e,t);else for(i in t)gn(e+"["+i+"]",t[i],n,r)}x.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){x.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),x.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}});var mn,yn,vn=x.now(),bn=/\?/,xn=/#.*$/,wn=/([?&])_=[^&]*/,Tn=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Cn=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Nn=/^(?:GET|HEAD)$/,kn=/^\/\//,En=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,Sn=x.fn.load,An={},jn={},Dn="*/".concat("*");try{yn=o.href}catch(Ln){yn=a.createElement("a"),yn.href="",yn=yn.href}mn=En.exec(yn.toLowerCase())||[];function Hn(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(T)||[];if(x.isFunction(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function qn(e,n,r,i){var o={},a=e===jn;function s(l){var u;return o[l]=!0,x.each(e[l]||[],function(e,l){var c=l(n,r,i);return"string"!=typeof c||a||o[c]?a?!(u=c):t:(n.dataTypes.unshift(c),s(c),!1)}),u}return s(n.dataTypes[0])||!o["*"]&&s("*")}function _n(e,n){var r,i,o=x.ajaxSettings.flatOptions||{};for(i in n)n[i]!==t&&((o[i]?e:r||(r={}))[i]=n[i]);return r&&x.extend(!0,e,r),e}x.fn.load=function(e,n,r){if("string"!=typeof e&&Sn)return Sn.apply(this,arguments);var i,o,a,s=this,l=e.indexOf(" ");return l>=0&&(i=e.slice(l,e.length),e=e.slice(0,l)),x.isFunction(n)?(r=n,n=t):n&&"object"==typeof n&&(a="POST"),s.length>0&&x.ajax({url:e,type:a,dataType:"html",data:n}).done(function(e){o=arguments,s.html(i?x("<div>").append(x.parseHTML(e)).find(i):e)}).complete(r&&function(e,t){s.each(r,o||[e.responseText,t,e])}),this},x.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){x.fn[t]=function(e){return this.on(t,e)}}),x.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:yn,type:"GET",isLocal:Cn.test(mn[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Dn,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":x.parseJSON,"text xml":x.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?_n(_n(e,x.ajaxSettings),t):_n(x.ajaxSettings,e)},ajaxPrefilter:Hn(An),ajaxTransport:Hn(jn),ajax:function(e,n){"object"==typeof e&&(n=e,e=t),n=n||{};var r,i,o,a,s,l,u,c,p=x.ajaxSetup({},n),f=p.context||p,d=p.context&&(f.nodeType||f.jquery)?x(f):x.event,h=x.Deferred(),g=x.Callbacks("once memory"),m=p.statusCode||{},y={},v={},b=0,w="canceled",C={readyState:0,getResponseHeader:function(e){var t;if(2===b){if(!c){c={};while(t=Tn.exec(a))c[t[1].toLowerCase()]=t[2]}t=c[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===b?a:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return b||(e=v[n]=v[n]||e,y[e]=t),this},overrideMimeType:function(e){return b||(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(2>b)for(t in e)m[t]=[m[t],e[t]];else C.always(e[C.status]);return this},abort:function(e){var t=e||w;return u&&u.abort(t),k(0,t),this}};if(h.promise(C).complete=g.add,C.success=C.done,C.error=C.fail,p.url=((e||p.url||yn)+"").replace(xn,"").replace(kn,mn[1]+"//"),p.type=n.method||n.type||p.method||p.type,p.dataTypes=x.trim(p.dataType||"*").toLowerCase().match(T)||[""],null==p.crossDomain&&(r=En.exec(p.url.toLowerCase()),p.crossDomain=!(!r||r[1]===mn[1]&&r[2]===mn[2]&&(r[3]||("http:"===r[1]?"80":"443"))===(mn[3]||("http:"===mn[1]?"80":"443")))),p.data&&p.processData&&"string"!=typeof p.data&&(p.data=x.param(p.data,p.traditional)),qn(An,p,n,C),2===b)return C;l=p.global,l&&0===x.active++&&x.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!Nn.test(p.type),o=p.url,p.hasContent||(p.data&&(o=p.url+=(bn.test(o)?"&":"?")+p.data,delete p.data),p.cache===!1&&(p.url=wn.test(o)?o.replace(wn,"$1_="+vn++):o+(bn.test(o)?"&":"?")+"_="+vn++)),p.ifModified&&(x.lastModified[o]&&C.setRequestHeader("If-Modified-Since",x.lastModified[o]),x.etag[o]&&C.setRequestHeader("If-None-Match",x.etag[o])),(p.data&&p.hasContent&&p.contentType!==!1||n.contentType)&&C.setRequestHeader("Content-Type",p.contentType),C.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+Dn+"; q=0.01":""):p.accepts["*"]);for(i in p.headers)C.setRequestHeader(i,p.headers[i]);if(p.beforeSend&&(p.beforeSend.call(f,C,p)===!1||2===b))return C.abort();w="abort";for(i in{success:1,error:1,complete:1})C[i](p[i]);if(u=qn(jn,p,n,C)){C.readyState=1,l&&d.trigger("ajaxSend",[C,p]),p.async&&p.timeout>0&&(s=setTimeout(function(){C.abort("timeout")},p.timeout));try{b=1,u.send(y,k)}catch(N){if(!(2>b))throw N;k(-1,N)}}else k(-1,"No Transport");function k(e,n,r,i){var c,y,v,w,T,N=n;2!==b&&(b=2,s&&clearTimeout(s),u=t,a=i||"",C.readyState=e>0?4:0,c=e>=200&&300>e||304===e,r&&(w=Mn(p,C,r)),w=On(p,w,C,c),c?(p.ifModified&&(T=C.getResponseHeader("Last-Modified"),T&&(x.lastModified[o]=T),T=C.getResponseHeader("etag"),T&&(x.etag[o]=T)),204===e||"HEAD"===p.type?N="nocontent":304===e?N="notmodified":(N=w.state,y=w.data,v=w.error,c=!v)):(v=N,(e||!N)&&(N="error",0>e&&(e=0))),C.status=e,C.statusText=(n||N)+"",c?h.resolveWith(f,[y,N,C]):h.rejectWith(f,[C,N,v]),C.statusCode(m),m=t,l&&d.trigger(c?"ajaxSuccess":"ajaxError",[C,p,c?y:v]),g.fireWith(f,[C,N]),l&&(d.trigger("ajaxComplete",[C,p]),--x.active||x.event.trigger("ajaxStop")))}return C},getJSON:function(e,t,n){return x.get(e,t,n,"json")},getScript:function(e,n){return x.get(e,t,n,"script")}}),x.each(["get","post"],function(e,n){x[n]=function(e,r,i,o){return x.isFunction(r)&&(o=o||i,i=r,r=t),x.ajax({url:e,type:n,dataType:o,data:r,success:i})}});function Mn(e,n,r){var i,o,a,s,l=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),o===t&&(o=e.mimeType||n.getResponseHeader("Content-Type"));if(o)for(s in l)if(l[s]&&l[s].test(o)){u.unshift(s);break}if(u[0]in r)a=u[0];else{for(s in r){if(!u[0]||e.converters[s+" "+u[0]]){a=s;break}i||(i=s)}a=a||i}return a?(a!==u[0]&&u.unshift(a),r[a]):t}function On(e,t,n,r){var i,o,a,s,l,u={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)u[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!l&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),l=o,o=c.shift())if("*"===o)o=l;else if("*"!==l&&l!==o){if(a=u[l+" "+o]||u["* "+o],!a)for(i in u)if(s=i.split(" "),s[1]===o&&(a=u[l+" "+s[0]]||u["* "+s[0]])){a===!0?a=u[i]:u[i]!==!0&&(o=s[0],c.unshift(s[1]));break}if(a!==!0)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(p){return{state:"parsererror",error:a?p:"No conversion from "+l+" to "+o}}}return{state:"success",data:t}}x.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return x.globalEval(e),e}}}),x.ajaxPrefilter("script",function(e){e.cache===t&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),x.ajaxTransport("script",function(e){if(e.crossDomain){var n,r=a.head||x("head")[0]||a.documentElement;return{send:function(t,i){n=a.createElement("script"),n.async=!0,e.scriptCharset&&(n.charset=e.scriptCharset),n.src=e.url,n.onload=n.onreadystatechange=function(e,t){(t||!n.readyState||/loaded|complete/.test(n.readyState))&&(n.onload=n.onreadystatechange=null,n.parentNode&&n.parentNode.removeChild(n),n=null,t||i(200,"success"))},r.insertBefore(n,r.firstChild)},abort:function(){n&&n.onload(t,!0)}}}});var Fn=[],Bn=/(=)\?(?=&|$)|\?\?/;x.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Fn.pop()||x.expando+"_"+vn++;return this[e]=!0,e}}),x.ajaxPrefilter("json jsonp",function(n,r,i){var o,a,s,l=n.jsonp!==!1&&(Bn.test(n.url)?"url":"string"==typeof n.data&&!(n.contentType||"").indexOf("application/x-www-form-urlencoded")&&Bn.test(n.data)&&"data");return l||"jsonp"===n.dataTypes[0]?(o=n.jsonpCallback=x.isFunction(n.jsonpCallback)?n.jsonpCallback():n.jsonpCallback,l?n[l]=n[l].replace(Bn,"$1"+o):n.jsonp!==!1&&(n.url+=(bn.test(n.url)?"&":"?")+n.jsonp+"="+o),n.converters["script json"]=function(){return s||x.error(o+" was not called"),s[0]},n.dataTypes[0]="json",a=e[o],e[o]=function(){s=arguments},i.always(function(){e[o]=a,n[o]&&(n.jsonpCallback=r.jsonpCallback,Fn.push(o)),s&&x.isFunction(a)&&a(s[0]),s=a=t}),"script"):t});var Pn,Rn,Wn=0,$n=e.ActiveXObject&&function(){var e;for(e in Pn)Pn[e](t,!0)};function In(){try{return new e.XMLHttpRequest}catch(t){}}function zn(){try{return new e.ActiveXObject("Microsoft.XMLHTTP")}catch(t){}}x.ajaxSettings.xhr=e.ActiveXObject?function(){return!this.isLocal&&In()||zn()}:In,Rn=x.ajaxSettings.xhr(),x.support.cors=!!Rn&&"withCredentials"in Rn,Rn=x.support.ajax=!!Rn,Rn&&x.ajaxTransport(function(n){if(!n.crossDomain||x.support.cors){var r;return{send:function(i,o){var a,s,l=n.xhr();if(n.username?l.open(n.type,n.url,n.async,n.username,n.password):l.open(n.type,n.url,n.async),n.xhrFields)for(s in n.xhrFields)l[s]=n.xhrFields[s];n.mimeType&&l.overrideMimeType&&l.overrideMimeType(n.mimeType),n.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");try{for(s in i)l.setRequestHeader(s,i[s])}catch(u){}l.send(n.hasContent&&n.data||null),r=function(e,i){var s,u,c,p;try{if(r&&(i||4===l.readyState))if(r=t,a&&(l.onreadystatechange=x.noop,$n&&delete Pn[a]),i)4!==l.readyState&&l.abort();else{p={},s=l.status,u=l.getAllResponseHeaders(),"string"==typeof l.responseText&&(p.text=l.responseText);try{c=l.statusText}catch(f){c=""}s||!n.isLocal||n.crossDomain?1223===s&&(s=204):s=p.text?200:404}}catch(d){i||o(-1,d)}p&&o(s,c,p,u)},n.async?4===l.readyState?setTimeout(r):(a=++Wn,$n&&(Pn||(Pn={},x(e).unload($n)),Pn[a]=r),l.onreadystatechange=r):r()},abort:function(){r&&r(t,!0)}}}});var Xn,Un,Vn=/^(?:toggle|show|hide)$/,Yn=RegExp("^(?:([+-])=|)("+w+")([a-z%]*)$","i"),Jn=/queueHooks$/,Gn=[nr],Qn={"*":[function(e,t){var n=this.createTween(e,t),r=n.cur(),i=Yn.exec(t),o=i&&i[3]||(x.cssNumber[e]?"":"px"),a=(x.cssNumber[e]||"px"!==o&&+r)&&Yn.exec(x.css(n.elem,e)),s=1,l=20;if(a&&a[3]!==o){o=o||a[3],i=i||[],a=+r||1;do s=s||".5",a/=s,x.style(n.elem,e,a+o);while(s!==(s=n.cur()/r)&&1!==s&&--l)}return i&&(a=n.start=+a||+r||0,n.unit=o,n.end=i[1]?a+(i[1]+1)*i[2]:+i[2]),n}]};function Kn(){return setTimeout(function(){Xn=t}),Xn=x.now()}function Zn(e,t,n){var r,i=(Qn[t]||[]).concat(Qn["*"]),o=0,a=i.length;for(;a>o;o++)if(r=i[o].call(n,t,e))return r}function er(e,t,n){var r,i,o=0,a=Gn.length,s=x.Deferred().always(function(){delete l.elem}),l=function(){if(i)return!1;var t=Xn||Kn(),n=Math.max(0,u.startTime+u.duration-t),r=n/u.duration||0,o=1-r,a=0,l=u.tweens.length;for(;l>a;a++)u.tweens[a].run(o);return s.notifyWith(e,[u,o,n]),1>o&&l?n:(s.resolveWith(e,[u]),!1)},u=s.promise({elem:e,props:x.extend({},t),opts:x.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:Xn||Kn(),duration:n.duration,tweens:[],createTween:function(t,n){var r=x.Tween(e,u.opts,t,n,u.opts.specialEasing[t]||u.opts.easing);return u.tweens.push(r),r},stop:function(t){var n=0,r=t?u.tweens.length:0;if(i)return this;for(i=!0;r>n;n++)u.tweens[n].run(1);return t?s.resolveWith(e,[u,t]):s.rejectWith(e,[u,t]),this}}),c=u.props;for(tr(c,u.opts.specialEasing);a>o;o++)if(r=Gn[o].call(u,e,c,u.opts))return r;return x.map(c,Zn,u),x.isFunction(u.opts.start)&&u.opts.start.call(e,u),x.fx.timer(x.extend(l,{elem:e,anim:u,queue:u.opts.queue})),u.progress(u.opts.progress).done(u.opts.done,u.opts.complete).fail(u.opts.fail).always(u.opts.always)}function tr(e,t){var n,r,i,o,a;for(n in e)if(r=x.camelCase(n),i=t[r],o=e[n],x.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),a=x.cssHooks[r],a&&"expand"in a){o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}x.Animation=x.extend(er,{tweener:function(e,t){x.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;i>r;r++)n=e[r],Qn[n]=Qn[n]||[],Qn[n].unshift(t)},prefilter:function(e,t){t?Gn.unshift(e):Gn.push(e)}});function nr(e,t,n){var r,i,o,a,s,l,u=this,c={},p=e.style,f=e.nodeType&&nn(e),d=x._data(e,"fxshow");n.queue||(s=x._queueHooks(e,"fx"),null==s.unqueued&&(s.unqueued=0,l=s.empty.fire,s.empty.fire=function(){s.unqueued||l()}),s.unqueued++,u.always(function(){u.always(function(){s.unqueued--,x.queue(e,"fx").length||s.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],"inline"===x.css(e,"display")&&"none"===x.css(e,"float")&&(x.support.inlineBlockNeedsLayout&&"inline"!==ln(e.nodeName)?p.zoom=1:p.display="inline-block")),n.overflow&&(p.overflow="hidden",x.support.shrinkWrapBlocks||u.always(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(r in t)if(i=t[r],Vn.exec(i)){if(delete t[r],o=o||"toggle"===i,i===(f?"hide":"show"))continue;c[r]=d&&d[r]||x.style(e,r)}if(!x.isEmptyObject(c)){d?"hidden"in d&&(f=d.hidden):d=x._data(e,"fxshow",{}),o&&(d.hidden=!f),f?x(e).show():u.done(function(){x(e).hide()}),u.done(function(){var t;x._removeData(e,"fxshow");for(t in c)x.style(e,t,c[t])});for(r in c)a=Zn(f?d[r]:0,r,u),r in d||(d[r]=a.start,f&&(a.end=a.start,a.start="width"===r||"height"===r?1:0))}}function rr(e,t,n,r,i){return new rr.prototype.init(e,t,n,r,i)}x.Tween=rr,rr.prototype={constructor:rr,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(x.cssNumber[n]?"":"px")},cur:function(){var e=rr.propHooks[this.prop];return e&&e.get?e.get(this):rr.propHooks._default.get(this)},run:function(e){var t,n=rr.propHooks[this.prop];return this.pos=t=this.options.duration?x.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):rr.propHooks._default.set(this),this}},rr.prototype.init.prototype=rr.prototype,rr.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=x.css(e.elem,e.prop,""),t&&"auto"!==t?t:0):e.elem[e.prop]},set:function(e){x.fx.step[e.prop]?x.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[x.cssProps[e.prop]]||x.cssHooks[e.prop])?x.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},rr.propHooks.scrollTop=rr.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},x.each(["toggle","show","hide"],function(e,t){var n=x.fn[t];x.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ir(t,!0),e,r,i)}}),x.fn.extend({fadeTo:function(e,t,n,r){return this.filter(nn).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=x.isEmptyObject(e),o=x.speed(t,n,r),a=function(){var t=er(this,x.extend({},e),o);(i||x._data(this,"finish"))&&t.stop(!0)};return a.finish=a,i||o.queue===!1?this.each(a):this.queue(o.queue,a)},stop:function(e,n,r){var i=function(e){var t=e.stop;delete e.stop,t(r)};return"string"!=typeof e&&(r=n,n=e,e=t),n&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,n=null!=e&&e+"queueHooks",o=x.timers,a=x._data(this);if(n)a[n]&&a[n].stop&&i(a[n]);else for(n in a)a[n]&&a[n].stop&&Jn.test(n)&&i(a[n]);for(n=o.length;n--;)o[n].elem!==this||null!=e&&o[n].queue!==e||(o[n].anim.stop(r),t=!1,o.splice(n,1));(t||!r)&&x.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=x._data(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=x.timers,a=r?r.length:0;for(n.finish=!0,x.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;a>t;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}});function ir(e,t){var n,r={height:e},i=0;for(t=t?1:0;4>i;i+=2-t)n=Zt[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}x.each({slideDown:ir("show"),slideUp:ir("hide"),slideToggle:ir("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){x.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),x.speed=function(e,t,n){var r=e&&"object"==typeof e?x.extend({},e):{complete:n||!n&&t||x.isFunction(e)&&e,duration:e,easing:n&&t||t&&!x.isFunction(t)&&t};return r.duration=x.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in x.fx.speeds?x.fx.speeds[r.duration]:x.fx.speeds._default,(null==r.queue||r.queue===!0)&&(r.queue="fx"),r.old=r.complete,r.complete=function(){x.isFunction(r.old)&&r.old.call(this),r.queue&&x.dequeue(this,r.queue)},r},x.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},x.timers=[],x.fx=rr.prototype.init,x.fx.tick=function(){var e,n=x.timers,r=0;for(Xn=x.now();n.length>r;r++)e=n[r],e()||n[r]!==e||n.splice(r--,1);n.length||x.fx.stop(),Xn=t},x.fx.timer=function(e){e()&&x.timers.push(e)&&x.fx.start()},x.fx.interval=13,x.fx.start=function(){Un||(Un=setInterval(x.fx.tick,x.fx.interval))},x.fx.stop=function(){clearInterval(Un),Un=null},x.fx.speeds={slow:600,fast:200,_default:400},x.fx.step={},x.expr&&x.expr.filters&&(x.expr.filters.animated=function(e){return x.grep(x.timers,function(t){return e===t.elem}).length}),x.fn.offset=function(e){if(arguments.length)return e===t?this:this.each(function(t){x.offset.setOffset(this,e,t)});var n,r,o={top:0,left:0},a=this[0],s=a&&a.ownerDocument;if(s)return n=s.documentElement,x.contains(n,a)?(typeof a.getBoundingClientRect!==i&&(o=a.getBoundingClientRect()),r=or(s),{top:o.top+(r.pageYOffset||n.scrollTop)-(n.clientTop||0),left:o.left+(r.pageXOffset||n.scrollLeft)-(n.clientLeft||0)}):o},x.offset={setOffset:function(e,t,n){var r=x.css(e,"position");"static"===r&&(e.style.position="relative");var i=x(e),o=i.offset(),a=x.css(e,"top"),s=x.css(e,"left"),l=("absolute"===r||"fixed"===r)&&x.inArray("auto",[a,s])>-1,u={},c={},p,f;l?(c=i.position(),p=c.top,f=c.left):(p=parseFloat(a)||0,f=parseFloat(s)||0),x.isFunction(t)&&(t=t.call(e,n,o)),null!=t.top&&(u.top=t.top-o.top+p),null!=t.left&&(u.left=t.left-o.left+f),"using"in t?t.using.call(e,u):i.css(u)}},x.fn.extend({position:function(){if(this[0]){var e,t,n={top:0,left:0},r=this[0];return"fixed"===x.css(r,"position")?t=r.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),x.nodeName(e[0],"html")||(n=e.offset()),n.top+=x.css(e[0],"borderTopWidth",!0),n.left+=x.css(e[0],"borderLeftWidth",!0)),{top:t.top-n.top-x.css(r,"marginTop",!0),left:t.left-n.left-x.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||s;while(e&&!x.nodeName(e,"html")&&"static"===x.css(e,"position"))e=e.offsetParent;return e||s})}}),x.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,n){var r=/Y/.test(n);x.fn[e]=function(i){return x.access(this,function(e,i,o){var a=or(e);return o===t?a?n in a?a[n]:a.document.documentElement[i]:e[i]:(a?a.scrollTo(r?x(a).scrollLeft():o,r?o:x(a).scrollTop()):e[i]=o,t)},e,i,arguments.length,null)}});function or(e){return x.isWindow(e)?e:9===e.nodeType?e.defaultView||e.parentWindow:!1}x.each({Height:"height",Width:"width"},function(e,n){x.each({padding:"inner"+e,content:n,"":"outer"+e},function(r,i){x.fn[i]=function(i,o){var a=arguments.length&&(r||"boolean"!=typeof i),s=r||(i===!0||o===!0?"margin":"border");return x.access(this,function(n,r,i){var o;return x.isWindow(n)?n.document.documentElement["client"+e]:9===n.nodeType?(o=n.documentElement,Math.max(n.body["scroll"+e],o["scroll"+e],n.body["offset"+e],o["offset"+e],o["client"+e])):i===t?x.css(n,r,s):x.style(n,r,i,s)},n,a?i:t,a,null)}})}),x.fn.size=function(){return this.length},x.fn.andSelf=x.fn.addBack,"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=x:(e.jQuery=e.$=x,"function"==typeof define&&define.amd&&define("jquery",[],function(){return x}))})(window);

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
			return window.top;
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
	document.body.className += " platform-" + platform;
	if (platform === "safari") {
		document.documentElement.className += " html-platform-safari";
	} else if (Ext.isMobile()) 
		document.documentElement.className += " html-platform-mobile";
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
		$(document.body).addClass('organize-mode');
		
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
		return $(document.body).hasClass('organize-mode');
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
		$(document.body).removeClass('organize-mode');
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
		if (this.folder) {
			this.error = false;
			this.folder.forEachItem(this.addItem);
		} else {
			this.error = true;
			this.showError();
		}
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
		this.hideNoScreen = true;
		$(document.body).addClass('no-posts-page');
		
		fireCallback(callback);
	},
	
	clearPostsPage: function() {
		$(document.body).removeClass('no-posts-page');
		
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
		$(item.element).addClass('is-folder');
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
	},

	showError: function() {
		$(document.body).addClass("in-error");
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
		
		if (app.user.structure.base) {
			this.initializeFolder();
		} else {
			runOnLoad(this.initializeFolder, this.errorOnLoad);
		}
	},

	errorOnLoad: function() {
		PUI.alertError("Error loading everything.");
		this.stopScreenLoading();
		this.showError();
	},

	initializeFolder: function() {
		this.setFolder(app.user.structure.base);
		this.populate();
	},
	
	populate: function() {
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
		if (this.folder !== app.user.structure.base) {
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
		
		if (this.items) {
			for (var i = 0; i < this.items.length; i++) {
				var oldCount = this.items[i].get('count');
				var count = this.items[i].model.countUnreadSync()
				if (oldCount != count)
					this.items[i].set('count', count);
			}
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
		if ( this.items.length || this.hideNoScreen )
			return;

		if ( this.error || (this.postsPage && this.postsPage.error) ) {
			this.showError();
			return;
		}
		
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
	
	setPosts: function(posts, item) {
		this.stopScreenLoading();
		
		this.items = {};
		this.itemsOrdered = [];
		this.vc.history.reset();

		if ( ! posts ) {
			PUI.alertError("Error loading posts.");
		} else if ( ! posts.length ) {
			this.showNoPostsPage();
		} else {
			posts.forEach(this.addPost);
		}
		
		this.toggleShowMore();
		this.error = !! item.error;
		
		fireCallback(this.onSetPostsDone, posts);
	},
	
	addPost: function(post) {
		var item = this.template.addItem('posts', post);
		this.items[post.id] = item;
		this.itemsOrdered.push(item);
		this.vc.history.addAction(post);

		if ( this.vc.queue.contains(post.id) )
			$(item.element).addClass('queued');

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
		
		this.vc.history.setActiveAction(post);

		post.markAsRead(this.checkUnread);
		this.rememberScreen();
		
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
	
	rememberScreen: function() {
		if ( this.feed.hasUnread() )
			this.vc.storeScreenChain();
		else
			this.vc.forgetScreenChain();
	},
	
	queueChanged: function(id, isNew) {
		TRYIT(function() {
			if ( ! this.items[id] )
				return;
			$(this.items[id].element)[isNew ? 'addClass' : 'removeClass']('queued');
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
			$(this.itemsOrdered[this.currentHighlightedIndex].element).removeClass("active-highlighted");

		this.currentHighlightedIndex = index;

		var currentElement = this.itemsOrdered[this.currentHighlightedIndex];

		if (currentElement)
			$(currentElement.element).addClass("active-highlighted");

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
Screen.Folders = Controller.extend({
	template: 'screen#folders',
	
	events: {
		'click .add': 'addNewFolder',
		'click .tpl-folder-item': 'changeFolder'
	},
	
	start: function() {
		this.template.set('title', _('Folders'));

		PUI.Sort.addDrop('.add', this.onAddDrop);
		PUI.Sort.addDrop('.tpl-breadcrumb', this.onFolderDrop);
		PUI.Sort.addDrop('.tpl-list-item-feed.is-folder', this.onFolderDrop);
		PUI.Sort.addDrop('.tpl-list-item-feed.is-folder', this.onFolderDrop);
		PUI.Sort.addDrop('.tpl-screen-folders .tpl-folder-item', this.onFolderDrop);
		
		this.makeSortable();
		this.reload();
		
		this.vc.listener.listen("folder:updated", this.foldersChanged);
		this.vc.listener.listen("folder:added", this.foldersChanged);
		this.vc.listener.listen("folder:removed", this.foldersChanged);
	},
	
	destroy: function() {
		this.vc.listener.unlisten("folder:updated", this.foldersChanged);
		this.vc.listener.unlisten("folder:added", this.foldersChanged);
		this.vc.listener.unlisten("folder:removed", this.foldersChanged);
	},
	
	foldersChanged: function() {
		this.reload();
	},
	
	reload: function() {
		this.itemMap = {};
		this.template.setItems('folder', []);
		this.addFolder(app.user.structure.base, 1);
		
		this.sortable.options.dropAreas = [this.template.element.find('.base-folder')];
		
		if ( this.highlightedFolderId )
			this.highlightFolder(this.highlightedFolderId);
	},
	
	setFolders: function(folder, level) {
		var addFolder = this.addFolder;
		folder.forEachFolder(function(f) {
			addFolder(f, level);
		});
	},
	
	addFolder: function(folder, level) {
		var item = this.template.addItem('folder', folder);
		$(item.element).addClass('level-' + level);
		
		this.itemMap[folder.id] = item;
		
		if ( ! folder.standard)
			this.sortable.add(item.element);
		else
			$(item.element).addClass('base-folder');
		
		this.setFolders(folder, level+1);
	},
	
	makeSortable: function() {
		this.sortable = new PUI.Sort({
			droppable: '.tpl-folder-item',
			disableSort: true,
			onMove: this.onMove,
			onDrop: this.onDropOnElement,
			onDropArea: this.onDropOnArea,
			onEnd: this.onDropOrder,
			sortOptions: {
				processGhost: this.processGhost,
				waitForDrag: true
			},
			dropAreas: [
				this.template.element.find('.back')
			]
		});
		
		this.template.element.find('.tpl-list-item-feed').forEach(this.makeSortable);
	},
	
	onDropOrder: function(sortable) {
		this.currentDragged.removeClass('in-sort');
	},
	
	onDropOnElement: function(drop, current) {
		var dropFolder = drop.el[0].store.model;
		var currentFolder = current.el[0].store.model;
		
		currentFolder.getParent().removeFolder(currentFolder.id);
		dropFolder.addFolder(currentFolder.id);
		
		app.user.structure.save();
		
		// TODO: FIXME: Not sure if this is good...
		app.events.send("folder:updated", {folder: currentFolder.id});
		app.events.send("folder:updated", {folder: dropFolder.id});
		app.events.send("folder:updated", {folder: dropFolder.getParent().id});
		
		this.reload();
	},
	
	onDropOnArea: function(el, current) {
		this.onDropOnElement({el: el}, current);
	},
	
	processGhost: function(ghost, sortable) {
		var container = $('<div></div>');
		container.append(ghost);
		
		var folder = sortable.el[0].store.model;
		this.currentDragged = $(sortable.el[0]);
		
		var elements = [], itemMap = this.itemMap, currentDragged = this.currentDragged;
		
		// Also grab folders within this folder
		folder.forEachFolderRecursively(function(f) {
			var el = $(itemMap[f.id].element);
			container.append(el.clone());
			el.addClass('in-sort');
			
			currentDragged.push(el[0]);
		});
		
		container.children().addClass('ghost');
		
		return container;
	},
	
	onMove: function(current, sort, dir) {
		this.currentDragged.insertAfter(current.el);
	},
	
	highlightFolder: function(folderId) {
		this.highlightedFolderId = folderId;
		
		this.template.element.find('.tpl-folder-item').removeClass('active').get().forEach(function(el) {
			if ( el.store.model.id === folderId)
				$(el).addClass('active');
		});
	},
	
	addNewFolder: function() {
		main.controllers.main.currentScreen.organizeAddFolder();
	},
	
	/* Global drops */
	
	onAddDrop: function(el, sortable) {
		var item = sortable.el[0].store.model;
		var currentFolder = main.getCurrentFolder();
		
		var moveToFolder = this.moveToFolder;
		
		if ( ! currentFolder.standard && ! app.user.canHaveNestedFolders() ) {
			PUI.alert(_("Google Reader can't have nested folders."));
			return;
		}
		
		PUI.prompt(_("Add to new folder:"))
		.yes(function(name) {
			chain(app.user.structure.addNewFolderToFolder, name, currentFolder.id)
			.then(function(f) {
				moveToFolder(f, item);
		
				app.events.send('folder:added', {folder: f.id});
			});
		});
	},
	
	onFolderDrop: function(el, sortable) {
		var dropFolder = el[0].store.model;
		var item = sortable.el[0].store.model;
		
		this.moveToFolder(dropFolder, item);
	},
	
	moveToFolder: function(newFolder, item) {
		if ( ! newFolder.standard && item.isFolder && ! app.user.canHaveNestedFolders() ) {
			PUI.alert(_("Google Reader can't have nested folders."));
			return;
		}
		
		var oldFolder;
		if ( item.isFolder)
			oldFolder = item.getParent();
		else
			oldFolder = main.getCurrentFolder();
		
		// You can't move a folder into itself
		if ( item.isFolder && (newFolder.id == item.id || item.hasFolderRecursively(newFolder.id)) )
			return this.reload();
		
		oldFolder.removeItem(item);
		newFolder.addItem(item);
		
		app.user.structure.save(function() {
			app.events.send("folder:updated", {folder: oldFolder.id, reason: 'order'});
			app.events.send("folder:updated", {folder: newFolder.id, reason: 'order'});
			if ( item.isFeed )
				app.events.send('feed:updated', {feed: item.id, reason: 'category', from: oldFolder.id, to: newFolder.id});
		});
	},
	
	changeFolder: function(e) {
		main.gotoFolder(e.item.model);
	}
});
;
Screen.ImportExport = Controller.extend({
	template: 'screen#import-export',
	
	events: {
		'click .export': 'export',
		'click .import': 'import',
		'change input[type=file]': 'upload'
	},
	
	start: function() {
		this.importFile = this.template.element.find('input[type=file]');
		this.exportThings = this.template.element.find('.export-things');
		
		this.onlyImport();
	},
	
	onlyImport: function() {
		if ( app.user.hasFeeds() ) {
			this.template.set('title', _('Import/Export feeds'));
			this.exportThings.show();
			this.template.element.removeClass('only-import');
			return;
		}
			
		this.template.set('title', _('Import feeds'));
		this.exportThings.hide();
		
		this.template.element.addClass('only-import');
	},
	
	export: function() {
		ExportImport.Export.downloadFile();
	},
	
	import: function() {
		// Safari can't open dialog in popup, and since options page is in popup...
		if ( Ext.isSafari() ) {
			app.events.subscribe("import:contents", this.importContentsRetrieved);
			UI.openTab(Ext.path("options/import.html"));
			UI.closePopup();
			return;
		}
		this.importFile[0].click();
	},
	
	importContentsRetrieved: function(evt) {
		app.events.unsubscribe("import:contents", this.importContentsRetrieved);
		UI.closeTab(evt.tab);
		UI.showPopup();
		this.uploadDone(evt.contents);
	},
	
	upload: function() {
		readFileInput(this.importFile[0], this.uploadDone);
	},
	
	uploadDone: function(res) {
		if ( ! res )
			return this.problem();
		
		app.events.subscribe("sync:merge", this.mergeStatusChanged);
		this.loadingWindow = PUI.alertLoader(_("Importing..."));
		
		var importer = new ExportImport.Import(res);
		importer.load(this.importDone);
	},
	
	mergeStatusChanged: function(evt) {
		this.loadingWindow.setText(evt.status);
	},
	
	importDone: function(res) {
		this.onlyImport.delay(100);
		
		if ( ! res ) {
			fireCallback(this.importDoneCallback, false);
			return this.problem();
		}
		
		this.importFile.val("");
		this.loadingWindow.destroy();
		PUI.alert(_("Done!"));
		
		app.events.send("folder:updated", {folder: app.user.structure.base.id});
		
		fireCallback(this.importDoneCallback, true);
	},
	
	problem: function() {
		PUI.alert(_("A problem occured.\n\nPlease contact: erik.rothoff@gmail.com"));
	}
});
;
Screen.Themes = Controller.extend({
	template: 'screen#themes',
	
	events: {
		'change .theme-container input[type=radio]': 'changeTheme'
	},
	
	start: function() {
		this.template.set('title', _('Pick a theme, any theme'));
		
		app.user.preferences.allThemes.forEach(this.addTheme);
	},
	
	addTheme: function(theme) {
		var item = this.template.addItem('themes', theme);
		if ( this.isSelected(theme.identifier) )
			$(item.element).find("input[type=radio]").attr("checked", true);
	},
	
	isSelected: function(ident) {
		return app.user.preferences.get("activeTheme") == ident;
	},
	
	initThemes: function() {
		this.removeThemes();
		this.template.element.find('.theme').forEach(this.replaceWithTheme);
	},
	
	removeThemes: function() {
		this.template.element.find('.theme').forEach(function(theme) {
			$(theme).find('iframe').remove();
		});
	},
	
	replaceWithTheme: function(el) {
		var iframe = document.createElement('iframe');
		iframe.style.visibility = "hidden";
		iframe.onload = function() {
			iframe.style.visibility = "visible";
		}
		iframe.src = '../popup.html?theme=' + $(el).closest('.theme-container').attr('data-theme');

		el.appendChild(iframe);
	},
	
	changeTheme: function(e) {
		app.user.preferences.set('activeTheme', e.item.get("identifier"));
	}
});

;
Screen.Menu = Controller.extend({
	template: 'screen#menu'
});
;
var PUI = {};
;
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
		$(active).addClass('highlighted');
		order.forEach(function(p) {
			$(p.el).removeClass('highlighted');
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
		this.container.find('.pui-alert-text').html(text.replace(/\n/g, '<br>')).on('click', 'a', function(e) {
			if (!Ext.isOnline()) {
				e.preventDefault();
				UI.openTab(this.href);
			}
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

PUI.alertError = function(text) {
	PUI.alert(text + "\nIf the problem persists, visit <a href='http://feeder.co/support' target=_blank>support</a>")
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
PUI.SpeechBubble = PUI.Modal.extend({
	initialize: function(text, pointX, pointY) {
		this._super();
		
		this.container.addClass('pui-speech-bubble');
		this.container.append($('<div class="pui-text"></div>').html(text.replace(/\n/g, '<br>')));
		
		this.pointX = pointX;
		this.pointY = pointY;
	}
});

PUI.speechBubble = function(text, x, y) {
	var win = new PUI.SpeechBubble(text, x, y);
	win.show();
	return win;
};
;
PUI.ScreenModal = PUI.Modal.extend({
	initialize: function(screenClass) {
		this._super();
		
		this.screenClass = screenClass;
		
	},
	
	show: function() {
		this._super();
		
		this.instance = new this.screenClass();
		this.container.append(this.instance.template.container);
		
		this.overlay.on('click', this.destroy);
		
		this.position();
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
	$(element)[starred ? 'addClass' : 'removeClass']('is-starred');
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
;
var ViewController = Class.extend({
	animationDuration: 300,

	initialize: function(container) {
		this.container = $(container)[0];

		this.screenStack = [];
		this.animationCallbacks = [];

		this.listener = new EventListener(this.container);
	},
	
	onScreenChange: function() {},

	isPopup: function() {
		return !! document.getElementById('is-popup');
	},

	getScrollElement: function() {
		if (! this.scrollElement) {
			this.scrollElement = $(this.container).parents('[data-scroll-main]')[0] || document.body;
		}
		return this.scrollElement;
	},	
	
	scrollTo: function(y) {
		$(this.getScrollElement()).scrollTop(y);
	},
	
	setCurrentScreen: function(page, callback) {
		this.scrollTo(0);
		
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
		if (!to) {
			console.log("Bad to sent")
			return;
		}
		
		this.scrollTo(0);		

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
var Context = ViewController.extend({
	initialize: function(el) {
		this.history = new ActionHistory();

		var container = document.createElement('div');
		container.className = "context-container";
		
		var attrs = el.getAllAttributes();
		for ( var key in attrs ) if ( attrs.hasOwnProperty(key) ) {
			if ( key === "class" )
				container.className += " " + attrs[key];
			else if ( ! ["name"].contains(key) )
				container.setAttribute(key, attrs[key]);
		}
		
		this._super(container);
	
		var controller = Screen[el.getAttribute('name')];
		
		if ( ! controller )
			throw new Error("Controller for context named Screen." + el.getAttribute('for') + " not found");
	
		this.startController = controller;
	},
	
	start: function() {
		Screen.currentVC = this;
		this.setCurrentScreen(new this.startController());
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
			if ( ! feed || ! feed.path )
				return null;
			
			return {
				'@text': (feed.title || feed.path).encodeHTML(),
				'@title': (feed.title || feed.path).encodeHTML(),
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
			if ( ! folder || ! folder.name )
				return null;
			
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

var isLoaded = false;
var isLoadedDone = false;

function runOnLoad(callback, errorCallback) {
	Init.callbacks.push({success: callback, error: errorCallback || function() {}});
}

function trackSafariPageView() {
	if (! Ext.isSafari())
		return;
	_gaq.push(['_trackPageview']);
}

function reloadProClasses() {
	if (app.user.isPro() || Ext.isOnline()) {
		$(document.body).addClass("is-pro");
	} else {
		$(document.body).removeClass("is-pro");
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

		Init.initGlobalVariables();
		if ( Ext.isChrome() )
			Init.chromeFixPortScopingIssues();
		
		if (Ext.isSafari())
			window.addEventListener('unload', Init.safariPopupCleanup, false);

		window.addEventListener('load', Init.onDOMLoad, false);
	},

	// In this page the popup has fully loaded, but we don't know if the backend is here yet
	// It might be that the backend is error'd
	onDOMLoad: function() {
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
		Init.initGlobalVariables();
		reloadProClasses();
		
		if (Ext.isSafari())
			Init.safariSetPageViewTracking();
		
		Init.removeLoader();
		Init.errorHide();

		Init.fireCallbacks();
	},

	initGlobalVariables: function() {
		app = Ext.getBackgroundPage().app;
		Platform = Ext.getBackgroundPage().Platform;
		UI = Ext.getBackgroundPage().UI;
	},

	fireCallbacks: function() {
		var isError = app.isFailedState();
		for (var i = 0; i < Init.callbacks.length; i++) {
			var callbacks = Init.callbacks[i];
			if (isError)
				callbacks.error();
			else
				callbacks.success();
		}
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
		$('.popup-content').css('min-height', $(window).height() + 60);
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
var Options = Class.extend({
	events: {
		'click .tpl-breadcrumb': 'gotoBreadcrumb',
		'screen:navigate .main-context': 'navigated',
		'click .menu-item': 'menuClick',
		'click .tpl-bar-breadcrumbs .add': 'addFeed',
		'click #options-theme > div': 'changeOptionsTheme',
		'click #support-us-button, #support-us-button-popup': 'openPaypal',
		'click #support-close-btn': 'closeSupportUs',
		'click .return-to-popup, .back-to-feeds': 'returnToPopup',
		'click #footer-text a': 'openLink',
		'click #social-bar a': 'openLink',
		'click .get-feeder-pro': 'getFeederPro'
	},
	
	pageMap: {
		'main': 'tpl-page-organize',
		'settings': 'tpl-page-settings',
		'themes': 'tpl-page-themes'
	},
	
	initialize: function() {
		this.template = new PUI.Template('screen#options');
		this.template.prepareVariables(this);
		
		this.event = new PUI.Events(document.body, this);
		this.event.add(this.events || {});
		
		this.container = document.getElementById('container');
		this.container.appendChild(this.template.container);
		
		this.listener = new EventListener(this.container);
		
		$(document.body).addClass('organize-mode');
		$(document.documentElement).addClass('options-page');
		
		this.controllers = this.template.getControllers();
		
		this.setTheme();
	},
	
	addFeed: function() {
		this.controllers.main.showAddScreen();
	},
	
	start: function() {
		this.pageContainer = this.template.element.find('#page');
		this.menu = this.template.element.find('.menu');
		
		this.gotoPage('tpl-page-organize');
		
		this.forOrganize();
		this.forSettings();
		this.forTheme();
		
		if ( queryStringGet('page') && this.pageMap[queryStringGet('page')] ) {
			this.gotoPage(this.pageMap[queryStringGet('page')]);
		}
		
		if ( queryStringGet('run') && this.pageMap[queryStringGet('page')] && this.controllers[queryStringGet('page')].currentScreen[queryStringGet('run')] ) {
			this.controllers[queryStringGet('page')].currentScreen[queryStringGet('run')]();
		}
		
		if ( queryStringGet('with_intent') === 'feed' ) {
			this.controllers.main.currentScreen.fromWebintent();
		}
		
		if ( queryStringGet('support_us') === 'true' ) {
			this.showSupportUsPopup();
		}
	},
	
	forOrganize: function() {
		this.setCurrentFolder(this.getCurrentFolder());
		this.controllers.main.disableScreenAnimation = true;
	},
	
	forSettings: function() {
		
	},
	
	forTheme: function() {
	
	},
	
	onTheme: function() {
		this.controllers.themes.initThemes();
	},
	
	offTheme: function() {
		this.controllers.themes.removeThemes();
	},
	
	setCurrentFolder: function(folder) {
		if ( ! folder )
			return;
		
		this.template.set('title', folder.name);
		this.template.setItems('crumb', folder.getStructure().reverse());
		
		if ( this.controllers ) {
			this.controllers.folders.highlightFolder(folder.id);
			this.controllers.main.currentFolderId = folder.id;
		}
	},
	
	getCurrentFolder: function() {
		return this.controllers.main.currentScreen.folder;
	},
	
	gotoBreadcrumb: function(e) {
		this.gotoFolder(app.user.structure.folder(e.item.model.id));
	},
	
	gotoFolder: function(folder) {
		if ( folder.standard )
			return this.controllers.main.toHome();
		
		var stack = this.controllers.main.screenStack;
		for ( var i = 0, obj; obj = stack[i]; i++ )
			if ( obj.folder == folder.id )
				return this.controllers.main.toIndex(i);
				
		// No folder found? Pump it up the stack
		this.controllers.main.pushToFolders(folder);
	},
	
	navigated: function(e) {
		this.setCurrentFolder(e.page.folder);
	},
	
	menuClick: function(e) {
		if ($(e.target).closest('.profile-settings').length) {
			UI.openTab(app.config.feeder.profileSettingsURL)
			return;
		}
		this.gotoPage(e.currentTarget.getAttribute('data-page'));
	},
	
	gotoPage: function(page) {
		this.pageContainer.children().addClass('hidden');
		var current = this.template.element.find('.' + page);
		current.removeClass('hidden');
		
		this.menu.find('.menu-item').removeClass('active').filter('[data-page="' + page + '"]').addClass('active');
		
		if ( page === "tpl-page-theme" ) {
			this.onTheme();
		} else if ( this.prevPage === "tpl-page-theme" ) {
			this.offTheme();
		}
		
		this.prevPage = page;
	},
	
	changeOptionsTheme: function(e) {
		var theme = e.target.getAttribute('data-theme');
		app.user.preferences.set("options:theme", theme);
		
		this.setTheme();
	},
	
	setTheme: function() {
		if ( app.user.preferences.get('options:theme') === 'wood' )
			$(document.body).addClass('theme-wood');
		else
			$(document.body).removeClass('theme-wood');
	},
	
	openPaypal: function(e) {
		e.preventDefault();
		if (Ext.isSafari())
			return this.sendDonationPaypal(e);
		$(e.target).closest('form').submit();
	},

	sendDonationPaypal: function(e) {
		Platform.env.safariSubmitFormFromPopup($(e.target).closest('form')[0]);
		UI.closePopup();
		
		$('.tpl-popup-support-us').hide();
	},
	
	closeSupportUs: function(e) {
		e.preventDefault();
		$('.tpl-popup-support-us').hide();
	},
	
	showSupportUsPopup: function() {
		$('.tpl-popup-support-us').show();
	},
	
	returnToPopup: function() {
		document.body.style.WebkitTransition = "opacity 300ms";
		setTimeout(function() {
			document.body.style.opacity = "0";
		}, 0);
		setTimeout(function() {
			UI.setPopupSize(app.config.popupSize.width, app.config.popupSize.height);
			document.location = Ext.path("popup/popup.html");		
		}, 300);
	},
	
	openLink: function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		UI.closePopup();
		UI.openTab($(e.target).closest('a').attr('href'));
	},

	getFeederPro: function(e) {
		main.controllers.main.currentScreen.getFeederPro()
	}
});

runOnLoad(function() {
	main = new Options();
	main.start();
	
	trackSafariPageView();
});

;
if (Ext.isOnline()) {
	document.body.className += " fat-top-bar";
}

if (Ext.isChrome()) {
	document.body.className += " transition-transform-bug";
} else {
	document.body.className += " no-transition-transform-bug";
}

if (Modernizr.touch) {
	document.body.className += " touch";
} else {
	document.body.className += " no-touch";
}
;
var _gaq = _gaq || [];
_gaq.push(['_setAccount', ! window.safari ? 'UA-19457192-1' : 'UA-19457192-2']);

if (!window.safari)
	_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
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