if ( ! ("bind" in Function.prototype) ) {
	Function.prototype.bind = function(bound) {
		var func = this;
		return function() {
			return func.apply(bound, arguments);
		};
	};
}

var APIDatabase = Database.extend({
	initialize: function() {
		this._super.apply(this, arguments);
		this.isApi = true;
	},
	
	connect: function(name) {
		
	},
	
	executeQuery: function(queryObject, callback) {
		// Send API call
		var request = new Request({
			url: Config.feeder.root + '/api/db.json',
			method: 'POST',
			onComplete: function(status, text) {
				var result = tryToParseJSON(text);
				if (! result || result.error || status != 200) {
					if (result && result.error === "login_required") {
						window.top.location = Config.feeder.loginUrl + '&to=' + window.top.location.pathname;
					}
					this.onError(queryObject, result ? result.error : result, callback);
					return;
				}
				this.querySuccess.apply(this, [queryObject, callback].concat(result))
			}.bind(this),
			addFeederAuthorization: true
		});
		
		request.send({post: queryObject});
	},
	
	querySuccess: function(queryObject, callback, res) {
		// Turn result into a nice array of objects
		var rows = [];
		for ( var i = 0; i < res.rows.length; i++ )
			rows.push(res.rows[i]);
		
		// Get some information about the query
		
		// Fetching insertId when not present throws an exception.
		var insertId = false;
		try { insertId = res.insertId; } catch (e) {}
		
		var meta = {
			insertId: insertId,
			affectedRows: res.rowsAffected,
			error: false
		};
		
		callback(rows, meta);
	},
	
	makeTable: function(name, primaryKey, schema, callback) {
		// NoOp...
		callback();
	},
	
	addIndex: function(table, column, callback) {
		// NoOp...
		callback();
	},
	
	addField: function(table, fieldName, fieldData, callback) {
		// NoOp...
		callback();
	},
	
	dropTable: function(name, callback) {
		// NoOp...
		callback();
	},
	
	tableExists: function(name, callback) {
		callback(true);
	},
	
	buildFind: function(table, primaryKey, where, how) {
		if ( where == "all" || where == "*" )
			where = {};
		return {
			type: 'find',
			table: table,
			where: JSON.stringify(where),
			how: JSON.stringify(how)
		};
	},
	
	buildCount: function(table, primaryKey, where, how) {
		if ( where == "all" || where == "*" )
			where = {};
		return {
			type: 'count',
			table: table,
			where: JSON.stringify(where),
			how: JSON.stringify(how)
		};
	},
	
	buildUpdate: function(table, primaryKey, what, where) {
		return {
			type: 'update',
			table: table,
			what: JSON.stringify(what),
			where: JSON.stringify(where)
		};
	},
	
	buildInsert: function(table, primaryKey, object) {
		return {
			type: 'insert',
			table: table,
			object: JSON.stringify(object.getValues())
		};
	},
	
	buildDelete: function(table, primaryKey, where) {
		return {
			type: 'delete',
			table: table,
			where: JSON.stringify(where)
		};
	}
});
