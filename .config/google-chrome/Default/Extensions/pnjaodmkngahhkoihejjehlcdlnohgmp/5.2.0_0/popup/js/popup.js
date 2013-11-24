var Popup = ViewController.extend({
	initialize: function() {
		this._super('popup-content');
		
		this.refreshTheme();
		
		this.setCurrentFilter(app.user.preferences.get('popup:filter') || "all");
		
		this.outerContainer = document.getElementById('popup');
		
		// Add head
		this.head = new PUI.Template('popup#head');
		this.outerContainer.insertBefore(this.head.container, this.container);
		
		this.queue = new PUI.LinkQueue(this.head.element.find('#link-queue'));
		this.queue.setListener(this.queueChanged)
		
		window.addEventListener('unload', this.onUnload, false);
		if (Ext.isSafari()) {
			window.addEventListener('blur', this.onPopupHide, true);
		}
		
		// Add a popupVisible event for Safari, which never unloads the popup
		Platform.env.onPopoverVisible(this.onPopupVisible);
		
		// Listen for feeder:connect changes to set/unset "is-pro" class
		this.listener.listen("feeder:connect", this.feederConnectChanged);
		
		if ( this.isPopup() )
			$(Ext.isSafari() ? '#main-scroll' : document).on('scroll', this.onScroll);

		window.addEventListener('keydown', this.onKeyDown, false);

		this.showNotification();

		// History actions is a list of posts, feeds or folders that should be navigate:able with keyboard navigation
		this.history = new ActionHistory();
	},
	
	start: function() {
		if ( ! this.hasStoredScreenChain() || ! this.rememberScreenChain() )
			this.setCurrentScreen(new Screen.Main());
	},
	
	onUnload: function() {
		this.queue.pump();
		this.queue.queue = [];
		
		this.listener.unlisten("feeder:connect", this.feederConnectChanged);
		
		$(Ext.isSafari() ? '#main-scroll' : document).off('scroll', this.onScroll);
		this.queue.removeListener(this.queueChanged);
		
		Platform.env.removePopoverVisible(this.onPopupVisible);
	},
	
	onPopupVisible: function() {
		setTimeout(function() { window.focus(); }, 1000);
		this.currentScreen.onPopupVisible();
	},
	
	onPopupHide: function() {
		this.queue.pump();
		this.queue.queue = [];
		
		if ( this.currentScreen && typeof this.currentScreen.onPopupHide === "function" )
			this.currentScreen.onPopupHide();
	},
	
	feederConnectChanged: function() {
		if (app.user.isPro())
			document.body.classList.add("is-pro");
		else
			document.body.classList.remove("is-pro");
	},
	
	refreshTheme: function() {
		var theme = queryStringGet('theme') || app.user.preferences.get('activeTheme');
		app.user.preferences.allThemes.forEach(function(t) {
			document.body.classList.remove(t.identifier);
		});
		document.body.classList.add(theme);
	},
	
	// screenChain related
	
	storeScreenChain: function() {
		var stack = this.screenStack.map(function(page) {
			var id = typeof page.id !== "function" ? false : page.id();
			if ( ! id )
				return page;
			return page.id();
		});
		localStorage.screenChain = JSON.stringify(stack);
	},
	
	forgetScreenChain: function() {
		localStorage.removeItem("screenChain");
	},
	
	rememberScreenChain: function() {
		var stack = JSON.parse(localStorage.screenChain);
		this.forgetScreenChain();
		
		for (var i = 0, page; page = stack[i]; i++ ) {
			var klass = Screen[page.id];
			var page = klass.fromId(page);
			if ( ! page )
				return false;
			this.screenStack.push(page);
		}
		this.setCurrentScreen(this.screenStack.pop());
		return true;
	},
	
	hasStoredScreenChain: function() {
		try {
			JSON.parse(localStorage.screenChain);
			return true;
		} catch (e) {}
		return false;
	},
	
	setCurrentFilter: function(name, func, postFilter) {
		this.currentFilter = name;
		app.user.preferences.set('popup:filter', name);
	},
	
	onScroll: function() {
		if ( this.queue.isEmpty() || this.inAnimation )
			return;

		this.setBarTop();
	},

	setBarTop: function() {
		var maxY = 33;
		var minY = 2;

		var scrollY = Ext.isSafari() ? document.getElementById('main-scroll').scrollTop : window.scrollY;
		var top = Math.min(Math.max(minY, maxY-scrollY), maxY);
		
		$('.bar.bottom, .bar.top').css('top', top + 'px !important');
	},
	
	onScreenChange: function() {
		this.disableTopBar();
	},
	
	disableTopBar: function() {
		$('.bar.bottom, .bar.top').css('top', '');
		document.body.classList.remove("at-top");
	},
	
	queueChanged: function() {
		if ( this.queue.isEmpty() ) {
			this.disableTopBar();
		}
	},

	onKeyDown: function(e) {
		onKeyDownEvent(e, this);
	},

	showNotification: function() {
		this.notification = $('#notifications');
		this.notification.on('click', this.noteClicked);

		if (app.notifications.current && ! app.user.isPro()) {
			this.notification.find('div').html(app.notifications.current);
			document.body.classList.add("with-notifications");
		} else {
			document.body.classList.remove("with-notifications");
		}
	},

	noteClicked: function(e) {
		e.preventDefault();
		if ($(e.target).closest('.close').length) {
			document.body.classList.remove("with-notifications");
			app.notifications.hideCurrent();
			return;
		}
		UI.openTab(this.notification.find('a').attr('href'));
	},

	historyNext: function() {
		var action = this.history.next();
		this.currentScreen.navigateTo(action);
	},

	historyPrevious: function() {
		var action = this.history.previous();
		this.currentScreen.navigateTo(action);
	},

	navForward: function() {
		this.currentScreen.navForward(this.history.current());
	},

	navBack: function() {
		this.currentScreen.back();
	}
});

runOnLoad(function() {
	isPopup = true;
	
	popup = Screen.currentVC = new Popup();
	popup.start();
});