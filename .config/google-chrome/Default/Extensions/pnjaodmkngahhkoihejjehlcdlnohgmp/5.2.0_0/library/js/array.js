Array.prototype.remove = function(item) {
	for (var i = this.length; i--;)
		if (this[i] === item) this.splice(i, 1);
	return this;
};

Array.prototype.contains = function(search) {
	return this.indexOf(search) !== -1;
};

// Uses a reverse-unique-algorithm for Google Reader
Array.prototype.unique = function(){
   var u = {}, a = [];
   for(var l = 0, i = this.length-1; i >= 0; --i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.unshift(this[i]);
      u[this[i]] = 1;
   }
   return a;
};

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};