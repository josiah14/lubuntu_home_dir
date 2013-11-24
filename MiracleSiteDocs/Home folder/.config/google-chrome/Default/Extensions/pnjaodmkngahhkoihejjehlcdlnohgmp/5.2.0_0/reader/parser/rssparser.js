var RSSParser = FeedParser.extend({
	initialize: function(feed) {
		this._super(feed);
		
		this.root = false;
	},
	
	setResult: function(xml, text, callback) {
		text = text.trimChars();
		
		// no xml-header? attempt to parse it on our own
		if ( ! xml )
			xml = new DOMParser().parseFromString(text, 'text/xml');
		
		var root = xml.documentElement;
		
		// If parsing as XML failed, try and parse as HTML, because HTML is so lovely
		if ( ! root || root.querySelector('parsererror') ) {
			// Try to parse as HTML instead
			// TODO: FIXME: Strip <script>-tags and <img>-tags
			var placeholder = document.createElement('parse-xml');
			placeholder.innerHTML = text;
			root = placeholder.firstElementChild;
			
			if ( ! root ) {
				this.error = true;
				fireCallback(callback);
				return;
			}
		}
		
		this.root = root;
		fireCallback(callback);
	},
	
	parse: function(callback) {
		this.currentCallback = callback;
		
		var root = this.root;
		
		if ( this.error ) {
			rssLog("error on first");
			this.currentCallback(this);
			return;
		}
		
		// Test for RSS
		var type = false;
		if ( root.tagName.toLowerCase() == 'rss' ) 
			type = 'rss';
		else if ( root.tagName.toLowerCase() == 'feed' )
			type = 'atom';
		else if ( root.tagName.toLowerCase() == 'rdf' || root.tagName.toLowerCase() == 'rdf:rdf' )
			type = 'rss';
		
		if ( ! type ) {
			console.log("not compatible", this.path, root.tagName, root);
			this.error = true;
			this.currentCallback(this);
			return;
		}
		
		rssLog("parsing %s", type);
		rssLog("error: %s", this.error);
		
//		try {
			switch ( type ) {
				case 'rss':
					this.parseRSSResponse(root);
					break;
			
				case 'atom':
					this.parseAtomResponse(root);
					break;
			}
			
			this.currentCallback(this);
//		} catch (e) {
//			rssLog("exceptioned");
//			this.error = true;
//			this.currentCallback(this);
//		}
	},

	parseRSSResponse: function(root) {
		// Get link, use this contraption because some feeds mix atom:link to be compatible with atom
		// Or something weird
		var link, links = root.querySelectorAll('channel > link');
		for ( var i = 0, l; l = links[i]; i++ ) {
			if ( ! l.tagName.contains('atom') ) {
				link = l.textContent.cleanData();
				break;
			// Fix for weird "atom10" format, see: feedsfeedburnercomimgurgallery?format=xml
			} else if ( l.tagName.contains('atom10') ) {
				link = l.getAttribute('href');
				break;
			}
		}
		
		this.data.link = link;
		this.path = link;
		
		if ( link )
			this.data.favicon = Config.defaultFavicon(this.getDomain(this.data.link));
		else
			this.data.favicon = Config.defaultFavicon();
		
		var titleEl = root.querySelector('title');
		this.data.title = ((titleEl ? titleEl.textContent.cleanData() : this.link) || '').trimChars();
		
		var posts = root.querySelectorAll('item');
		for ( var i = 0, post; (post = posts[i]) && i < Config.maxPostsPerFeedFile; i++ ) {
			var titleElement = post.querySelector('title');
			var linkElement = post.querySelector('link');
			var guidElement = post.querySelector('guid');
			
			if ( ! titleElement )
				continue;
			
			// Fulhax for piratebay feeds. If the link element is empty something went wrong during parseing
			// The link element is empty, but the next text node is the actual link
			if ( linkElement && (! linkElement.childNodes || linkElement.childNodes.length == 0) && (linkElement.nextSibling && linkElement.nextSibling.tagName && linkElement.nextSibling.tagName.contains("LINK")) ) {
				linkElement = linkElement.nextSibling;
			}
			// End fulhax
			
			// Fulhax for itunes feeds
			var enclosureElement = post.querySelector('enclosure');
			var podcastURL = enclosureElement ? enclosureElement.getAttribute('url') : false;
			var fallbackElement = podcastURL ? podcastURL : false;
			// end fulhax
			
			var link;
			if ( linkElement )
				if ( linkElement.getAttribute('href') )
					link = linkElement.getAttribute('href');
				else
					link = linkElement.textContent.cleanData();
			else
				link = fallbackElement;
			
			if ( ! link )
				continue;
			
			var descriptionElement = post.getElementsByTagName('description')[0] || post.getElementsByTagName('content')[0];
			var summary = '';
			var images = [];
			if ( descriptionElement && descriptionElement.textContent ) {
				var res = this.parseDescription(descriptionElement.textContent.cleanData());
				images = res.images;
				summary = res.summary;
			}
			
			this.foundPost({
				title: titleElement ? titleElement.textContent.cleanData() : 'no title',
				link: link,
				published: this.getDate(post),
				guid: guidElement ? guidElement.textContent.cleanData() : '',
				summary: summary,
				images: images
			});
		}
	},

	parseAtomResponse: function(root) {
		var titleEl = root.querySelector('title');
		
		this.data.link = this.parseLink(root);
		this.data.title = (titleEl ? titleEl.textContent.cleanData() : (this.data.link || '')).trimChars();
		this.data.favicon = app.config.defaultFavicon(this.getDomain(this.data.link));
		
		this.path = this.data.link;
		
		var posts = root.querySelectorAll('entry');
		for ( var i = 0, post; (post = posts[i]) && i < Config.maxPostsPerFeedFile; i++ ) {
			var titleElement = post.querySelector('title');
			var linkElement = (post.querySelector('link[rel=alternate]') || post.querySelector('link'));
			var guidElement = post.querySelector('guid');
			
			if ( ! titleElement || ! linkElement )
				continue;
			
			var link = linkElement ? RSSParser.resolveFrom(linkElement, linkElement.getAttribute('href')) : 'http://google.com/search?q=Error1';
						
			var descriptionElement = post.getElementsByTagName('description')[0] || post.getElementsByTagName('content')[0];
			var summary = '';
			var images = [];
			if ( descriptionElement && descriptionElement.textContent ) {
				var res = this.parseDescription(descriptionElement.textContent.cleanData());
				images = res.images;
				summary = res.summary;
			}

			this.foundPost({
				title: titleElement ? titleElement.textContent.cleanData() : 'no title',
				link: link,
				published: this.getDate(post),
				guid: guidElement ? guidElement.textContent.cleanData() : ''
			});
		}
	},
	
	parseLink: function(root) {
		var links = Array.prototype.slice.call(root.querySelectorAll('link'), 0);
		
		// Find link
		links = links.filter(function(l) {
			return ! RSSParser.closest(l, 'entry');
		});
		
		// Sort after which one is most relevant
		// empty rel is a good thing, otherwise what should it be?
		links = links.sort(function(a, b) {
			return !a.getAttribute('rel') ? -1 : 1;
		});
		
		if ( ! links.length )
			return "";
		
		return RSSParser.resolveFrom(links[0], links[0].getAttribute('href'));
	},
	
	getDate: function(post) {
		var datePublished = post.querySelector('published') ||
			post.querySelector('updated') ||
			post.querySelector('pubDate') ||
			post.querySelector('date');
		var d = datePublished ? (new Date(datePublished.textContent.cleanData())).getTime() : Date.now();
		return d || Date.now();
	},
	
	foundPost: function(data) {
		if ( ! data.title || ! data.link )
			return;
		
		data.title = data.title.trimChars();
		data.link = data.link.trimChars();
		data.summary = this.useSummary ? data.summary : '';
		
		// If not http or https is present, or some other weird protocol, just assume it's relative
		if ( ! data.link.match(/^(http|https):/) && ! data.link.match(/^[a-zA-Z0-9-]+:/) ) {
			var domain = this.getDomain(this.path);
			data.link = domain.trimChars('/') + data.link;
		}
		
		this.posts.push(data);
	},
	
	getDomain: function(link) {
		if ( ! link )
			return "";
		return link.substr(0, (link.indexOf("/", link.indexOf('.')) + 1) || link.length).trimChars('/') + '/';
	},
	
	parseDescription: function(desc) {
		var matches = desc.match(/<img[^>]*(src="[^"]+")|(src='[^']+')/g);
		if ( ! matches ) {
			return {summary: desc, images: []};
		}
		var urls = matches.map(function(res) {
			return res.split(/src='|"/)[1];
		});
		return {summary: desc, images: urls};
	}
});

RSSParser.closest = function(el, selector) {
	do {
		if ( el.webkitMatchesSelector(selector) )
			return el;
	} while ( (el = el.parentNode) && el.webkitMatchesSelector );
	return false;
}

RSSParser.resolveFrom = function(ref, url) {
	var bases = [];
	var el = ref;
	while ( el && el.getAttribute ) {
		if ( el.getAttribute("xml:base") )
			bases.push(el.getAttribute("xml:base"))
		el = el.parentNode;
	}
	
	if (! bases.length)
		return url;
	
	return TRYIT(function() {
		return new URI(url, bases.reduce(function(a, b) {
			return new URI(a, b).toString();
		})).toString();
	}, this);
};

function rssLog() {
	return;
	console.log.apply(console, arguments);
}