var notifierJsScheme = "https://";

Hoptoad.setKey('ebd69484a750abf685de6967627dedc8');
Hoptoad.setEnvironment('production');

Hoptoad.notify = function(error) {
	var xml     = escape(Hoptoad.generateXML(error));
	var host    = Hoptoad.host || 'airbrake.io';
	var url     = 'https://' + host + '/notifier_api/v2/notices?data=' + xml;
	var request = document.createElement('iframe');
	
	request.style.width   = '1px';
	request.style.height  = '1px';
	request.style.display = 'none';
	request.src = url;

	document.getElementsByTagName('head')[0].appendChild(request);
}
