var MigrationMapper = Mapper.extend({
	table: 'migrations',
	model: 'Migration',
	
	migrate: function(callback) {
		if ( Ext.isOnline()  || app.user.isPro())
			return callback();
		
		chain(this.getLatest)
		.then(this.compareVersions)
		.then(function(isUptoDate, next) {
			if ( isUptoDate ) {
				callback();
				return chain.exit;
			}
			next();
		})
		.and(this.runMigrations)
		.end(callback);
	},
	
	getLatest: function(callback) {
		var migrationMapper = this;
		
		this.find('all', {by: 'created desc'}, function(res) {
			migrationMapper.latestVersion = res[0];
			callback(res[0]);
		});
	},
	
	compareVersions: function(version, callback) {
		// No latest version? Then there is stuff to be run
		if ( ! version )
			return callback(false);
		// This is determined if there exists a migration version which is current_version+1
		// So to trigger an upgrade you simply have to add an object to Migration.migrations
		return callback(!Migration.migrations[version.version+1]);
	},
	
	runMigrations: function(callback) {
		var toRunVersion;
		if ( ! this.latestVersion )
			toRunVersion = 1;
		else
			toRunVersion = this.latestVersion.version+1;
		
		var link = chain();
		while ( Migration.migrations[toRunVersion] ) {
			link.and(this.runMigration, toRunVersion);
			toRunVersion++;
		}
		link.end(callback);
	},
	
	runMigration: function(version, callback) {
		var migrationFunction = Migration.migrations[version];
		
		migrationFunction.call({
			postMapper: Mapper.get('post'),
			feedMapper: Mapper.get('feed'),
			folderMapper: Mapper.get('folder')
		}, function() {
			var migration = new Migration();
			migration.version = version;
			migration.created = Date.now();
			
			chain(migration.save)
			.end(callback);
		});
	}
});
