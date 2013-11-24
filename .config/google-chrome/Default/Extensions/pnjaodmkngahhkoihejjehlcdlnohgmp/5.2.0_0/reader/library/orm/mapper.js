var Mapper = Class.extend({
	table: false,
	model: false,
	
	initialize: function(db) {
		this.db = db;
		this.modelName = this.model;
		this.model = window[this.model].prototype;
	},
	
	install: function(callback) {
		this.db.makeTable(this.table, this.model.primaryKey, this.model.schema, callback || function() {});
	},
	
	// Add a field using data from model schema
	addField: function(member, callback) {
		var memberData = this.model.schema[member];
		this.db.addField(this.table, member, memberData, callback || function() {});
	},
	
	addIndex: function(column, callback) {
		this.db.addIndex(this.table, column, callback || function() {});
	},
	
	find: function(where, how, callback) {
		// how is optional, so make sure it's an object, and if not, check if is callback
		if ( typeof how == 'function' && ! callback ) {
			callback = how;
			how = {};
		}
		var objectForRow = this.objectForRow;
		
		this.db.run('find', [this.table, this.model.primaryKey, where, how], function(res, meta) {
			// Process rows into Model objects
			var rows = [];
			if ( res ) {
				res.forEach(function(row) {
					rows.push(app.store.addObject(objectForRow(row)));
				});
			}
		
			// Fire callback with processed objects
			callback(rows, meta);
		});
	},
	
	massDelete: function(where, callback) {
		this.db.run('delete', [this.table, this.model.primaryKey, where], function() {
			fireCallback(callback);
		});
	},
	
	massUpdate: function(what, where, callback) {
		this.db.run('update', [this.table, this.model.primaryKey, what, where], function() {
			fireCallback(callback);
		});
	},
	
	save: function(model, callback) {
		var pk = this.model.primaryKey;
		
		if ( model[pk] ) {
			if ( ! model.isDirty() )
				return fireCallback(callback);
			
			var where = {};
			where[pk] = model[pk];
			
			this.db.run('update', [this.table, pk, model.getDirty(), where], function(res, meta) {
				app.store.addObject(model);
				model.fromDB = model.getValues();
				fireCallback(callback, res, meta);
			});
		} else
			this.db.run('insert', [this.table, pk, model], function(res, meta) {
				model[pk] = meta.insertId;
				model.fromDB = model.getValues();
				app.store.addObject(model);
				fireCallback(callback, res, meta);
			});
	},
	
	remove: function(model, callback) {
		if ( ! model[this.model.primaryKey] )
			throw "Remove object must have " + this.model.primaryKey;
		
		var where = {};
		where[this.model.primaryKey] = model[this.model.primaryKey];
		
		this.db.run('delete', [this.table, this.model.primaryKey, where], callback);
	},
	
	count: function(where, how, callback) {
		// how is optional, so make sure it's an object, and if not, check if is callback
		if ( typeof how == 'function' && ! callback ) {
			callback = how;
			how = {};
		}

		this.db.run('count', [this.table, this.model.primaryKey, where, how], function(res, meta) {
			var ret = 0;
			if (res[0] && Object.keys(res[0]).length == 2) {
				ret = {};
				for (var i = 0, r; r = res[i]; i++) {
					var idKey = Object.keys(r).filter(function(field) { return field.contains("id"); })[0];
					ret[r[idKey]] = r.total;
				}
			} else if (res[0]) {
				ret = res[0].total;
			}
			fireCallback(callback, ret);
		});
	},
	
	objectForRow: function(row) {
		var obj = new window[this.modelName]();
		obj.setFromDB(row);
		return obj;
	}
});

Mapper.instances = {};

Mapper.get = function(name) {
	if ( ! Mapper.instances[name] ) {
		var className = name.replace(/^\w/, function(a) { return a.toUpperCase();}) + 'Mapper';
		Mapper.instances[name] = new window[className](Database.current);
	}
	return Mapper.instances[name];
};

Mapper.switchDatabase = function(db) {
	for ( var key in Mapper.instances ) if (Mapper.instances.hasOwnProperty(key)) {
		Mapper.instances[key].db = db;
	}
}