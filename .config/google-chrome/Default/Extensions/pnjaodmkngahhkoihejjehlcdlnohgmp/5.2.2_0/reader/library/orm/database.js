var Database = Class.extend({
	initialize: function(name) {
		this.connect(name);
	},
	
	run: function(type, args, callback) {
		callback = callback || function() {};
		
		// Camelcase method type
		var typeMethod = type.charAt(0).toUpperCase() + type.substring(1).toLowerCase();
		
		// Build implementation dependant query object 
		if ( ! this['build' + typeMethod] )
			throw type + " not permitted";
		
		var queryObject = this['build' + typeMethod].apply(this, args);
		
		// Run query with callback
		this.executeQuery(queryObject, callback);
		
		return this;
	},
	
	onError: function(queryObject, message, callback) {
		// Just log error for now
		console.error("SQLERROR " + message);
		console.error(queryObject.sql, "failed with error", message);
		
		// Fire callback anyway?
		callback(false, {error: true, message: message});
	},
	
	connect: function(name) { throw "implement"; },
	executeQuery: function(queryObject) { throw "implement"; },
	
	/*
		Method:
			makeTable
		
		Create table from schema.
		
		Format of schema:
			A key-value object where the keys are the name of the columns,
			and values are objects which describe the column. Possible values are:
			
			* type (mandatory): type to be stored. Can be either: int, text or float
			* mandatory (optional): true if field is mandatory. Default is true.
			* standard (optional): Default value.
		
		Parameters:
			name - The name of the table
			primaryKey - The primary key to use, defaults to ID
			schema - See above for description of schema
			callback - Callback when complete
	*/
	
	makeTable: function(name, primaryKey, schema, callback) { throw "implement"; },
	
	/*
		Method:
			dropTable
		
		Drop table from database. Should not fail if table doesn't exist
		
		Parameters:
			name - Name of table
			callback - Callback when complete
	*/
	
	dropTable: function(name, callback) { throw "implement"; },
	
	/*
		Method:
			tableExists
		
		Check if table exists
		
		Parameters:
			name - Name of table
			callback - Callback when called, first parameter is a boolean which is true/false depnding on if the table exists
	*/
	
	tableExists: function(name, callback) { throw "implement"; },
	
	/*
		Method:
			addIndex
			
		Add index to column
	*/
	
	addIndex: function(table, column, callback) { throw "implement"; },
	
	/*
		Method:
			addField
			
		Add a field using a schema object, by alterint table
		
		Parameters:
			table
			fieldName
			fieldData
			callback
	*/
	
	addField: function(table, fieldName, fieldData, callback) { throw "implement"; },
	
	/*
		Method:
			buildFind
		
		Build a query for finding objects. The parameters are:
		
		where:
		
			"where" can either be the string "all" or an object. An empty object has
			the same effect as "all", i.e. don't filter anything.
		
			If an object, the keys are fields and the values are values to match by.
		
			The format of the keys can be either just the field name, e.g. "id", "title",
			or it can also contain the operand to use, e.g. "id >", "id !=".
		
			Example where:
				{id: 10} => id = 10
				{'id >': 10} => id > 10
				{title: "hello world", "published >": 1331985271237} => title = "hello world" and published > 1331985271237
		
			If the value is an array it will be used to OR together several expressions for the same field.
		
			Example:
				{id: [1, 1, 2, 3, 5, 8]} => (id = 1 or id = 1 or id = 2 or id = 3 or id = 5 or id = 8)
				{'id =': [1, 2]} => (id = 10 or id = 2)
		
			Available operands are:
				=, >, <, %, !=
		
		how:
			An optional object specifying:
		
				* limit: Either one number with the count, or an array with two elements specifing the offset and count
				* by: Order by. The format is a string with: "<field> <asc|desc>", where
				                 the second argument is optional defaulting to asc.
		
			Example how:
				{limit: 10} => The first 10 from the result
				{limit 10, by: 'id'} => The first 10 order by the field name id, ascending
				{limit: 1, by: 'id desc'} => One, ordering the result set by id descending
		
		Parameters:
			Standard -build* parameters.
	*/
	
	buildFind:   function(table, primaryKey, where, how) { throw "implement"; },
	
	/*
		Method:
			buildUpdate
	*/
	
	buildUpdate: function(table, primaryKey, object) { throw "implement"; },

	/*
		Method:
			buildInsert
	*/

	buildInsert: function(table, primaryKey, object) { throw "implement"; },

	/*
		Method:
			buildDelete
	*/

	buildDelete: function(table, primaryKey, where) { throw "implement"; },
	
	/*
		Method:
			buildCount
	*/
	
	buildCount: function(table, primaryKey, where) { throw "implement"; }
});

Database.instances = {};

Database.getInstance = function(name, adapter) {
	if ( ! Database.instances[name] )
		Database.instances[name] = new window[adapter || Platform.env.DBAdapter](name);
	
	return Database.instances[name];
};

Database.switchDatabase = function(name) {
	Database.current = Database.getInstance(name);
}

function dbLog() {
	//console.log.apply(console, arguments);
}