Screen.Organizeable = Controller.extend({
	onVisible: function() {
		if ( this.inOrganize() )
			this.makeSortables();
	},
	
	startOrganize: function() {
		// Indicate on body that we're organizing
		document.body.classList.add('organize-mode');
		
		// Add bottom bar
		var tpl = new PUI.Template("bar#organize");
		document.body.appendChild(tpl.container);
		
		// Add events to bottom bar
		var bottomEvents = new PUI.Events(tpl.element, this);
		bottomEvents.add({
			'click .done': 'endOrganize',
			'click .add-button': 'organizeAddFolder'
		});
		
		this.makeSortables();
	},
	
	inOrganize: function() {
		return document.body.classList.contains('organize-mode');
	},
	
	makeSortables: function() {
		this.sortable = new PUI.Sort({
			droppable: '.is-folder',
			onDrop: this.onDropIntoFolder,
			onDropArea: this.onDropOnElement,
			onEnd: this.onDropOrder,
			sortOptions: {
				include: '.item-move'
			},
			dropAreas: [
				this.template.element.find('.back')
			]
		});
		
		this.loadSortables();
	},
	
	loadSortables: function() {
		if ( ! this.sortable )
			return;
		
		this.sortable.clear();
		$.makeArray(this.template.element.find('.tpl-list-item-feed')).forEach(this.makeSortable);
	},
	
	makeSortable: function(element) {
		this.sortable.add(element);
	},
	
	endOrganize: function() {
		// Remove bottom bar and class on body
		$('.tpl-bar-organize').remove();
		document.body.classList.remove('organize-mode');
	},
	
	organizeAddFolder: function() {
		if ( ! this.vc.currentScreen.folder.standard && ! app.user.canHaveNestedFolders() ) {
			PUI.alert(_("Google Reader can't have nested folders."));
			return;
		}
		
		PUI.prompt("Enter a name for folder:")
		.done(this.createFolder);
	},
	
	createFolder: function(name) {
		if ( ! name )
			return;
		
		app.user.structure.addNewFolderToFolder(name, this.vc.currentScreen.folder.id, this.createFolderComplete);
	},
	
	createFolderComplete: function(folder) {
		var page = this.vc.currentScreen;
		
		var item = page.addFolder(folder);
		page.makeSortable(item.element);
		
		app.events.send('folder:added', {folder: folder.id});
	},
	
	onDropOrder: function() {
		var folder = this.folder;
		
		this.folder.setOrderFromArray(this.serializeOrder());
		
		this.folder.save(function() {
			app.events.send('folder:updated', {folder: folder.id, reason: 'order'})
		});
	},
	
	serializeOrder: function() {
		return this.template.element.find('.tpl-list-item-feed').get().map(function(item) {
			return item.store.model;
		});
	},
	
	onDropIntoFolder: function(folderSort, currentSort) {
		var currentItem = currentSort.el[0].store.model;
		
		if ( currentItem.isFolder && ! app.user.canHaveNestedFolders() ) {
			PUI.alert(_("Google Reader can't have nested folders."));
			return;
		}
		
		currentSort.el.remove();
		this.vc.refreshWindowHeight();
		
		var currentFolder = this.folder;
		
		// folderSort is either a folder model or an element with it as store
		var dropFolder = folderSort.model ? folderSort : folderSort.el[0].store.model;
		
		dropFolder.addItem(currentItem);
		
		app.user.structure.save(function() {
			if ( currentItem.isFeed )
				app.events.send('feed:updated', {feed: currentItem.id, reason: 'category', from: currentFolder.id, to: dropFolder.id});
		});
		
		// Removal of item from this.folder is handled by onDropOrder
	},
	
	onDropOnElement: function(element, currentSort) {
		if ( element.is(".back") ) {
			this.onDropIntoFolder(this.folder.getParent(), currentSort);
		}
	}
});