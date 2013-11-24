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