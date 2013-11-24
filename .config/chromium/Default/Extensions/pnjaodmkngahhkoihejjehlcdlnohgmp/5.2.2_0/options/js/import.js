window.addEventListener('load', function() {
	var fileInput = $('input[type=file]');
	
	$('.import').click(function() {
		fileInput[0].click();
	});
	
	fileInput.change(function() {
		readFileInput(fileInput[0], onFileRead);
	});
}, false);

function onFileRead(contents) {
	if ( window.safari && window.safari.self ) {
		safari.self.tab.dispatchMessage("import:contents", {contents: contents});
	}
}