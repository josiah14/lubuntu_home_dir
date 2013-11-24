if (Ext.isOnline()) {
	document.body.classList.add("fat-top-bar");
}

if (Ext.isChrome()) {
	document.body.classList.add("transition-transform-bug");
} else {
	document.body.classList.add("no-transition-transform-bug");
}

if (Modernizr.touch) {
	document.body.classList.add("touch");
} else {
	document.body.classList.add("no-touch");
}