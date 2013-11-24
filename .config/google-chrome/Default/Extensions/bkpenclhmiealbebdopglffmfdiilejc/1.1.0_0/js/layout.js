/* 
* layout.js
* adds/removes layout from popup
*/
(function(){
	
	var resize = window.resize;
	
	var layout = {

		/**
		* adds layout to popup
		* @param {string} layoutType Type of layout (ROWxCOL).
		*/	
		addLayout: function(layoutType) {
			var layoutList = resize.currentLayouts.layoutItems;
			var layoutIndex = layoutList.indexOf(layoutType);
			if(layoutIndex !== -1){
				layoutList.splice(layoutIndex,1);
				this._removeLayoutMarkup(layoutType);
			} 
			resize.currentLayouts.layoutItems.unshift(layoutType);
			resize.storage.setItem('layoutItems',JSON.stringify(resize.currentLayouts));
			this.addLayoutMarkup(layoutType,true);
		},

		/**
		* adds layout markup to popup
		* @param {string} layoutType Type of layout (ROWxCOL).
		* @param {boolean} prepend Prepend layout to layout container if true, appends if false
		*/			
		addLayoutMarkup: function(layoutType, prepend) {
			
			var defaultSprite = "layout-default";

			if(resize.defaultLayouts.layoutItems.indexOf(layoutType) !== -1 || layoutType === '1x1'){
				defaultSprite = "layout-" + layoutType;
			} 

			var container = $('.resize-container');
			var selectorTemplate = '<div class="resize-selector-container"><div class="close-button"></div><div class="layout-title">' + layoutType + '</div><div class="resize-selector ' + defaultSprite + '\" ' + 'data-selector-type=' + '\"'+ layoutType + '\"></div></div>';
			
			if(prepend){
				container.prepend(selectorTemplate);
			} else {
				container.append(selectorTemplate);
			}
		},

		/**
		* removes the layout from popup
		* @param {string} layoutType Type of layout (ROWxCOL).
		*/		
		removeLayout: function(layoutType){
			var layoutList = resize.currentLayouts.layoutItems;
			var layoutIndex = layoutList.indexOf(layoutType);
			layoutList.splice(layoutIndex,1);
			resize.storage.setItem('layoutItems',JSON.stringify(resize.currentLayouts));
			this._removeLayoutMarkup(layoutType);	
		},
		
		/**
		* removes the layout markup from popup
		* @param {string} layoutType Type of layout (ROWxCOL).
		*/	
		_removeLayoutMarkup: function(layoutType){
			var layoutSelector = '[data-selector-type="' + layoutType + '"]';		
			$(layoutSelector).parent().remove();
		},
		
		/**
		* resets to default layouts
		*/		
		resetLayout: function() {
			resize.storage.removeItem('layoutItems');
			this._removeAllLayouts();
			resize.main_view.initialize();
		},
	
		/**
		* removes all current layouts 
		*/		
		_removeAllLayouts: function() {
			$('.resize-container').children().remove();
		}
		
	};
	
	window.resize.layout = layout;
	
})();