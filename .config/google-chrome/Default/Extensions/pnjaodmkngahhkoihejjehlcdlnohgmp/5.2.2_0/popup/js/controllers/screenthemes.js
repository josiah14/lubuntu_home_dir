Screen.Themes = Controller.extend({
	template: 'screen#themes',
	
	events: {
		'change .theme-container input[type=radio]': 'changeTheme'
	},
	
	start: function() {
		this.template.set('title', _('Pick a theme, any theme'));
		
		app.user.preferences.allThemes.forEach(this.addTheme);
	},
	
	addTheme: function(theme) {
		var item = this.template.addItem('themes', theme);
		if ( this.isSelected(theme.identifier) )
			$(item.element).find("input[type=radio]").attr("checked", true);
	},
	
	isSelected: function(ident) {
		return app.user.preferences.get("activeTheme") == ident;
	},
	
	initThemes: function() {
		this.removeThemes();
		this.template.element.find('.theme').forEach(this.replaceWithTheme);
	},
	
	removeThemes: function() {
		this.template.element.find('.theme').forEach(function(theme) {
			$(theme).find('iframe').remove();
		});
	},
	
	replaceWithTheme: function(el) {
		var iframe = document.createElement('iframe');
		iframe.style.visibility = "hidden";
		iframe.onload = function() {
			iframe.style.visibility = "visible";
		}
		iframe.src = '../popup.html?theme=' + $(el).closest('.theme-container').attr('data-theme');

		el.appendChild(iframe);
	},
	
	changeTheme: function(e) {
		app.user.preferences.set('activeTheme', e.item.get("identifier"));
	}
});
