Screen.Folder = Screen.Feeds.extend({
	template: 'screen#folder',
	
	start: function(folder, options) {
		this._super.apply(this, arguments);
		
		this.options = options || {};

		this.setFolder(folder);
		this.populate();
		
		this.template.set('count', 0);
		this.template.set('title', folder.name);
		this.template.set('favicon', app.config.images.folder);
	},
	
	id: function() {
		return {id: 'Folder', folder: this.folder.id, active: this.currentIndex};
	}
});

Screen.Folder.fromId = function(id) {
	var folder = app.user.structure.folder(id.folder);
	if ( ! folder )
		return false;
	return new Screen.Folder(folder, {active: id.active});
};