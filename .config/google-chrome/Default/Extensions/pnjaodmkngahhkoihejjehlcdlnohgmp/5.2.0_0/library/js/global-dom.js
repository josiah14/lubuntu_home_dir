var VALID_KEYS = {
	38: "up", // up
	40: "down", // down
	75: "up", // k
	74: "down", // j
	8: "back", // backspace
	13: "forward", // enter
	32: "forward", // space
	76: "forward", // l
	72: "back" // h
};

function validNavigationEvent(e) {
	var target = $(e.target);

	// Don't do anything when in input fields
	if (target.closest('input, textarea').length)
		return false;
	
	return !!VALID_KEYS[e.keyCode];
}

function eventNavigationDirection(e) {
	return VALID_KEYS[e.keyCode];
}

function onKeyDownEvent(e, vc) {
	if (! validNavigationEvent(e))
		return;
	
	e.preventDefault();

	var dir = eventNavigationDirection(e);

	if (dir === "up")
		vc.historyPrevious();
	else if (dir === "down")
		vc.historyNext();
	else if (dir === "forward")
		vc.navForward();
	else if (dir === "back")
		vc.navBack();
}