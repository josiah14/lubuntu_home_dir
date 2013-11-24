// search for application/rss+xml
// found?
//     display page action
//     does page exist in feeds?
//        is page in posts?
//            mark as is read

// See if the document contains a <link> tag within the <head> and
// whether that points to an RSS feed.
//
// Copyright (c) 2010 The Chromium Authors. All rights reserved.
//
// Taken from Google Feed Reader extension:
//     http://src.chromium.org/viewvc/chrome/trunk/src/chrome/test/data/extensions/subscribe_page_action/

var messageSent = false;

function sendMessage(data) {
	messageSent = true;
	
	if ( window.chrome && chrome.extension )
		chrome.extension.sendRequest(data);
	else if ( window.safari && window.safari.self )
		safari.self.tab.dispatchMessage(data.type, data);
}

function findFeedLinks() {
	// Find all the RSS link elements.
	var result = document.evaluate(
		'//*[local-name()="link"][contains(@rel, "alternate")] ' +
		'[contains(@type, "rss") or contains(@type, "atom") or ' +
		'contains(@type, "rdf")]', document, null, 0, null
	);
	
	var feeds = [];
	var item;
	while (item = result.iterateNext()) {
		feeds.push({"href": item.href, "title": item.title});
	}
	
	if (feeds.length == 0)
		return false;
	
	// Notify the extension needs to show the RSS page action icon.
	sendMessage({type: "feedsFound", feeds: feeds});
	return true;
};

// Check to see if the current document is a feed delivered as plain text,
// which Chrome does for some mime types, or a feed wrapped in an html.
//
// Copyright (c) 2010 The Chromium Authors. All rights reserved.
//
// Taken from Google Feed Reader extension:
//     http://src.chromium.org/viewvc/chrome/trunk/src/chrome/test/data/extensions/subscribe_page_action/

function isFeedDocument() {
	var body = document.body;
	
	var soleTagInBody = "";
	if (body && body.childElementCount == 1) {
		soleTagInBody = body.children[0].tagName;
	}
	
	if ( document.getElementById('webkit-xml-viewer-source-xml') ) {
		try {
			soleTagInBody = document.getElementById('webkit-xml-viewer-source-xml').children[0].tagName.toUpperCase();
		} catch(e) {}
	}
	
	// Some feeds show up as feed tags within the BODY tag, for example some
	// ComputerWorld feeds. We cannot check for this at document_start since
	// the body tag hasn't been defined at that time (contains only HTML element
	// with no children).
	if (soleTagInBody == "RSS" || soleTagInBody == "FEED" || soleTagInBody == "RDF" || soleTagInBody == "RDF:RDF") {
		sendMessage({type: "feedsFound", feeds: [{href: location.href, title: location.href}]});
		return true;
	}
	
	// Chrome renders some content types like application/rss+xml and
	// application/atom+xml as text/plain, resulting in a body tag with one
	// PRE child containing the XML. So, we attempt to parse it as XML and look
	// for RSS tags within.
	if (soleTagInBody == "PRE") {
		var domParser = new DOMParser();
		var doc = domParser.parseFromString(body.textContent, "text/xml");
		
		// |doc| now contains the parsed document within the PRE tag.
		if (containsFeed(doc)) {
			// Let the extension know that we should show the subscribe page.
			sendMessage({type: "feedsFound", feeds: [{href: location.href, title: location.href}]});
			return true;
		}
	}	
	return false;
}

// Copyright (c) 2010 The Chromium Authors. All rights reserved.
//
// Taken from Google Feed Reader extension:
//     http://src.chromium.org/viewvc/chrome/trunk/src/chrome/test/data/extensions/subscribe_page_action/
function containsFeed(doc) {
	// Find all the RSS link elements.
	var result = doc.evaluate(
		'//*[local-name()="rss" or local-name()="feed" or local-name()="RDF" or local-name()="rdf:RDF"]',
		doc, null, 0, null);
	
	if (!result) {
		return false;  // This is probably overly defensive, but whatever.
	}
	
	var node = result.iterateNext();
	
	if (!node) {
		return false;  // No RSS tags were found.
	}
	
	// The feed for arab dash jokes dot net, for example, contains
	// a feed that is a child of the body tag so we continue only if the
	// node contains no parent or if the parent is the body tag.
	if (node.parentElement && node.parentElement.tagName != "BODY") {
		return false;
	}
	
	return true;
}

if ( window.top === window ) {
	findFeedLinks();
	isFeedDocument();

	if ( ! messageSent )
		sendMessage({type: "feedsFound", feeds: []});
}