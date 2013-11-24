Screen.SettingsFolder = Controller.extend({
	template: 'screen#settings-folder',
	
	events: {
		'click .done': 'done',
		'submit .folder-settings-form': 'done'
	},
	
	start: function(folder) {
		this.folder = folder;
	},
	
	onVisible: function() {
		this.template.data.setModel(this.folder);
		
		this.nameField = this.template.element.find('input[name=name]');
		
		this.nameField.val(this.folder.name);
	},
	
	done: function(e) {
		e.preventDefault();
		
		var folder = this.folder;
		var prevName = this.folder.name;
		var vc = this.vc;
		
		this.folder.name = this.nameField.val();
		this.folder.save(function() {
			app.events.send('folder:updated', {folder: folder.id, prev: prevName, reason: 'name'});
			vc.popScreen();
		});
	}
});