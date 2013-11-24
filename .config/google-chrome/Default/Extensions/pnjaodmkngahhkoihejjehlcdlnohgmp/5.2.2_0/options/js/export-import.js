var ExportImport = {
	fs: false,
	
	Export: new (Class.extend({
		initialize: function() {
			
		},
		
		downloadFile: function() {
			var feedOPMLText = this.exportFeeds();
			ExportImport.writeFileQuick(feedOPMLText);
		},
		
		exportFeeds: function() {
			return '<?xml version="1.0" encoding="UTF-8"?>'
				+ json2xml({
					'opml': {
						'@version': '1.0',
						'head': {'title': 'Feeder - RSS Feed Reader'},
						'body': {
							'outline': this.toOutlines(app.user.structure.base)
						}
					}
				});
		},
		
		toOutlines: function(folder) {
			var lastOutlines = this.outlines;
			this.outlines = [];
			
			// folder.name == Folder name
			// folder.children == The folders
			// folder.feeds == The order and feeds of a folder
			
			folder.forEachItem(this.toOutlineFromItem);
			
			var outlines = this.outlines;
			this.outlines = lastOutlines;
			
			return outlines;
		},
		
		toOutlineFromItem: function(item, index) {
			var outline = item.isFeed ? this.toOutlineFromFeed(item) : this.toOutlineFromFolder(item);
			if ( ! outline )
				return;
			this.outlines.push(outline);
		},
		
		toOutlineFromFeed: function(feed) {
			if ( ! feed || ! feed.path )
				return null;
			
			return {
				'@text': (feed.title || feed.path).encodeHTML(),
				'@title': (feed.title || feed.path).encodeHTML(),
				'@type': 'rss',
				'@xmlUrl': feed.path.encodeHTML(),
				'@htmlUrl': (feed.link || "").encodeHTML(),
				'@rssfr-numPosts': feed.numPosts,
				'@rssfr-forceUpdate': feed.forceUpdate,
				'@rssfr-favicon': (feed.favicon || "").encodeHTML(),
				'@rssfr-useNotifications': feed.useNotifications,
				'@rssfr-updateInterval': feed.updateInterval,
			};
		},
		
		toOutlineFromFolder: function(folder) {
			if ( ! folder || ! folder.name )
				return null;
			
			return {
				'@title': folder.name.encodeHTML(),
				'@text': folder.name.encodeHTML(),
				'outline': this.toOutlines(folder)
			};
		},

		exportUnreads: function(callback) {
			var container = new FeedUnreadContainer();
			var link = chain();

			app.user.forEachFeed(function(feed) {
				link.and(feed.getPostsOfInterest)
				link.thenSync(function(posts) {
					posts.forEach(function(post) {
						container.addPostFor(feed, post);
					});
				});
			});

			link.end(callback, container);
		}
	})),
	
	Import: Class.extend({
		initialize: function(data) {
			this.data = data;
		},
		
		load: function(callback) {
			this.feedContainer = app.user.createFeedContainer();
			
			if ( ! this.tryLoadOPML() )
				this.tryLoadOldJSON();
			
			if ( this.isError )
				return callback(false);
			
			chain(app.sync.mergeContainer, this.feedContainer)
			.then(function(res, next) {
				if ( ! res ) {
					callback(false);
					return chain.exit;
				}
				next();
			})
			.and(app.sync.push)
			.end(callback, true)
		},
		
		tryLoadOPML: function() {
			var doc = (new DOMParser()).parseFromString(this.data, 'text/xml');
			
			if ( ! doc ) {
				this.isError = true;
				return false;
			}
			
			var data = xml2json(doc);
			this._data = data;
			
			if ( ! data || ! data.body || ! data.body.outline ) {
				this.isError = true;
				return false;
			}
			
			this.convertOPML(data);
			
			return true;
		},
		
		tryLoadOldJSON: function() {
			var data;
			try {
				data = JSON.parse(this.data);
			}
			catch (e) {}
			
			if ( ! data || ! data.feeds || ! data.folders || ! data.folders[0] )
				return false;

			this.feedMap = data.feeds;
			
			this.parseOldFolder(data.folders[0]);
			this.isError = false;
			
			return true;
		},
		
		convertOPML: function(data) {
			this.outlineToFolder({'@title': 'Feeds', outline: data.body.outline});
		},
		
		outlineToFolder: function(outlineFolder) {
			var folder = this.feedContainer.pushFolder(outlineFolder['@title'] || outlineFolder['@text']);
			
			if ( ! outlineFolder.outline ) {
				this.feedContainer.popFolder();
				return 
			}
			
			var items = ensureArray(outlineFolder.outline).map(this.outlineToItem);
			items.clean();
			
			this.feedContainer.popFolder();
			
			return folder;
		},
		
		outlineToItem: function(outline) {
			if ( outline['@xmlurl'] )
				return this.outlineToFeed(outline);
			else if ( outline['@title'] || outline['@text'] )
				return this.outlineToFolder(outline);
			return false;
		},
		
		outlineToFeed: function(outline) {
			return this.feedContainer.addFeed({
				path: outline['@xmlurl'],
				guid: outline['@xmlurl'],
				link: outline['@htmlurl'],
				title: outline['@title'] || outline['@text'] || outline['@htmlurl'] || outline['@xmlurl'],
				favicon: outline['@rssfr-favicon'],
				numPosts: outline['@rssfr-numposts'],
				forceUpdate: outline['@rssfr-forceupdate'],
				useNotifications: outline['@rssfr-usenotifications']
			});
		},
		
		parseOldFolder: function(folder) {
			this.feedContainer.pushFolder(folder.name);
			
			folder.feeds.forEach(function(item) {
				this.parseItem(item, folder);
			}, this);
			
			this.feedContainer.popFolder();
		},
		
		parseItem: function(item, folder) {
			if ( typeof item === 'number' )
				this.parseFolder(item, folder);
			else
				this.parseFeed(item, folder);
		},
		
		parseFeed: function(feedUrl) {
			var feedData = this.feedMap[feedUrl];
			
			if ( ! feedData )
				feedData = {};
			
			feedData.path = feedUrl;
			feedData.guid = feedUrl;
			
			this.feedContainer.addFeed(feedData)
		},
		
		parseFolder: function(folderId, parentFolder) {
			var folder = parentFolder.children[folderId];
			if ( ! folder )
				return;
			
			this.parseOldFolder(folder);
		}
	}),
	
	writeFileQuick: function(contents) {
		var form = document.createElement("form");
		form.action = "http://feeder.co/opml/";
		form.method = "POST";
		form.target = "_blank";
		
		var text = document.createElement("input");
		text.type = "hidden";
		text.name = "opml";
		text.value = contents;

		var explanation = document.createElement("input");
		explanation.name = "explanation";
		explanation.value = "Why are sending your OPML data to our servers? This is because there is no good way for us to create files and have them downloaded to the users computer. Nothing about this request is stored or looked at. If you disagree with this, please: feeder.co/support";
		explanation.type = "hidden";
		
		form.appendChild(text);
		form.appendChild(explanation);
		
		if (Ext.isSafari()) {
			Platform.env.safariSubmitFormFromPopup(form);
			return;
		}
		
		document.body.appendChild(form);
		
		form.submit();
		
		setTimeout(function() { form.parentNode.removeChild(form); }, 500);
	}
};

function ensureArray(thing) {
	return thing instanceof Array ? thing : [thing];
}
