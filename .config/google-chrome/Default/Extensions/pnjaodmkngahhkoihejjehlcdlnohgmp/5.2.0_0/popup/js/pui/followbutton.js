PUI.FollowButton = Class.extend({
	initialize: function(el) {
		this.el = $(el);
		this.isFollowing = !! this.el.find(".following").attr("data-following");
		
		this.setClass();
		
		this.el.on('click', this.clicked);
	},
	
	set: function(isFollowing) {
		this.isFollowing = isFollowing;
		this.setClass();
	},
	
	setClass: function() {
		if ( this.isFollowing )
			this.el.addClass("is-following");
		else
			this.el.removeClass("is-following");
	},
	
	clicked: function(e) {
		e.preventDefault();
		this.set(!this.isFollowing);

		
		var event = document.createEvent("HTMLEvents");
		event.initEvent("change", true, true);
		this.el[0].dispatchEvent(event);
	},
	
	get: function() {
		return this.isFollowing;
	}
});