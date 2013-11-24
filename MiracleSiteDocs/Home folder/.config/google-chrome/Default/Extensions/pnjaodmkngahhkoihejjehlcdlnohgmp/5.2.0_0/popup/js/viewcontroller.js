var ViewController = Class.extend({
	animationDuration: 300,

	initialize: function(containerId) {
		this.container = typeof containerId === "string" ? document.getElementById(containerId) : containerId;
		this.screenStack = [];
		this.animationCallbacks = [];

		this.listener = new EventListener(this.container);
	},
	
	onScreenChange: function() {},

	isPopup: function() {
		return isPopup;
	},
	
	setCurrentScreen: function(page, callback) {
		window.scrollTo(0, 0);
		
		if ( this.currentScreen ) {
			this.currentScreen.onOff();
		
			// Destroy old screen if it isn't used anymore
			this.currentScreen.destroy();
		}
			
		this.currentScreen = page;
		
		if (!$(this.container).children().is(page.template.container)) {
			this.container.appendChild(page.template.container);
		}

		page.onVisible();

		if ( this.screenStack.length )
			this.serializeStackObject(this.screenStack.length-1);
		
		this.screenStack.push(page);
		page.onCurrent();

		this.listener.send("screen:navigate", {page: this.currentScreen});
		
		this.refreshWindowHeight();
		
		if ( window.parent && typeof window.parent.onScreenChange === "function" ) {
			window.parent.onScreenChange(page);
		}
		
		fireCallback(callback);
	},
	
	pushScreen: function(page, callback) {
		this.slideHScreen(this.currentScreen, page, 'in', callback);
	},
	
	popScreen: function(callback) {
		var from = this.screenStackPop();
		if ( ! from )
			return;
		this.slideScreen(from._inFunc || "h-animation", from, this.screenStackPop(), 'out', callback);
	},

	slideHScreen: function(from, to, dir, callback) {
		this.slideScreen('h-animation', from, to, dir, callback);
	},

	slideVScreen: function(from, to, dir, callback) {
		this.slideScreen('v-animation', from, to, dir, callback);
	},
	
	slideScreen: function(type, from, to, dir, callback) {
		window.scrollTo(0, 0);		

		if ( dir == 'in' )
			to._inFunc = type;
		
		if ( this.disableScreenAnimation || window.nooooo )
			return this.setCurrentScreen(to, callback);

		var cont = $(this.container).addClass(type);
		cont.addClass("in-progress").addClass("viewcontroller-animated");
		
		this.container.appendChild(to.template.container);
		
		if (dir == 'out')
			cont.addClass('reverse-animation')

		var old = $(from.template.container).addClass("out");
		var next  = $(to.template.container).addClass('in');

		var emptyRect = {'width': '', 'height': ''};
		var oldRect = old.sizeRect();
		var windowHeight = $(window).height();

		var maxRect = {width: oldRect.width, height: windowHeight};

		document.body.style.minHeight = maxRect.height + "px";
		next.css(maxRect);
		$(this.container).css(maxRect).css('overflow', 'hidden');

		// Start animation
		setTimeout(function() {
			var oldClass = cont[0].className;
			oldClass = oldClass.replace("in-progress", "");
			oldClass = oldClass + " in-animation";
			cont[0].className = oldClass;
		}, 10);
		// end Start animation

		function onTransitionEnd(e) {
			if (e && ! [old[0], next[0]].contains(e.target)) 
				return;
			onComplete();
			removeTransitionEndEvent(cont[0], onTransitionEnd);
		}
		
		if ( Modernizr.csstransitions ) {
			addTransitionEndEvent(cont[0], onTransitionEnd);
		} else {
			setTimeout(function() { onTransitionEnd(); }, 20);
		}

		setTimeout(function() {
			this.inAnimation = true;
			this.onScreenChange();
		}.bind(this), 0);

		var onComplete = function() {
			this.animationDone();
			
			this.setCurrentScreen(to, callback);

			document.body.style.minHeight = '';
			cont.removeClass('in-animation ' + type + ' reverse-animation viewcontroller-animated');
			next.removeClass('in').css(emptyRect);
			$(this.container).css(emptyRect).css('overflow', '');
		}.bind(this);
	},
	
	setWindowHeight: function(height) {
		if (Ext.isChrome() || Ext.isSafari()) {
			//this.container.style.height = height ? height + "px" : '';
		}
		
		if ( window.parent && typeof window.parent.onHeightChange === "function" ) {
			window.parent.onHeightChange($(this.container).height());
		}
	},
	
	// Only wait for animation complete if on a touch/mobile device, because it's mostly for slow devices that we do this
	addAnimationDoneCallback: function(callback, args) {
		if (!this.inAnimation || ! Modernizr.touch)
			return callback.apply(this, args);
		this.animationCallbacks.push([callback, args]);
	},

	animationDone: function() {
		this.inAnimation = false;
		while (this.animationCallbacks.length) {
			var callback = this.animationCallbacks.pop();
			callback[0].apply(this, callback[1]);
		}
	},

	refreshWindowHeight: function() {
		this.setWindowHeight(false);
	},
	
	slideUpScreen: function(page, callback) {
		this.slideVScreen(this.currentScreen, page, 'in', callback);
	},
	
	toHome: function(callback) {
		if ( this.screenStack.length > 1 )
			this.popScreen(this.toHome.withCallback(callback));
		else
			fireCallback(callback);
	},
	
	toIndex: function(i) {
		var numPages = (this.screenStack.length-1) - i;
		if ( numPages <= 0 )
			return;
		
		this.popScreen(this.toIndex.andArguments(i));
	},
	
	serializeStackObject: function(index) {
		var page = this.screenStack[index];
		if ( typeof page.id !== "function" )
			return;
		this.screenStack[index] = page.id();
	},
	
	screenStackPop: function() {
		var page = this.screenStack.pop();
		return this.unserializeStackObject(page);
	},
		
	unserializeStackObject: function(page) {
		if ( page && page.template )
			return page;
		
		if ( ! page || typeof page.id === "undefined" )
			return false;

		return TRYIT(function() {
			var klass = Screen[page.id];
			page = klass.fromId(page);

			return page;
		});
	},
	
	/*
		Pages
	*/
	
	pushFeed: function(feed) {
		Screen.currentVC = this;
		
		var page = new Screen.Posts(feed);
		this.pushScreen(page);
	},
	
	pushFolder: function(folder, callback) {
		Screen.currentVC = this;
		
		var page = new Screen.Folder(folder);
		this.pushScreen(page, callback);
	},
	
	pushToFolders: function(folder) {
		var queue = folder.getStructure().reverse();
		queue.shift();
		
		var pushFolder = this.pushFolder;
		this.toHome(function done() {
			if (! queue.length )
				return;
			pushFolder(queue.shift(), done);
		});
	},
	
	showAddScreen: function() {
		Screen.currentVC = this;
		
		var page = new Screen.Add();
		this.slideUpScreen(page);
	},
	
	showSettingsScreen: function(feed) {
		Screen.currentVC = this;
		
		var page = Screen.Settings;
		if ( feed )
			page = feed.isFeed ? Screen.SettingsFeed : Screen.SettingsFolder;

		page = new (page)(feed, this.currentScreen.folder);
		this.slideUpScreen(page);
		
		return page;
	},
	
	showGoogleReader: function() {
		Screen.currentVC = this;
		
		this.pushScreen(new Screen.GoogleReader());
	},
	
	showSyncSelect: function(subscriptions) {
		Screen.currentVC = this;
		
		this.pushScreen(new Screen.SyncSelect(subscriptions));
	},
	
	openSettingsPage: function(page, method, opts) {
		var url = Ext.path("options/options.html?page=" + page + "&run=" + method + '&' + objectToQueryString(opts || {}));
		if ( Ext.isSafari() ) {
			document.body.style.WebkitTransition = "opacity 300ms";
			setTimeout(function() {
				document.body.style.opacity = "0";
			}, 0);
			setTimeout(function() {
				UI.setPopupSize(app.config.optionsPageSize.width, app.config.optionsPageSize.height);
				document.location.href = url;
			}, 300);
			return;
		}
		UI.openTab(url);
		window.close();	
	},

	setContainerHeight: function(cont, suggestedHeight) {
		var height = $(window).height();
		if (Ext.isChrome())
			height = suggestedHeight;
		cont.css('height', height);
	}
});
