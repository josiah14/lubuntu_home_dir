String.prototype.trimChars = function(charlist) {
	charlist = charlist || ' \r\n\t';
    var l = 0, i = 0;
    
    var ret = this;
    
    l = ret.length;
    for (i = 0; i < l; i++) {
        if (charlist.indexOf(ret.charAt(i)) === -1) {
            ret = ret.substring(i);
            break;
        }
    }
    
    l = ret.length;
    for (i = l - 1; i >= 0; i--) {
        if (charlist.indexOf(ret.charAt(i)) === -1) {
            ret = ret.substring(0, i + 1);
            break;
        }
    }
    
    return charlist.indexOf(ret.charAt(0)) === -1 ? ret : '';
};

String.prototype.contains = function(str) {
	return this.indexOf(str) !== -1;
};

String.prototype.cleanData = function() {
	return this.replace(/<!\[CDATA\[(.*)\]\]>/, function(a, b) { return b; }).trim();
};

String.prototype.upperCaseFirst = function() {
	return this.replace(/^./, function(a) {
		return a.toUpperCase();
	});
};

String.prototype.stripHTMLEntities = function() {
	var el = document.createElement("div");
	var html = this.replace(/<img/g, '<x-img');
	el.innerHTML = html;
	return el.innerText;
}