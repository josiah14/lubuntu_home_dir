PUI.PseudoPopup = Class.extend({
	initialize: function(el) {
		this.el = $(el);
		$.makeArray(this.el.find('x-iframe')).forEach(prepareIframe);
	}
});

function prepareIframe(el) {
	var iframe = document.createElement("iframe");
	var attributes = el.getAllAttributes();
	for ( var key in attributes ) if ( attributes.hasOwnProperty(key) )
		iframe.setAttribute(key, attributes[key]);
	$(el).replaceWith(iframe);
}