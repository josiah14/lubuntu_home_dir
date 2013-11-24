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
