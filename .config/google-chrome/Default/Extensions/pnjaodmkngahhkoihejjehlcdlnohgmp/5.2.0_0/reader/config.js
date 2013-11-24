var FeederRoot = localStorage.feederRoot || "http://feeder.co";

if (document.location.protocol === "http:" || document.location.protocol === "https:")
	FeederRoot = localStorage.feederRoot = "http://" + document.location.host;

var Config = {
	icon: {
		addFeed: ! Ext.isSafari() ? Ext.path('icons/icon-add.png') :  Ext.path('icons/safari-icon-add.png'),
		standard: ! Ext.isSafari() ? Ext.path('icons/icon.png') :  Ext.path('icons/safari-icon.png')
	},
	
	images: {
		folder: Ext.path('icons/folder_2x.png')
	},
	
	feeder: {
		root: FeederRoot,
		connectURL: FeederRoot + "/pro?flow=ext",
		loginUrl: FeederRoot + "/login?flow=login",
		logoutUrl: FeederRoot + "/logout",
		checkURL: FeederRoot + "/api/feeder/check",
		destroyTokenURL: FeederRoot + "/api/feeder/invalidate-token",
		postURL: FeederRoot + "/api/post/{post_id}?redirect_if_empty=true",
		profileSettingsURL: FeederRoot + "/pro/file"
	},
	
	pollTimeout: 30*1000,
	onLoadPollTimeout: 5*1000,
	retryInitializeTimeout: 10*1000,
	
	defaultUpdateInterval: 10*60*1000,
	
	maxConcurrentUpdates: 30,
	maxPostsPerFeedFile: 50,
	
	defaultNumPosts: 30,
	minNumberOfPosts: 105,
	
	feederBlog: "http://blog.feeder.co/rss",
	feederNotificationsURL: "http://notifications.feeder.co/rss",

	feederNotificationCheckInterval: 60*60*6*1000,
	
	optionsPageSize: {
		width: 1000,
		height: 600
	},
	
	popupSize: {
		width: 337,
		height: 412
	},
	
	defaultFavicon: function(path) {
		if ( ! path )
			return Config.defaultFaviconPath;
		
		if ( Ext.isChrome() ) {
			return "chrome://favicon/" + path;
		} else if ( Ext.isSafari() ) {
			return TRYIT(function() {
				return "http://s2.googleusercontent.com/s2/favicons?domain=" + (new URI(this.path)).domain();
			}, this);
		}
	},

	defaultFaviconPath: Ext.path("icons/default-icon.png"),
	
	postsSort: ['published desc', 'id desc']
};
