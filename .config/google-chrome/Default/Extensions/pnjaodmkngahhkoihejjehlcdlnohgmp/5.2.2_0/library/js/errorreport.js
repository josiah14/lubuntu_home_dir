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