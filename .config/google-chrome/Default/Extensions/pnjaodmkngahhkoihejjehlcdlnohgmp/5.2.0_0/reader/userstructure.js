/*
	Class:
		UserStructure
	
	Keeps track of the structure of the feeds.
	
	Stores the folders in a table. Each folder entry has an "orderstring", that works much like Google Readers.
	
	Example of orderstring:
		f:1,f:3,f:12,f:44,d:1,d:2
	
		Which corresponds to the order:
		
			* Feed with id #1
			* Feed with id #3
			* Feed with id #12
			* Feed with id #44
			* Folder with id #1
			* Folder with id #2
*/

var UserStructure = Class.extend({
	initialize: function() {
		this.folderMapper = Mapper.get('folder');
		this.folders = {};
		this.base = false;
	},
	
	install: function(callback) {
		chain(this.reloadFolders)
		.end(callback);
	},
	
	addStandardIfNeeded: function(res, meta, callback) {
		if ( res && res[0] ) {
			this.base = res[0];
			this.folders[res[0].id] = res[0];
			return callback();
		}
		
		this.addStandard(callback);
	},
	
	addStandard: function(callback) {
		var folder = new Folder();
		folder.standard = 1;
		folder.name = "Feeds";
		
		this.base = folder;
		
		var folders = this.folders;
		
		this.folderMapper.save(folder, function() {
			folders[folder.id] = folder;
			callback();
		});
	},

	reloadFoldersHard: function(callback) {
		this.folders = {};
		this.base = false;
		this.reloadFolders(callback);
	},
	
	reloadFolders: function(callback) {
		chain(this.folderMapper.find, 'all')
		.then(this.setFolders)
		.end(callback);
	},
	
	setFolders: function(rows, meta, callback) {
		for ( var i = 0, folder; folder = rows[i]; i++ ) {
			// Move logic from addStandardIfNeeded to here instead?
			if ( folder.standard )
				if ( this.base ) {
					this.base.copyPropertiesFrom(folder);
					folder = this.base;
				} else
					this.base = folder;
			
			// We use copyPropertiesFrom to ensure any references out there are still intact
			// might be a good idea, might be retarded playing with fire. I dunno.
			if ( this.folders[folder.id] )
				this.folders[folder.id].copyPropertiesFrom(folder);
			else
				this.folders[folder.id] = folder;
		}
		if ( ! this.base ) {
			chain(this.addStandard)
			.end(callback);
		} else {
			callback();
		}
	},
	
	folder: function(id, callback) {
		var folder = this.folders[id];
		if ( callback )
			callback(folder);
		return folder;
	},
	
	save: function(callback) {
		var link = chain();
		this.forEachFolder(function(folder) {
			link.and(this.folderMapper.save, folder);
		});
		link.and(this.reloadFolders);
		link.end(callback);
	},
	
	addFeedToFolder: function(feedId, folderId, callback) {
		var folder = this.folder(folderId);
		folder.addFeed(feedId.id || feedId);
		
		app.events.send("folder:updated", {folder: folder.id});
		
		return fireCallback(callback);
	},

	addFolderToFolder: function(folderId, parentId, callback) {
		var folder = this.folder(folderId);
		var parentFolder = this.folder(parentId);
		parentFolder.addFolder(folderId);
		
		app.events.send("folder:updated", {folder: parentFolder.id});
		
		return fireCallback(callback);
	},
	
	addNewFolderToFolder: function(name, folderId, callback) {
		var newFolder = new Folder();
		newFolder.name = name;
		
		var parentFolder = this.folder(folderId);
		
		// Add new folder to database
		chain(this.folderMapper.save, newFolder)
		.then(function(res, meta, next) {
			parentFolder.addFolder(newFolder.id);
			app.events.send("folder:updated", {folder: parentFolder.id});
			next();
		})
		// Update orderstring for parent folder
		.and(this.folderMapper.save, parentFolder)
		.and(this.reloadFolders)
		.and(function() {
			fireCallback(callback, app.user.structure.folder(newFolder.id));
		});
	},
	
	addFeedToRoot: function(feedId, callback) {
		return this.addFeedToFolder(feedId, this.base.id, callback);
	},
	
	addFolderToRoot: function(name, callback) {
		return this.addFolderToFolder(name, this.base.id, callback);
	},
	
	findByParentAndName: function(parentId, name, callback) {
		var parent = this.folder(parentId);
		
		var foundFolder = false;
		this.forEachFolder(function(f) {
			if ( f.name == name && parent.hasFolder(f.id) )
				foundFolder = f;
		});
		
		if ( ! foundFolder ) {
			var folder = new Folder();
			folder.name = name;
			
			var folders = this.folders;
			
			chain(this.folderMapper.save, folder)
			.and(function(next) {
				folders[folder.id] = folder;
				app.events.send("folder:updated", {folder: folder.id});
				next();
			})
			.end(callback, folder);
		} else
			fireCallback(callback, foundFolder);
	},
	
	removeFolder: function(folder, callback) {
		chain(this.folderMapper.remove, folder)
		.and(this.removeReferenceOfFolder, folder)
		.and(this.removeChildren, folder)
		.end(callback);
	},
	
	removeFeed: function(feedId, callback) {
		var foldersWithFeed = this.foldersWithFeed(feedId);
		var link = chain();
		
		for ( var i = 0, folder; folder = foldersWithFeed[i]; i++ ) {
			folder.removeFeed(feedId);
			app.events.send("folder:updated", {folder: folder.id});
			link.and(this.saveFolder, folder);
		}
		
		link.end(callback);
	},
	
	removeReferenceOfFolder: function(folder, callback) {
		var link = chain();
		this.forEachFolder(function(f) {
			if ( ! f.hasFolder(folder.id) )
				return;
			f.removeFolder(folder.id);
			link.and(this.folderMapper.save, f);
		});
		delete this.folders[folder.id];
		link.end(callback);
	},
	
	removeChildren: function(folder, callback) {
		var link = chain();
		folder.forEachItem(function(item) {
			if ( item.isFeed )
				link.and(app.user.removeFeedIfNotInCategories, item);
			else
				link.and(app.user.structure.removeFolder, item);
		});
		link.end(callback);
	},
	
	saveFolder: function(folder, callback) {
		folder.save(function() {
			fireCallback(callback);
		});
	},
	
	// Just loop through each folder, without any specific order
	forEachFolder: function(callback) {
		for ( var key in this.folders) if ( this.folders.hasOwnProperty(key) )
			callback.call(this, this.folders[key]);
	},
	
	foldersWithFeed: function(feedId) {
		var ret = [];
		for ( var key in this.folders) if ( this.folders.hasOwnProperty(key) )
			if ( this.folders[key].hasFeed(feedId) )
				ret.push(this.folders[key]);

		if ( ! ret.length )
			ret.push(this.base);

		return ret;
	},
	
	feedInFolder: function(feedId) {
		var folders = this.foldersWithFeed(feedId);
		if ( folders.length > 1 )
			return true;
		return folders[0].hasFeed(feedId);
	},
	
	folderWithFolder: function(folderId) {
		return TRYIT(function() {
			// No parent folder
			if ( this.folder(folderId).standard )
				return false;
		
			for ( var key in this.folders) if ( this.folders.hasOwnProperty(key) )
				if ( this.folders[key].hasFolder(folderId) )
					return this.folders[key];
			return this.base;
		}, this);
	}
});

/*
var structure = new UserStructure();
structure.addFeedToFolder(feed.id, folder.id);
structure.addFolderToFolder("Hello world", folder.id);

structure.forEachFolder(function(folder) {
	folder.items();
	
	folder.forEachItem(function() {
	
	});
});*/