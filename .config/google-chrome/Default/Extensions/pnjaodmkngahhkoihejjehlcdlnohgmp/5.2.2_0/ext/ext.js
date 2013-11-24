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