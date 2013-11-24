// Connect request
if (document.getElementById('feeder-connect-url')) {
	var url = document.getElementById('feeder-connect-url').value;
	sendMessage("feeder:connect", {
		connectURL: url,
		doMerge: ! document.getElementById('do-merge') || document.getElementById('do-merge').value == "yes"
	});

	listenForMessages("sync:merge", function(evt) {
		document.getElementById('sync-status').innerText = evt.status;
	});
}

// Fetch feeds
if (document.getElementById('feeder-feeds-json')) {
	var resultElement = document.getElementById('feeder-feeds-json');

	listenForMessages("feeder:feedsFetched", function(msg) {
		resultElement.value = msg.feeds;
		resultElement.setAttribute("data-loaded", "true");
	});
	sendMessage("feeder:fetchFeeds", {});
}

function sendMessage(name, message) {
	if ( isChrome()) {
		message.type = name;
		chrome.extension.sendRequest(message);
	} else if ( isSafari() ) {
		safari.self.tab.dispatchMessage(name, message);
	}
}

function listenForMessages(name, callback) {
	if (isChrome()) {
		chrome.extension.connect().onMessage.addListener(function(msg) {
			if (msg.name != name)
				return;
			callback(msg)
		});
	} else if (isSafari()) {
		sendMessage("connect", {type: name});

		safari.self.addEventListener("message", function(e) {
			if (e.name != name)
				return;
			callback(e.message);
		}, false);
	}
}

function isChrome() { return window.chrome && window.chrome.extension; }
function isSafari() { return window.safari && window.safari.self; }