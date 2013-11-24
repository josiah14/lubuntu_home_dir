module('Database with WebSQL');

var expected1 = 15;
asyncTest('1. connecting and creating test schema/data', expected1, function() {
	function callback(message) {
		return function(res) {
			expected1--;
			ok(!!res, message);
			expected1 == 0 && start();
		};
	};
	
	var db = Database.getInstance("test");
	
	db.dropTable('cars', callback("Drop cars"));
	db.dropTable('people', callback("Drop people"));
	
	db.tableExists('cars', function(existed) {
		ok(! existed, "cars shouldn't exist");
		--expected1 == 0 && start();
	});
	
	db.makeTable('cars', 'id', {
		'make': {type: 'text'},
		'model': {type: 'text'}
	}, callback("Create table with text-only fields"));
	
	db.tableExists('cars', function(existed) {
		ok(existed, "Cars should exist");
		--expected1 == 0 && start();
	});

	db.makeTable('people', 'id', {
		'name': {type: 'text'},
		'age': {type: 'int', mandatory: false, standard: '10'}
	}, callback("Create table with standard values and mandatory fields"));
	
	db.run('insert', ["cars", "id", {make: "Volvo", model: "V70"}], callback("Insert values into cars"));
	db.run('insert', ["cars", "id", {make: "Audi", model: "Quattro"}], callback("Insert values into cars"));
	
	db.run('insert', ["people", "id", {name: "Erik", age: 19}], callback("Insert values with standard and mandatory fields"));
	db.run('insert', ["people", "id", {name: "Johan"}], callback("Insert values with standard and mandatory fields"));
	db.run('insert', ["people", "id", {name: "Oskar", age: 10}], callback("adding data"));
	db.run('insert', ["people", "id", {name: "Joakim"}], callback("adding data"));
	db.run('insert', ["people", "id", {name: "Joel", age: 1000}], callback("adding data"));
	db.run('insert', ["people", "id", {name: "Viktor", age: 0}], callback("adding data"));
	db.run('insert', ["people", "id", {name: "Dennis"}], callback("adding data"));
});

var expected2 = 10;
asyncTest('2. fetching test data with where', expected2, function() {
	function find(table, where, how, callback) {
		callback = callback || how;
		if ( typeof how === "function" )
			how = false;
		db.run('find', [table, 'id', where, how], callback);
	}
	
	function done() { --expected2 === 0 && start(); }
	
	var db = Database.getInstance("test");
	
	// Find all with 'all'
	find('cars', 'all', function(rows) {
		equals(rows.length, 2, "Should find everything in table with 'all'");
		done();
	});
	
	// Find all with empty where
	find('cars', {}, function(rows) {
		equals(rows.length, 2, "Empty where should find everything");
		done();
	});
	
	// Test people
	find('people', {name: "Erik"}, function(rows) {
		ok(rows.length == 1, "Find with text-based where");
		done();
		
		equals(rows[0].name, "Erik", "Find with text-based where");
		done();
	});
	
	// Testing complex where
	find('people', {'id <': 2}, function(rows) {
		ok(rows.length == 1, "Find with complex where");
		done();
	});
	
	// Testing default values
	find('people', {'id =': 2, 'name': 'Johan'}, function(rows) {
		ok(rows.length == 1, "Find with multiple parameters");
		done();
		
		equals(rows[0].name, 'Johan', 'Find with multiple parameters');
		done();
		
		equals(rows[0].age, 10, 'Default values');
		done();
	});
	
	// Testing OR
	find('people', {'name =': ['Oskar', 'Joakim', 'Joel']}, function(rows) {
		equals(rows.length, 3, "Find with OR");
		done();
	});
	
	// Testing OR with other values
	find('people', {'name =': ['Oskar', 'Joakim', 'Joel'], id: 3}, function(rows) {
		equals(rows.length, 1, "Find with OR and other values");
		done();
	});
});

var expected3 = 7;
asyncTest('3. Adding/Updating/Removing', expected3, function() {
	var db = Database.getInstance("test");
	
	function find(table, where, how, callback) {
		callback = callback || how;
		if ( typeof how === "function" )
			how = false;
		db.run('find', [table, 'id', where, how], callback);
	}
	
	function done() { --expected3 === 0 && start(); }
	
	find('people', {id: 2}, function(rows) {
		var row = rows[0];
		
		row.name = "New Jack";
		row.age = 1337;
		
		db.run('update', ['people', 'id', row], function() {
			find('people', {id: 2}, function(rows2) {
				var newRow = rows2[0];
				equals(newRow.name, "New Jack", "Object should be updated");
				done();
				
				equals(newRow.age, 1337, "Object should be updated");
				done();
			});
		});
	});
	
	find('people', {id: 6}, function(rows) {
		var row = rows[0];
		
		ok(!! row, "Fetching object to delete by ID");
		done();
		
		db.run('delete', ['people', 'id', row.id], function() {
			find('people', {id: 6}, function(rows) {
				equals(rows.length, 0, "Object should be gone");
				done();
			});
		});
	});
	
	db.run('insert', ['people', 'id', {name: 'Olle', age: 10}], function(res, meta) {
		ok(!! meta.insertId, 'Inserts should have insertId in meta');
		done();
		
		find('people', {id: meta.insertId}, function(rows) {
			equals(rows[0].id, meta.insertId, "Should find newly created object");
			done();
			
			equals(rows[0].name, "Olle", "Should have newly created object");
			done();
		});
	});
});

var expected4 = 5;
asyncTest('4. Finds with how', expected4, function() {
	var db = Database.getInstance("test");
	
	function find(table, where, how, callback) {
		callback = callback || how;
		if ( typeof how === "function" )
			how = false;
		db.run('find', [table, 'id', where, how], callback);
	}
	
	function done() { --expected4 === 0 && start(); }
	
	find('people', 'all', {by: 'id desc'}, function(rows) {
		var first = rows[0], last = rows[rows.length-1];
		
		ok(first.id > last.id, "Should be sorted descending");
		done();
	});

	find('people', 'all', {by: 'id asc'}, function(rows) {
		var first = rows[0], last = rows[rows.length-1];
		
		ok(last.id > first.id, "Should be sorted ascending");
		done();
	});
	
	find('people', 'all', {by: 'id desc', limit: 2}, function(rows) {
		equals(rows.length, 2, 'Fetching with single digit limit');
		done();
	});
	
	find('people', 'all', {by: 'id asc', limit: [2, 2]}, function(rows) {
		equals(rows[0].id, 3, "Fetching by array limit");
		done();
		
		equals(rows[1].id, 4, "Fetching by array limit");
		done();
	});
});
