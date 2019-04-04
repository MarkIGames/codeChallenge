 class mongoCrudOperator {
	
	constructor( config, collection, object, query ) {
		// Setup a URL for the DB 'bambeeTasks'
		const url = "mongodb://" + config.database.host + ":" + config.database.port + "/" + config.database.name;
		
		// Setup MongoClient
		let mongoClient = {};
		
		// Setup operational vars
		if(collection && object) {
			let collection = collection;
			let object     = object;
		} else {
			throw "Not enough Data to perfom CRUD Operations";
		}
		
		if(query) {
			let query      = query;
		}
	}
	

	
	initalizeClient() {
		// Require the Mongo Client for Connecting to the DB
		this.mongoClient = require('mongodb').MongoClient;
	} 
	
	create() {
		this.mongoClient.connect(url, function(error, database) {
			if (error) throw error;
			
			var databaseObject = database.db(config.database.name);

			database.collection(this.collection).insertOne(this.dataObject, function(error, response) {
				if (error) throw error;
		
				db.close();
			});
		});
	}
	
	request() {
		this.mongoClient.connect(url, function(error, database) {
			if (error) throw error;
			
			var databaseObject = database.db(config.database.name);

			database.collection(this.collection).find(query).toArray(function(error, response) {
				if (error) throw error;
		
				db.close();
			});
		});
	}
	
	replace() {
		// Call Delete on Query
		// Call create on Object
	}
	
	update() {
		this.mongoClient.connect(url, function(error, database) {
			if (error) throw error;
			
			var databaseObject = database.db(config.database.name);

			database.collection(this.collection).updateOne(myquery, newvalues, function(error, response) {
				if (error) throw error;
		
				db.close();
			});
		});		
	}
	
	create() {
		this.mongoClient.connect(url, function(error, database) {
			if (error) throw error;
			
			var databaseObject = database.db(config.database.name);

			database.collection(this.collection).deleteOne(this.dataObject, function(error, response) {
				if (error) throw error;
		
				db.close();
			});
		});
	}
	
}
 
 module.exports = mongoCrudOperator;