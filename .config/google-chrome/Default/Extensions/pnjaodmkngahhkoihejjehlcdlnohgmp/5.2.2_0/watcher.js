var fs = require('fs');
var walk = require('/usr/local/lib/node_modules/walk');

var sys = require('sys');
var exec = require('child_process').exec;

var root = '.';
var files = [];
var watchers = [];

// Walker options
var walker = walk.walk(root, { followLinks: false });

walker.on('file', function(root, stat, next) {
    // Add this file to the list of files
	if ( root.indexOf(".git") != -1 || root.indexOf("tests/") != -1 )
		return next();
	
    files.push(root + '/' + stat.name);
    next();
});

walker.on('end', function() {
	console.log("== Done finding files	");
	
	files.forEach(function(file) {
		console.log(file);
		var watcher = fs.watchFile(file, onFileChanged);
		watchers.push(watcher);
	});
});

function onFileChanged() {
	console.log("== File changed, reloading");
	
	exec("bash safari.sh", function(error, stdout, stderr) {
		console.log(stdout);
	});
}
