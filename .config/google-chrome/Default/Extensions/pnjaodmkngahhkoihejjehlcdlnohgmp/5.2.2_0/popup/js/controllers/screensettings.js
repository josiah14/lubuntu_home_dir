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
