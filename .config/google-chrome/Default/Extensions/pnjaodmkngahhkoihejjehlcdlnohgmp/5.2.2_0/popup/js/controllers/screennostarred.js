Screen.NoStarred = Controller.extend({
	template: 'screen#no-starred',
	
	events: {
		'click .start-tutorial': 'startTutorial',
		'click .end-tutorial': 'endTutorial'
	},
	
	start: function() {
		var post = app.store.randomPost();
		
		// No posts? Make one up
		if ( ! post ) {
			post = app.user.createPost();
			post.is_read = 0;
			post.title = "The greatest RSS extension ever";
		}
		
		var item = this.template.addItem('posts', post);
		$(item.element).addClass('hover');
		
		this.startButton = this.template.element.find('.start-tutorial');
		this.endButton = this.template.element.find('.end-tutorial');
		
		this.tutorial = this.template.element.find('.tutorial');
		this.clickToOpenArrow = this.template.element.find('.click-to-open');
		this.clickToStarArrow = this.template.element.find('.click-to-star');
		
		this.post = this.template.element.find('.tpl-list-item-post');
	},
	
	startTutorial: function() {
		this.startButton.addClass('hidden');
		this.tutorial.removeClass('hidden');
		
		this.template.element.addClass('in-tutorial');
		
		this.step1.delay(2000);
	},
	
	step1: function() {
		this.clickToOpenArrow.removeClass('hidden');
		
		this.step2.delay(1200);
	},
	
	step2: function() {
		this.clickToOpenArrow.addClass('hidden');
		this.post.addClass('opened');
		
		this.step3.delay(1000);
	},
	
	step3: function() {
		this.clickToStarArrow.removeClass('hidden');
		
		this.step4.delay(2000);
	},
	
	step4: function() {
		this.endButton.removeClass('hidden');
		this.clickToStarArrow.addClass('hidden');
	},
	
	endTutorial: function() {
		this.tutorial.addClass('hidden');
		this.startButton.removeClass('hidden');
		this.post.removeClass('opened');
		this.endButton.addClass('hidden');
		
		this.template.element.removeClass('in-tutorial');
	}
});