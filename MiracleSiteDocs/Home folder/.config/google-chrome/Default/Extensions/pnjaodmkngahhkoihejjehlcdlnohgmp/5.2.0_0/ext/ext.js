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