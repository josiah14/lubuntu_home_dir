/*
* options.js
* handles resize options (single tab, undo resize, default config)
*/
(function(){
	
	var resize = window.resize;
	var options = {

		/*
		* single tab option
		*/
	
		/**
		* sets singleTab flag
		* @param {boolean} The hex ID.
		*/
		processSingleTabSelection: function(singleTab) {
			if(singleTab){
				resize.storage.setItem('singleTab',true);
				resize.singleTab = true;	
			} else {
				resize.storage.setItem('singleTab',false);
				resize.singleTab = false;				
			}
		},
		
		
		/*
		* undo previous resize option
		*/

		/**
		* undo the previous resize that was selected
		*/
		undoResize: function() {
			var that = this;
			resize.lastTab = JSON.parse(localStorage.getItem('lastTab'));
			var tabIndex = resize.lastTab.lastTabIndex;
			var windowId = resize.lastTab.lastWindowId;
			var tabsArray = resize.lastTab.lastTabsArray;

			window.chrome.windows.get(windowId, {}, function(window){
				if(window){
					that.recombineTabs(tabIndex,windowId,tabsArray);
				} else {
					chrome.tabs.query({status: "complete"}, function(tabs){
						var currentExistingTabs = {};
						var newTabsArray = [];
						for(var i=0; i< tabs.length; i++){
							currentExistingTabs[tabs[i].id] = true;
						}
						for(var j = 0; j< tabsArray.length; j++){
							if(currentExistingTabs[tabsArray[j]]){
								newTabsArray.push(tabsArray[j]);
							}
						}
						if(newTabsArray.length !==0){
							chrome.windows.create({tabId: newTabsArray[0]},function(window){
								that.recombineTabs(1,window.id,newTabsArray.slice(1));
							});
						} else {
							alert("Previous tabs were closed.");
							that.disableUndoButton();
						}						
					});
				}
			});			
		},

		/**
		* recombine the tabs into one window
		* @param {number} tabIndex Starting tab index in previous window of first tab 
		* @param {number} windowId Id of final window holding recombined tabs
		* @param {array} tabsArray Array of tab objects to be moved back to the previous window
		*/
		recombineTabs: function(tabIndex, windowId, tabsArray) {
			var indexCounter = tabIndex;
			for(var index=0; index<tabsArray.length; index++){
				window.chrome.tabs.move(tabsArray[index],{windowId: windowId, index: indexCounter});
				indexCounter++;
			}
			var updateInfo = resize.lastTab.lastWindowInfo;
			var updateInfoForUpdate = $.extend(true, {}, updateInfo);
			delete updateInfoForUpdate.incognito;
			window.chrome.windows.update(windowId,updateInfoForUpdate);
			this.disableUndoButton();
		},

		/**
		* disabled undo button from user input
		*/
		disableUndoButton: function() {
			resize.lastTab = null;
			resize.storage.removeItem('lastTab');	
			$('#undo-layout').addClass('disabled');
		},
		
		
		/*
		* default configuration option
		*/
		
		/**
		* hides the default layout confirmation modal box 
		*/			
		hideConfirmationModal: function() {
			$('.main-view').removeClass('inactive');
			$('.confirmation-modal').addClass('hidden');
		},
	
		/**
		* shows the default layout confirmation modal box 
		*/		
		showConfirmationModal: function() {
			$('.confirmation-modal').removeClass('hidden').trigger('show');
			$('.main-view').addClass('inactive');	
		}
					
	};
	
	window.resize.options = options;
	
})();