var Application = Class.extend({
	initialize: function() {
		this.id = Application.counterID++;
		this.retryTimes = 0;

		this.store = new CacheStore(this);
	},
	
	destroy: function(callback) {
		this.isDestroyed = true;
		
		chain(this.poller.destroy)
		.and(this.updater.destroy)
		.and(this.finder.destroy)
		.and(this.ui.destroy)
		.and(this.sync.destroy)
		.and(this.user.destroy)
		.and(this.events.destroy)
		.and(function() {
			callback();
		});
	},
	
	'get ready to rumble!': function(callback) {
		this.config = Config;
		
		this.user = new User(this); // The "user"
		
		this.events   = new FeedEvents(this);  // Push out updates when new feeds are available
		this.poller   = new FeedPoller(this);  // Keep track of when feeds need to be updated
		this.updater  = new FeedUpdater(this); // Load and parse RSS feeds
		this.finder   = new FeedFinder(this);  // Listen for RSS feeds
		this.sync     = new FeedSync(this);    // Sync everything with external services, like Google Reader
		this.notifications = new FeederNotifications(); // Search a special "feed" for notifications

		this.ui      = new AppUI(this); // Take care of platform specific UI settings that can only be set from the background
		
		var importer = new Importer(this);
		chain(this.user.install)
		.and(importer.install)
		.and(importer.migrateDB)
		.and(importer.importOldFolders)
		.and(this.user.fixOrphanFeeds)
		.and(this.ready)
		.then(callback);
	},
	
	ready: function(callback) {
		var application = this;
		
		chain(this.sync.startSyncing)
		.and(this.sync.fetchUpstream)
		.and(function() {
			app.user.countUnread(function() {});

			if (! app.isFailedState()) {
				app.startListeners();
			} else {
				setTimeout(app.retryInitialize, Config.retryInitializeTimeout)
			}

			application.ui.setBadge();
			application.loaded();

			window.backendIsLoaded = true;
			backendLoadComplete();
			
			callback(application);
		});
	},
	
	onLoad: function(callback) {
		if ( this.isLoaded )
			return fireCallback(callback);
		this.onLoadCallback = callback;
	},
	
	loaded: function() {
		this.isLoaded = true;
		fireCallback(this.onLoadCallback);
	},

	startListeners: function() {
		this.updater.startListening();
		this.poller.startPolling();
		this.finder.startListening();
		this.ui.startListening();
		this.notifications.check();
	},

	isFailedState: function() {
		return app.sync.isFailedState();
	},

	// Retry can either:
	//  - fail, in which case we say so
	//  - work, in which case we say so
	retryInitialize: function(callback) {
		console.log("Asked to retry (%s time)", this.retryTimes);
		
		// Only retry 2 times
		//  1. Upon backend load, we wait X seconds, and retry
		//  2. After popup is loaded first time, and we realize the backend is broken
		if (app.retryTimes >= 2)
			return fireCallback(callback, false);
		
		console.log("... Retrying");

		app.retryTimes++;

		chain(app.sync.fetchUpstream)
		.then(function() {
			if (app.isFailedState())
				return fireCallback(callback, false);

			app.startListeners();
			chain(app.user.reload)
			.end(callback, true);
		});
	}
});

Application.counterID = 0;

var isBackground = true;

// ✔