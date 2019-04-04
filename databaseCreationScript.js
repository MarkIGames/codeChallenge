"use strict";

/** NOTE: 
 * 
 * This file currently gives no output, and that should probably be updated so
 * there is visual feedback that the tasks are done. Just wasn't important for
 * a first version rough pass.
 * 
 * -Mark, 4/3/19
 */

// Require our configuration file
const config = require('./config/config');

// Require the Mongo Client for Connecting to the DB
const mongoClient = require('mongodb').MongoClient;
// Setup a URL for the DB 'bambeeTasks'
const url = "mongodb://" + config.database.host + ":" + config.database.port + "/" + config.database.name;

// Connect with the Mongo Client
mongoClient.connect(url, { useNewUrlParser: true }, buildDatabaseAndCollections);


/** buildDatabaseAndCollections()
 * 
 * This function will build out our database (by attempting to connect to it, 
 * which creates it if it doesn't already exist.
 * 
 * It will then call three events asyncronisly to ensure the proper collections
 * are created for us, before closing the connection. 
 * 
 * @param error
 * @param database
 */
async function buildDatabaseAndCollections(error, database) {
	// If we have an error...
	if (error) {
		// Log it
		console.log('database error: ', error);
	// Otherwise...
	} else {
		// Setup a database object
		let databaseObject = database.db(config.database.name);
		// Call our creation events asyncronishly
		try {
			await createCollection( databaseObject, 'users' );
			await createCollection( databaseObject, 'tasks' );
			// await createCollection( databaseObject, 'authentication' ); // Creating a seperate JWT Database so we can log history of user tokens
		} catch (creationError) {
			console.log("Unhandled Error in Collection Creation Run", creationError);
		}
		// Once they've finished, close the DB.
		database.close();
	}
}

/** createCollection()
 * 
 * This function will wrap our database collection in a promise, so we can
 * resolve the collection creation in order, and make sure it completes before
 * calling database.close().
 * 
 * Without the promises database.close() may run before we finish processing
 * all our creates.
 * 
 * 
 * @param databaseObject
 * @param collectionName
 */
function createCollection( databaseObject, collectionName ) {
	return new Promise(function(resolve, reject) {
		// Create a collection to store users
		databaseObject.createCollection(collectionName, function(error, response) {
			// If we have an error...
			if (error) {
				// Reject the promise
				reject('Error creating ' + collectionName);
			// Otherwise...
			} else {
				// Resolve as succesfully created
				resolve('Created collection ' + collectionName);
			}
		});
	});
} 