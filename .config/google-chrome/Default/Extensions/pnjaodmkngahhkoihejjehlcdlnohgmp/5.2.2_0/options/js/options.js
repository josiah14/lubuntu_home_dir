var Options = Class.extend({
	events: {
		'click .tpl-breadcrumb': 'gotoBreadcrumb',
		'screen:navigate .main-context': 'navigated',
		'click .menu-item': 'menuClick',
		'click .tpl-bar-breadcrumbs .add': 'addFeed',
		'click #options-theme > div': 'changeOptionsTheme',
		'click #support-us-button, #support-us-button-popup': 'openPaypal',
		'click #support-close-btn': 'closeSupportUs',
		'click .return-to-popup, .back-to-feeds': 'returnToPopup',
		'click #footer-text a': 'openLink',
		'click #social-bar a': 'openLink',
		'click .get-feeder-pro': 'getFeederPro'
	},
	
	pageMap: {
		'main': 'tpl-page-organize',
		'settings': 'tpl-page-settings',
		'themes': 'tpl-page-themes'
	},
	
	initialize: function() {
		this.template = new PUI.Template('screen#options');
		this.template.prepareVariables(this);
		
		this.event = new PUI.Events(document.body, this);
		this.event.add(this.events || {});
		
		this.container = document.getElementById('container');
		this.container.appendChild(this.template.container);
		
		this.listener = new EventListener(this.container);
		
		$(document.body).addClass('organize-mode');
		$(document.documentElement).addClass('options-page');
		
		this.controllers = this.template.getControllers();
		
		this.setTheme();
	},
	
	addFeed: function() {
		this.controllers.main.showAddScreen();
	},
	
	start: function() {
		this.pageContainer = this.template.element.find('#page');
		this.menu = this.template.element.find('.menu');
		
		this.gotoPage('tpl-page-organize');
		
		this.forOrganize();
		this.forSettings();
		this.forTheme();
		
		if ( queryStringGet('page') && this.pageMap[queryStringGet('page')] ) {
			this.gotoPage(this.pageMap[queryStringGet('page')]);
		}
		
		if ( queryStringGet('run') && this.pageMap[queryStringGet('page')] && this.controllers[queryStringGet('page')].currentScreen[queryStringGet('run')] ) {
			this.controllers[queryStringGet('page')].currentScreen[queryStringGet('run')]();
		}
		
		if ( queryStringGet('with_intent') === 'feed' ) {
			this.controllers.main.currentScreen.fromWebintent();
		}
		
		if ( queryStringGet('support_us') === 'true' ) {
			this.showSupportUsPopup();
		}
	},
	
	forOrganize: function() {
		this.setCurrentFolder(this.getCurrentFolder());
		this.controllers.main.disableScreenAnimation = true;
	},
	
	forSettings: function() {
		
	},
	
	forTheme: function() {
	
	},
	
	onTheme: function() {
		this.controllers.themes.initThemes();
	},
	
	offTheme: function() {
		this.controllers.themes.removeThemes();
	},
	
	setCurrentFolder: function(folder) {
		if ( ! folder )
			return;
		
		this.template.set('title', folder.name);
		this.template.setItems('crumb', folder.getStructure().reverse());
		
		if ( this.controllers ) {
			this.controllers.folders.highlightFolder(folder.id);
			this.controllers.main.currentFolderId = folder.id;
		}
	},
	
	getCurrentFolder: function() {
		return this.controllers.main.currentScreen.folder;
	},
	
	gotoBreadcrumb: function(e) {
		this.gotoFolder(app.user.structure.folder(e.item.model.id));
	},
	
	gotoFolder: function(folder) {
		if ( folder.standard )
			return this.controllers.main.toHome();
		
		var stack = this.controllers.main.screenStack;
		for ( var i = 0, obj; obj = stack[i]; i++ )
			if ( obj.folder == folder.id )
				return this.controllers.main.toIndex(i);
				
		// No folder found? Pump it up the stack
		this.controllers.main.pushToFolders(folder);
	},
	
	navigated: function(e) {
		this.setCurrentFolder(e.page.folder);
	},
	
	menuClick: function(e) {
		if ($(e.target).closest('.profile-settings').length) {
			UI.openTab(app.config.feeder.profileSettingsURL)
			return;
		}
		this.gotoPage(e.currentTarget.getAttribute('data-page'));
	},
	
	gotoPage: function(page) {
		this.pageContainer.children().addClass('hidden');
		var current = this.template.element.find('.' + page);
		current.removeClass('hidden');
		
		this.menu.find('.menu-item').removeClass('active').filter('[data-page="' + page + '"]').addClass('active');
		
		if ( page === "tpl-page-theme" ) {
			this.onTheme();
		} else if ( this.prevPage === "tpl-page-theme" ) {
			this.offTheme();
		}
		
		this.prevPage = page;
	},
	
	changeOptionsTheme: function(e) {
		var theme = e.target.getAttribute('data-theme');
		app.user.preferences.set("options:theme", theme);
		
		this.setTheme();
	},
	
	setTheme: function() {
		if ( app.user.preferences.get('options:theme') === 'wood' )
			$(document.body).addClass('theme-wood');
		else
			$(document.body).removeClass('theme-wood');
	},
	
	openPaypal: function(e) {
		e.preventDefault();
		if (Ext.isSafari())
			return this.sendDonationPaypal(e);
		$(e.target).closest('form').submit();
	},

	sendDonationPaypal: function(e) {
		Platform.env.safariSubmitFormFromPopup($(e.target).closest('form')[0]);
		UI.closePopup();
		
		$('.tpl-popup-support-us').hide();
	},
	
	closeSupportUs: function(e) {
		e.preventDefault();
		$('.tpl-popup-support-us').hide();
	},
	
	showSupportUsPopup: function() {
		$('.tpl-popup-support-us').show();
	},
	
	returnToPopup: function() {
		document.body.style.WebkitTransition = "opacity 300ms";
		setTimeout(function() {
			document.body.style.opacity = "0";
		}, 0);
		setTimeout(function() {
			UI.setPopupSize(app.config.popupSize.width, app.config.popupSize.height);
			document.location = Ext.path("popup/popup.html");		
		}, 300);
	},
	
	openLink: function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		UI.closePopup();
		UI.openTab($(e.target).closest('a').attr('href'));
	},

	getFeederPro: function(e) {
		main.controllers.main.currentScreen.getFeederPro()
	}
});

runOnLoad(function() {
	main = new Options();
	main.start();
	
	trackSafariPageView();
});
