Screen.Folders = Controller.extend({
	template: 'screen#folders',
	
	events: {
		'click .add': 'addNewFolder',
		'click .tpl-folder-item': 'changeFolder'
	},
	
	start: function() {
		this.template.set('title', _('Folders'));

		PUI.Sort.addDrop('.add', this.onAddDrop);
		PUI.Sort.addDrop('.tpl-breadcrumb', this.onFolderDrop);
		PUI.Sort.addDrop('.tpl-list-item-feed.is-folder', this.onFolderDrop);
		PUI.Sort.addDrop('.tpl-list-item-feed.is-folder', this.onFolderDrop);
		PUI.Sort.addDrop('.tpl-screen-folders .tpl-folder-item', this.onFolderDrop);
		
		this.makeSortable();
		this.reload();
		
		this.vc.listener.listen("folder:updated", this.foldersChanged);
		this.vc.listener.listen("folder:added", this.foldersChanged);
		this.vc.listener.listen("folder:removed", this.foldersChanged);
	},
	
	destroy: function() {
		this.vc.listener.unlisten("folder:updated", this.foldersChanged);
		this.vc.listener.unlisten("folder:added", this.foldersChanged);
		this.vc.listener.unlisten("folder:removed", this.foldersChanged);
	},
	
	foldersChanged: function() {
		this.reload();
	},
	
	reload: function() {
		this.itemMap = {};
		this.template.setItems('folder', []);
		this.addFolder(app.user.structure.base, 1);
		
		this.sortable.options.dropAreas = [this.template.element.find('.base-folder')];
		
		if ( this.highlightedFolderId )
			this.highlightFolder(this.highlightedFolderId);
	},
	
	setFolders: function(folder, level) {
		var addFolder = this.addFolder;
		folder.forEachFolder(function(f) {
			addFolder(f, level);
		});
	},
	
	addFolder: function(folder, level) {
		var item = this.template.addItem('folder', folder);
		item.element.classList.add('level-' + level);
		
		this.itemMap[folder.id] = item;
		
		if ( ! folder.standard)
			this.sortable.add(item.element);
		else
			item.element.classList.add('base-folder');
		
		this.setFolders(folder, level+1);
	},
	
	makeSortable: function() {
		this.sortable = new PUI.Sort({
			droppable: '.tpl-folder-item',
			disableSort: true,
			onMove: this.onMove,
			onDrop: this.onDropOnElement,
			onDropArea: this.onDropOnArea,
			onEnd: this.onDropOrder,
			sortOptions: {
				processGhost: this.processGhost,
				waitForDrag: true
			},
			dropAreas: [
				this.template.element.find('.back')
			]
		});
		
		this.template.element.find('.tpl-list-item-feed').forEach(this.makeSortable);
	},
	
	onDropOrder: function(sortable) {
		this.currentDragged.removeClass('in-sort');
	},
	
	onDropOnElement: function(drop, current) {
		var dropFolder = drop.el[0].store.model;
		var currentFolder = current.el[0].store.model;
		
		currentFolder.getParent().removeFolder(currentFolder.id);
		dropFolder.addFolder(currentFolder.id);
		
		app.user.structure.save();
		
		// TODO: FIXME: Not sure if this is good...
		app.events.send("folder:updated", {folder: currentFolder.id});
		app.events.send("folder:updated", {folder: dropFolder.id});
		app.events.send("folder:updated", {folder: dropFolder.getParent().id});
		
		this.reload();
	},
	
	onDropOnArea: function(el, current) {
		this.onDropOnElement({el: el}, current);
	},
	
	processGhost: function(ghost, sortable) {
		var container = $('<div></div>');
		container.append(ghost);
		
		var folder = sortable.el[0].store.model;
		this.currentDragged = $(sortable.el[0]);
		
		var elements = [], itemMap = this.itemMap, currentDragged = this.currentDragged;
		
		// Also grab folders within this folder
		folder.forEachFolderRecursively(function(f) {
			var el = $(itemMap[f.id].element);
			container.append(el.clone());
			el.addClass('in-sort');
			
			currentDragged.push(el[0]);
		});
		
		container.children().addClass('ghost');
		
		return container;
	},
	
	onMove: function(current, sort, dir) {
		this.currentDragged.insertAfter(current.el);
	},
	
	highlightFolder: function(folderId) {
		this.highlightedFolderId = folderId;
		
		this.template.element.find('.tpl-folder-item').removeClass('active').get().forEach(function(el) {
			if ( el.store.model.id === folderId)
				el.classList.add('active');
		});
	},
	
	addNewFolder: function() {
		main.controllers.main.currentScreen.organizeAddFolder();
	},
	
	/* Global drops */
	
	onAddDrop: function(el, sortable) {
		var item = sortable.el[0].store.model;
		var currentFolder = main.getCurrentFolder();
		
		var moveToFolder = this.moveToFolder;
		
		if ( ! currentFolder.standard && ! app.user.canHaveNestedFolders() ) {
			PUI.alert(_("Google Reader can't have nested folders."));
			return;
		}
		
		PUI.prompt(_("Add to new folder:"))
		.yes(function(name) {
			chain(app.user.structure.addNewFolderToFolder, name, currentFolder.id)
			.then(function(f) {
				moveToFolder(f, item);
		
				app.events.send('folder:added', {folder: f.id});
			});
		});
	},
	
	onFolderDrop: function(el, sortable) {
		var dropFolder = el[0].store.model;
		var item = sortable.el[0].store.model;
		
		this.moveToFolder(dropFolder, item);
	},
	
	moveToFolder: function(newFolder, item) {
		if ( ! newFolder.standard && item.isFolder && ! app.user.canHaveNestedFolders() ) {
			PUI.alert(_("Google Reader can't have nested folders."));
			return;
		}
		
		var oldFolder;
		if ( item.isFolder)
			oldFolder = item.getParent();
		else
			oldFolder = main.getCurrentFolder();
		
		// You can't move a folder into itself
		if ( item.isFolder && (newFolder.id == item.id || item.hasFolderRecursively(newFolder.id)) )
			return this.reload();
		
		oldFolder.removeItem(item);
		newFolder.addItem(item);
		
		app.user.structure.save(function() {
			app.events.send("folder:updated", {folder: oldFolder.id, reason: 'order'});
			app.events.send("folder:updated", {folder: newFolder.id, reason: 'order'});
			if ( item.isFeed )
				app.events.send('feed:updated', {feed: item.id, reason: 'category', from: oldFolder.id, to: newFolder.id});
		});
	},
	
	changeFolder: function(e) {
		main.gotoFolder(e.item.model);
	}
});