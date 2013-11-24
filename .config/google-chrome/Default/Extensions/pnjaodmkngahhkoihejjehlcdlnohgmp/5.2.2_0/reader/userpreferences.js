var UserPreferences = Class.extend({
	defaults: {
		'global:updateInterval': Config.defaultUpdateInterval,
		'global:postsDisplay': Config.defaultNumPosts,
		'global:openPostsInNewTab': true,
		'global:notifications': false,
		'global:useSkimlinks': true,
		'popup:filter': 'all',
		'sync:google': false,
		'options:theme': 'normal',
		'activeTheme': 'theme-light',
		'global:useSkimlinks': true,
		'global:useReadability': false,
		'global:showUnreadCountInBadge': true
	},
	
	allThemes: [
		{name: "Light", identifier: "theme-light", image: Ext.path("popup/css/gfx/theme-light.png")},
		{name: "Dark", identifier: "theme-dark", image: Ext.path("popup/css/gfx/theme-dark.png")}
	],
	
	initialize: function() {
		if ( this.get('activeTheme') == "theme-mint" )
			this.set('activeTheme', 'theme-light');
	},
	
	get: function(key) {
		var item = localStorage.getItem(key);
		try {
			item = JSON.parse(item);
		} catch (e) {
			if ( item )
				return item;
		}
		if ( item === null && typeof this.defaults[key] !== "undefined" )
			return this.defaults[key];
		return item;
	},
	
	set: function(key, value, quiet) {
		var oldValue = localStorage.getItem(key);
		var newValue = JSON.stringify(value);
		
		if ( oldValue === newValue )
			return;
		
		localStorage.setItem(key, newValue);
		
		if ( window.app && window.app.events && ! quiet )
			app.events.send("preferences:changed", {key: key});
	},
	
	setQuiet: function(key, value) {
		this.set(key, value, true);
	},
	
	remove: function(key) {
		localStorage.removeItem(key);
	},
	
	getAll: function() {
		var ret = {};
		for ( var key in this.defaults ) if ( this.defaults.hasOwnProperty(key) )
			ret[key] = this.get(key);
		return ret;
	}
});