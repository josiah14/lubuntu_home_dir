var Model = Class.extend({
	schema: {},
	primaryKey: 'id',
	mapper: false,
	
	initialize: function(data) {
		this.model = this.mapper;
		this.mapper = Mapper.get(this.mapper);
		
		for ( var key in data ) if ( data.hasOwnProperty(key) && this.schema.hasOwnProperty(key) )
			this[key] = data[key];
		
		if ( typeof this.onInit === 'function' )
			this.onInit();
	},
	
	setFromDB: function(data) {
		this.fromDB = {};
		
		for ( var key in data ) if ( data.hasOwnProperty(key) && (this.schema.hasOwnProperty(key) || key !== 'id') )
			this.fromDB[key] = data[key];
		
		for ( var key in this.fromDB ) if ( this.fromDB.hasOwnProperty(key) )
			this[key] = this.fromDB[key];
		
		this.id = data.id;
	},
	
	save: function(callback) {
		return this.mapper.save(this, callback);
	},
	
	copyPropertiesFrom: function(model) {
		for ( var key in model ) if ( model.hasOwnProperty(key) && (this.schema.hasOwnProperty(key) || key === 'id') )
			this[key] = model[key];	
	},
	
	isDirty: function() {
		if ( ! this.fromDB )
			return true;
		
		for ( var key in this.fromDB ) if ( this.fromDB.hasOwnProperty(key) )
			if ( this.fromDB[key] != this[key] )
				return true;
		return false;
	},
	
	getDirty: function() {
		var dirty = {};
		for ( var key in this.fromDB ) if ( this.fromDB.hasOwnProperty(key) )
			if ( this.fromDB[key] != this[key] )
				dirty[key] = this[key];
		return dirty;
	},
	
	getValues: function() {
		var ret = {id: this.id};
		for ( var key in this.schema ) if ( this.schema.hasOwnProperty(key) )
			ret[key] = this[key];
		return ret;
	},
	
	setMeta: function(key, value, callback) {
		this.ensureMeta();
		
		this.parsedMeta[key] = value;
		this.meta = JSON.stringify(this.parsedMeta);
		
		chain(this.save)
		.end(callback);
	},
	
	getMeta: function(key) {
		this.ensureMeta()
		return this.parsedMeta[key];
	},
	
	removeMeta: function(key, callback) {
		this.ensureMeta();
		delete this.parsedMeta[key];
		this.meta = JSON.stringify(this.parsedMeta);
		
		chain(this.save)
		.end(callback);
	},
	
	ensureMeta: function() {
		if ( ! this.parsedMeta && this.meta )
			this.parsedMeta = JSON.parse(this.meta);
		if ( ! this.parsedMeta )
			this.parsedMeta = {};
	}
});
