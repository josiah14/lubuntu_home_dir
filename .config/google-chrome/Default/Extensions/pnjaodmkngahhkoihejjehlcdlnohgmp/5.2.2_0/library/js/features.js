if (Ext.isOnline()) {
	document.body.className += " fat-top-bar";
}

if (Ext.isChrome()) {
	document.body.className += " transition-transform-bug";
} else {
	document.body.className += " no-transition-transform-bug";
}

if (Modernizr.touch) {
	document.body.className += " touch";
} else {
	document.body.className += " no-touch";
}