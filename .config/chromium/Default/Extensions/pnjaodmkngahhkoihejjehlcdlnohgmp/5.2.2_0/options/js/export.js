window.addEventListener('load', function() {
	if ( window.safari && window.safari.self ) {
		safari.self.addEventListener("message", gotContents, false);
		safari.self.tab.dispatchMessage("safari:popupFormSubmit:ping", {});
	}
}, false);

function gotContents(e) {
	if ( e.name != "safari:popupFormSubmit:contents" )
		return;
	
	var data = e.message.data;
	var form = document.querySelector('form');
	form.action = e.message.action;
	
	for (var key in data) if (data.hasOwnProperty(key)) {
		var inp = document.createElement("input");
		inp.type = "hidden";
		inp.name = key;
		inp.value = data[key];
		form.appendChild(inp);
	}
	
	form.submit();
}