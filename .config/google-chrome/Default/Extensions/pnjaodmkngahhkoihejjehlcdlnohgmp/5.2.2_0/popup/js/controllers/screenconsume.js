Screen.Consume = Controller.extend({
	template: 'screen#popup-consume',

	events: {
		'click-or-touch .title': 'toggleStar',
		'click-or-touch .history-previous': 'goPrevious',
		'click-or-touch .history-next': 'goNext'
	},

	start: function(post) {
		this.initialPost = post;
	},

	onVisible: function() {
		this.setPost(this.initialPost);
	},

	setPost: function(post) {
		if (this.isInitialized || ! post || this.post === post)
			return;

		this.post = post;

		this.isInitialized = true;
		this.template.set("title", post.title);
		
		var consumeIframe = $('<iframe class="popup-consume-iframe">');
		consumeIframe.attr('src', post.getConsumePath());
		consumeIframe.css('height', Math.min($(window).height() - this.template.el('.bar').height() - 5), 400);

		this.template.el('iframe, x-iframe').replaceWith(consumeIframe);
		this.post.markAsRead();

		this.setStar();
	},

	toggleStar: function(e) {
		e.preventDefault();
		this.post.toggleStar();
		this.setStar();
	},

	setStar: function() {
		if (this.post.is_starred) {
			this.template.el('.bar').addClass('starred-post')
		} else {
			this.template.el('.bar').removeClass('starred-post')
		}
	},

	navigateTo: function(post) {
		this.isInitialized = false;
		this.setPost(post);
	},

	goPrevious: function() {
		this.vc.historyPrevious();
	},

	goNext: function() {
		this.vc.historyNext();
	}
});
