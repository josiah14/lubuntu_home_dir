if ( window.chrome && window.chrome.extension )
	chrome.extension.sendRequest({type: "google:auth", title: document.title});
else if ( window.safari && window.safari.self ) {
	window.addEventListener('DOMContentLoaded', function() {
		safari.self.tab.dispatchMessage("google:auth", {title: document.title});
	}, false);
}