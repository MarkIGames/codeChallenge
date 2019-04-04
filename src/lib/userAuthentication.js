 class mongoCrudOperator {
	
	constructor( config, token, object, query ) {
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
	
}