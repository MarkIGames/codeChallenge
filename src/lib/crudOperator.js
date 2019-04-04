 /** mongoCrudOperator()
  * 
  * This class is designed to be alightweight alternative to using a full
  * library (like Mongoose) and to avoid having to repeat functional code all
  * over the place when working with MongoDB.
  * 
  * Specifically, this choice was made after installing Mongo, Express, Jest, 
  * eslint, and jsonwebtoken bloated the project size to nearly 100 mb of data.
  * 
  * This class assumes operations in a single database, provided by the
  * config, but could easily be adjusted to operate with multiple databases
  * by modifying the config and the constructor.
  * 
  * Due to the fact that we are standing up a new instance of this everytime
  * a request comes in, there is an opportunity for optimization here by 
  * re-using an existing crud operator for each collection (because we have
  * a known, finite amount). I didn't want to get into premature
  * optimization here, though.
  * 
  * My lack of familarity with Mongo means I am unsure of the exact memory
  * and processing costs of repeatedly calling connect and database.close
  * but I suspect there are additional performance improvements to be gained
  * here. 
  * 
  * As this wasn't the primary point of the exercise, I didn't bother.
  * 
  */
 class mongoCrudOperator {
	
	/** constructor()
	 * 
	 * This class is going to require accessing the DB, so we are going to need
	 * our config. We also want to give it a collection when we run it, so we 
	 * know where to apply whatever actions we are taking, a query (to find a 
	 * more specific item if necessary) and any details we might or might not 
	 * need to apply.
	 * 
	 * When working with actual classes, we e always dependency inject the 
	 * config file, to ensure the application is using the same one throughout.
	 * 
	 * @param {*} config 
	 * @param {*} collection 
	 * @param {*} object 
	 * @param {*} query 
	 */
	constructor( config, collection, object, query ) {
		// Setup a URL for the DB 'bambeeTasks'
		this.url = "mongodb://" + config.database.host + ":" + config.database.port + "/" + config.database.name;
		// Setup MongoClient
		this.mongoClient = {};
		// Setup config
		this.config = config;
		// Setup operational vars, these are required
		if(collection) {
			// Save our collection to a local value
			this.collection = collection;
		// Otherwise, we fail the update and throw an error
		} else {
			throw "Not enough Data to perfom CRUD Operations";
		}
		// If we have a query, which we may not
		if(query) {
			// Save the query to a local var.
			this.query = query;
		}
		// If we have a object, which we may not
		if(object) {
			// Save the object to a local var.
			this.object = object;
		}

		this.initalizeClient();
	}
	
	/** initalizeClient()
	 * 
	 * This function establishes our inital mongoDB client.
	 * 
	 */
	initalizeClient() {
		// Require the Mongo Client for Connecting to the DB
		this.mongoClient = require('mongodb').MongoClient;
	} 
	
	/** create()
	 * 
	 * 
	 * 
	 */
	create() {
		// Save our parent
		let parent = this;
		// Start a promise
		return new Promise(function(resolve, reject) {
			const ObjectId = require('mongodb').ObjectID

			// Open the Mongo Connection
			parent.mongoClient.connect(parent.url, function(error, client) {
				if (error) throw error;
				
				let databaseObject = client.db(parent.config.database.name);

				parent.object._id = ObjectId();

				databaseObject.collection(parent.collection).insertOne(parent.object, function(error, response) {
					if (error) {
						resolve(false);
					} else {
						resolve(true);
						client.close();
					}
				})
			});
		});
	}
	
	/** requestMany()
	 * 
	 * This currently only pulls back tasks for the currently logged in user.
	 * It is not equipped to support any kind of searching.
	 * 
	 */
	requestMany() {
		// Save our parent
		let parent = this;
		// Start a promise
		return new Promise(function(resolve, reject) {
			// Open the Mongo Connection
			parent.mongoClient.connect(parent.url, function(error, client) {
				if (error) throw error;

				let databaseObject = client.db(parent.config.database.name);

				databaseObject.collection(parent.collection).find(parent.query).toArray(function(error, results) {
					if (error) {
						resolve(false);
					} else {
						if(results !== null) {
							resolve(results);
						} else {
							resolve(false);
						}
					}
					client.close();
				});
			});
		});
	}
	
	/** requestOne()
	 * 
	 * This currently only supports pulling back by the ObjectId.
	 * 
	 * I am not that familar with ObjectId() so I made a decision to put that
	 * code here instead of in any of the services. I am unsure how MongoDB 
	 * would behave if that were called elsewhere.
	 * 
	 */
	requestOne() {
		// Save our parent
		let parent = this;
			// Start a promise
			return new Promise(function(resolve, reject) {
			// Open the Mongo Connection
			parent.mongoClient.connect(parent.url, function(error, client) {
				const ObjectId     = require('mongodb').ObjectID;
				if (error) throw error;
				
				let databaseObject = client.db(parent.config.database.name);

				parent.query = { "_id" : ObjectId(parent.query.id), "user" : parent.query.user};

				databaseObject.collection(parent.collection).findOne(parent.query, function(error, result) {

					if (error) {
						resolve(false);
					} else {
						if(result !== null) {
							resolve(result);
						} else {
							resolve(false);
						}
					}
					client.close();
				});
			});
		});
	}

	/** replace()
	 * 
	 * This function is not going to be implemented. For the purposes of this
	 * assignment we are going to treat put/patch as identical. 
	 * 
	 */
	replace() {
		// Call Delete on Query
		// Call create on Object
	}
	
	/** update()
	 * 
	 * This will not currently support bulk updates.
	 * 
	 * Just like delete it requires ID for updates.
	 * 
	 */
	update() {
		// Save our parent
		let parent = this;
		// Start a promise
		return new Promise(function(resolve, reject) {
			// Open the Mongo Connection
			parent.mongoClient.connect(parent.url, function(error, client) {
				const ObjectId     = require('mongodb').ObjectID;
				if (error) throw error;
				
				let databaseObject = client.db(parent.config.database.name);

				parent.query  = { "_id" : ObjectId(parent.query.id), "user" : parent.query.user};
				parent.object = {$set: parent.object};

				databaseObject.collection(parent.collection).updateOne(parent.query, parent.object, function(error, result) {

					if (error) {
						resolve(false);
					} else {
						if(result !== null) {
							resolve(result);
						} else {
							resolve(false);
						}
					}
					client.close();
				});
			});
		});
	}
	
	/** delete()
	 * 
	 * This does not currently support bulk deletes
	 * 
	 * Just like updates, it requires ID for deletes
	 * 
	 */
	delete() {
		// Save our parent
		let parent = this;
			// Start a promise
			return new Promise(function(resolve, reject) {
			// Open the Mongo Connection
			parent.mongoClient.connect(parent.url, function(error, client) {
				const ObjectId     = require('mongodb').ObjectID;
				if (error) throw error;
				
				let databaseObject = client.db(parent.config.database.name);

				parent.query = { "_id" : ObjectId(parent.query.id), "user" : parent.query.user};

				databaseObject.collection(parent.collection).deleteOne(parent.query, function(error, result) {

					if (error) {
						resolve(false);
					} else {
						if(result !== null) {
							resolve(result);
						} else {
							resolve(false);
						}
					}
					client.close();
				});
			});
		});
	}

}
 // Make sure we share, children.
 module.exports = mongoCrudOperator;