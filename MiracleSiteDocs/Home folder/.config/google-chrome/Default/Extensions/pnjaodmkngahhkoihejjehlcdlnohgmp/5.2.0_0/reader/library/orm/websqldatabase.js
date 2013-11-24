if ( ! ("bind" in Function.prototype) ) {
	Function.prototype.bind = function(bound) {
		var func = this;
		return function() {
			return func.apply(bound, arguments);
		};
	};
}

var WebSQLDatabase = Database.extend({
	connect: function(name) {
		this.db = openDatabase(name, '0.1', name.toLowerCase(), 5 * 1024 * 1024);
	},
	
	executeQuery: function(queryObject, callback) {
		dbLog("=== Running query\n" + queryObject.sql + ' ' + queryObject.args.join(", "));
		this.db.transaction(function(tx) {
			tx.executeSql(
				queryObject.sql,
				queryObject.args,
				function(tx, res) {
					dbLog("=== Query success");
					this.isError = false;
					this.querySuccess(queryObject, callback, tx, res);
				}.bind(this),
				function(tx, e) {
					dbLog("=== Query error", queryObject);
					this.isError = true;
					this.onError(queryObject, e.message, callback);
				}.bind(this)
			);
		}.bind(this));
	},
	
	querySuccess: function(query, callback, tx, res) {
		// Turn result into a nice array of objects
		var rows = [];
		for ( var i = 0; i < res.rows.length; i++ ) {
			var copy = {};
			var row = res.rows.item(i);
			for ( var key in row ) if ( row.hasOwnProperty(key) )
				copy[key] = row[key];
			rows.push(copy); // This creates a clone of the row object, since it was previously immutable
		}
		
		// Get some information about the query
		
		// Fetching insertId when not present throws an exception.
		var insertId = false;
		try { insertId = res.insertId; } catch (e) {}
		
		var meta = {
			insertId: insertId,
			affectedRows: res.rowsAffected
		};
		
		callback(rows, meta);
	},
	
	makeTable: function(name, primaryKey, schema, callback) {
		primaryKey = primaryKey || 'id';
		
		var query = 'CREATE TABLE IF NOT EXISTS `' + name + '`';
		var args = [];
		
		// Build fields
		var fields = [];
		
		// Add id column
		fields.push("`" + primaryKey + "` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT");
		
		// Run through schema
		for ( var field in schema ) if ( schema.hasOwnProperty(field) )
			fields.push(this.makeColumnDefinition(field, schema[field]));
		
		query += ' (' + fields.join(',\n') + ')';
		
		this.executeQuery({
			sql: query,
			args: args
		}, callback);
	},
	
	makeColumnDefinition: function(field, params) {
		var typeTranslationTable = {
			"int": "integer",
			"float": "real",
			"text": "text"
		};
		
		var paramQuery = '`' + field + '` ';
			
		// Specified type
		paramQuery += ' ' + typeTranslationTable[params.type];
			
		// Default value
		if ( typeof params.standard !== 'undefined' ) {
			paramQuery += ' DEFAULT ' + this._escapeDefaultValue(params.standard);
		}
			
		// Is mandatory
		paramQuery += ' ' + (typeof params.mandatory === 'undefined' || params.mandatory ? 'NOT NULL' : '');
		
		return paramQuery;
	},
	
	addIndex: function(table, column, callback) {
		this.executeQuery({
			sql: 'CREATE INDEX IF NOT EXISTS `' + column + '` ON `' + table + '` (`' + column + '`)',
			args: []
		}, callback);
	},
	
	addField: function(table, fieldName, fieldData, callback) {
		var query = "ALTER TABLE `" + table + "` ADD COLUMN ";
		query += this.makeColumnDefinition(fieldName, fieldData);
		
		this.executeQuery({
			sql: query,
			args: []
		}, callback);
	},
	
	dropTable: function(name, callback) {
		this.executeQuery({
			sql: 'DROP TABLE IF EXISTS `' + name + '`',
			args: []
		}, callback);
	},
	
	tableExists: function(name, callback) {
		this.executeQuery({
			sql: 'SELECT * FROM `' + name + '` LIMIT 1',
			args: []
		}, function() {
			dbLog("===== %s %s", name, this.isError ? "didn't exist" : "did exist");
			callback(!this.isError);
		}.bind(this));
	},
	
	buildFind: function(table, primaryKey, where, how) {
		return this.buildSelect(table, primaryKey, where, how, '*');
	},
	
	buildSelect: function(table, primaryKey, where, how, select) {
		var query = 'SELECT ' + select + ' FROM `' + table + '`\n';
		var args = [];
		
		if ( where === "all" )
			where = {};
		
		// Build where
		var sqlWhere = this.buildWhere(where);
		query += sqlWhere.sql;
		
		sqlWhere.args.forEach(function(a) {
			args.push(a);
		});
		
		// Build order by
		if ( typeof how.by !== "undefined" ) {
			query += 'ORDER BY ';
			
			var bys = [];
			if ( typeof how.by === "string" )
				bys.push(how.by)
			else
				bys = how.by;
			
			bys.map(function(by) {
				var pieces = by.split(" ");
				var field = pieces[0];
				var order = pieces[1] || "asc";
			
				return "`" + field + "` " + order.toUpperCase();
			});
			
			query += bys.join(", ") + "\n";
		}
		
		// Build groupby
		
		if ( typeof how.groupby !== "undefined" ) {
			query += "GROUP BY ";
			
			query += how.groupby.map(function(table) {
				return "`" + table + "`";
			}).join(", ");
			
			query += "\n";
		}
		
		// Build limit
		if ( typeof how.limit !== "undefined" ) {
			query += 'LIMIT ';
			
			if ( how.limit.constructor === Array ) {
				query += '?, ?';
				args.push(how.limit[0]);
				args.push(how.limit[1]);
			} else {
				query += '?';
				args.push(how.limit);
			}
			query += '\n';
		}
		
		return {
			sql: query,
			args: args
		};
	},
	
	buildWhere: function(where) {
		var ws = []; 
		var args = [];
		
		for ( var key in where ) if ( where.hasOwnProperty(key) && typeof where[key] !== "undefined" ) {
			// Ensure values is an array so we can concatenate several with OR
			var values = where[key].constructor === Array ? where[key] : [where[key]];
			
			// Fetch field name and operand, defaulting to "="
			var pieces = key.split(" ");
			var field = pieces[0];
			var operand = (pieces[1] || "=").toUpperCase();
			
			var sqlWhere = '`' + field + '` ';
			
			if (operand === "IN" || operand === "NOT_IN") {
				operand = operand.replace(/NOT_/i, "NOT ");
				sqlWhere += operand + "(" + (new Array(values.length).join("?,")) + "?)";
				
				ws.push(sqlWhere);
				args = args.concat(values);
			} else {
				sqlWhere +=  operand + " ?";

				// Fill an array with the sqlWhere and add all values to args
				// Then we join them together with OR (so if there only is one item in the array,
				// it won't have an OR)
				var ors = [];
				for ( var i = 0, j = values.length; i < j; i++ ) {
					var val = values[i];
					ors.push(sqlWhere);
					args.push(val);
				}
				ws.push("(" + ors.join(" OR ") + ")");
			}
		}
		
		// Only add "WHERE" if there is anything to filter by
		
		return {
			sql: ws.length ? ('WHERE ' + ws.join(" AND ") + "\n") : '',
			args: args
		};
	},
	
	buildUpdate: function(table, primaryKey, what, where) {
		var query = 'UPDATE `' + table + '`\n';
		
		var sqlSet = this.buildSet(what);
		var args = sqlSet.args;
		query += sqlSet.sql;
		
		var sqlWhere = this.buildWhere(where);
		query += sqlWhere.sql;
		sqlWhere.args.forEach(function(a) {
			args.push(a);
		});
		
		return {
			sql: query,
			args: args
		};
	},
	
	buildSet: function(data) {
		var query = '';
		var fields = [];
		var args = [];
		
		for ( var key in data ) if ( data.hasOwnProperty(key) ) {
			fields.push('`' + key + '` = ?');
			args.push(data[key]);
		}
		
		if ( fields.length )
			query = 'SET ' + fields.join(", ") + '\n';
		
		return {
			sql: query,
			args: args
		};
	},
	
	buildInsert: function(table, primaryKey, object) {
		if ( ! object.schema )
			throw new Error(object + " has no schema. Is not DB object");
		
		var query = 'INSERT INTO `' + table + '`';
		var args = [];
		
		var fields = [];
		var params = [];
		
		// Build values
		for ( var key in object ) if (object.hasOwnProperty(key) && object.schema.hasOwnProperty(key) ) {
			fields.push('`' + key + '`');
			
			args.push(object[key]);
			params.push('?');
		}
		
		query += '(' + fields.join(", ") + ')\n';
		query += 'VALUES(' + params.join(", ")  + ')';
		
		return {
			sql: query,
			args: args
		};
	},
	
	buildDelete: function(table, primaryKey, where) {
		var query = 'DELETE FROM `' + table + '`\n';
		
		var sqlWhere = this.buildWhere(where);
		
		query += sqlWhere.sql;
		
		return {
			sql: query,
			args: sqlWhere.args
		};
	},
	
	buildCount: function(table, primaryKey, where, how) {
		var select = ['COUNT(*) AS total'];
		if (how.groupby) {
			select = select.concat(how.groupby)
		}
		return this.buildSelect(table, primaryKey, where, how, select.join(","));
	},
	
	/*
		Method:
			_escapeDefaultValue
		
		This method exists because binding the default value with ? caused the browser to crash.
		It crashed in: Chrome, Safari, Opera and mobile Safari.
	*/
	_escapeDefaultValue: function(val) {
		if ( typeof val === "number" )
			return '('+val+')';
		return '"' + val + '"';
	}
});
