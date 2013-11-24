var isLoaded = false;

window.addEventListener('DOMContentLoaded', function() {
	isLoaded = true;
	if ( typeof window.parent.onUILoad === "function" )
		window.parent.onUILoad();
}, false);