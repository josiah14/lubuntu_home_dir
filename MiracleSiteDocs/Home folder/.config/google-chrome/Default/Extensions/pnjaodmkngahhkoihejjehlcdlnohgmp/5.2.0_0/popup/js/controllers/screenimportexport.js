Screen.ImportExport = Controller.extend({
	template: 'screen#import-export',
	
	events: {
		'click .export': 'export',
		'click .import': 'import',
		'change input[type=file]': 'upload'
	},
	
	start: function() {
		this.importFile = this.template.element.find('input[type=file]');
		this.exportThings = this.template.element.find('.export-things');
		
		this.onlyImport();
	},
	
	onlyImport: function() {
		if ( app.user.hasFeeds() ) {
			this.template.set('title', _('Import/Export feeds'));
			this.exportThings.show();
			this.template.element.removeClass('only-import');
			return;
		}
			
		this.template.set('title', _('Import feeds'));
		this.exportThings.hide();
		
		this.template.element.addClass('only-import');
	},
	
	export: function() {
		ExportImport.Export.downloadFile();
	},
	
	import: function() {
		// Safari can't open dialog in popup, and since options page is in popup...
		if ( Ext.isSafari() ) {
			app.events.subscribe("import:contents", this.importContentsRetrieved);
			UI.openTab(Ext.path("options/import.html"));
			UI.closePopup();
			return;
		}
		this.importFile[0].click();
	},
	
	importContentsRetrieved: function(evt) {
		app.events.unsubscribe("import:contents", this.importContentsRetrieved);
		UI.closeTab(evt.tab);
		UI.showPopup();
		this.uploadDone(evt.contents);
	},
	
	upload: function() {
		readFileInput(this.importFile[0], this.uploadDone);
	},
	
	uploadDone: function(res) {
		if ( ! res )
			return this.problem();
		
		app.events.subscribe("sync:merge", this.mergeStatusChanged);
		this.loadingWindow = PUI.alertLoader(_("Importing..."));
		
		var importer = new ExportImport.Import(res);
		importer.load(this.importDone);
	},
	
	mergeStatusChanged: function(evt) {
		this.loadingWindow.setText(evt.status);
	},
	
	importDone: function(res) {
		this.onlyImport.delay(100);
		
		if ( ! res ) {
			fireCallback(this.importDoneCallback, false);
			return this.problem();
		}
		
		this.importFile.val("");
		this.loadingWindow.destroy();
		PUI.alert(_("Done!"));
		
		app.events.send("folder:updated", {folder: app.user.structure.base.id});
		
		fireCallback(this.importDoneCallback, true);
	},
	
	problem: function() {
		PUI.alert(_("A problem occured.\n\nPlease contact: erik.rothoff@gmail.com"));
	}
});