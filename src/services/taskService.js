module.exports = {
	
	async create(request, response) {
		const utilities  = require('../lib/utilities');
		const config     = require('../../config/config.js');
		const crudOperator = require('../lib/crudOperator');

		let authenticated = await utilities.authenticateRequest(request, response);
		
		// Basic validation, this needs to be better
		if(request.body.name && request.body.description && (request.body.status == 'New' || request.body.status == 'Completed') && request.body.dueDate && (authenticated !== false)) {

			let object = {
				"name"        : request.body.name,
				"description" : request.body.description,
				"status"      : request.body.status,
				"dueDate"     : request.body.dueDate,
				"user"        : authenticated.id
			}

			let userCrud = new crudOperator( config, 'tasks', object );

			let result = await userCrud.create();

			if(result !== false) {
				response.writeHead( 200, 'Task Added', {'content-type' : 'text/plain'});
				response.end( 'Task Added' );
			} else {
				response.writeHead( 401, 'Failed to Add Task', {'content-type' : 'text/plain'});
				response.end( 'Failed to Add Task' );
			}
		} else {
			/** NOTE:
			 * 
			 * Better system here if time, to build message and only call writehead/return once
			 * 
			 */
			if(!authenticated) {
				response.writeHead( 403, 'User Not Authenticated', {'content-type' : 'text/plain'});
				response.end( 'User Not Authenticated' );
				return;
			}
			if(!(request.body.status == 'New' || request.body.status == 'Completed')) {
				response.writeHead( 400, 'Invalid Status', {'content-type' : 'text/plain'});
				response.end( 'Invalid Status' );
				return;
			}
			if(!(request.body.status == 'New' || request.body.status == 'Completed')) {
				response.writeHead( 400, 'Invalid Status', {'content-type' : 'text/plain'});
				response.end( 'Invalid Status' );
				return;
			}
			// This needs better handling
			if(!(request.body.name && request.body.description && request.body.dueDate)) {
				response.writeHead( 400, 'Invalid Name, Description or DueDate', {'content-type' : 'text/plain'});
				response.end( 'Invalid Name, Description or DueDate' );
				return;
			}
		}
	},

	async requestMany(request, response) {
		const utilities    = require('../lib/utilities');
		const config       = require('../../config/config.js');
		const crudOperator = require('../lib/crudOperator');

		let authenticated = await utilities.authenticateRequest(request, response);

		// Basic validation, this needs to be better
		if(authenticated !== false) {

			let query = {"user" : authenticated.id};

			let userCrud = new crudOperator( config, 'tasks', null, query );

			let results = await userCrud.requestMany();

			if(results !== false) {
				response.writeHead( 200, 'Results Found', {'content-type' : 'application/json'});
				response.write(JSON.stringify(results));
				response.end();
			} else {
				response.writeHead( 401, 'Failed to Add Task', {'content-type' : 'text/plain'});
				response.end( 'Failed to Add Task' );
			}
		} else {
			/** NOTE:
			 * 
			 * Better system here if time, to build message and only call writehead/return once.
			 * 
			 * Also this could maybe live somewhere else so we have less code duping.
			 * 
			 */
			if(!(authenticated !== false)) {
				response.writeHead( 403, 'User Not Authenticated', {'content-type' : 'text/plain'});
				response.end( 'User Not Authenticated' );
				return;
			}
		}
	},
	
	async requestOne(request, response) {
		const utilities    = require('../lib/utilities');
		const config       = require('../../config/config.js');
		const crudOperator = require('../lib/crudOperator');

		let authenticated = await utilities.authenticateRequest(request, response);

		// Basic validation, this needs to be better
		if(authenticated !== false) {

			let query = { "id" : request.params.taskId, "user" :  authenticated.id};

			let userCrud = new crudOperator( config, 'tasks', null, query );

			let result = await userCrud.requestOne();

			if(result !== false) {
				response.writeHead( 200, 'Result Found', {'content-type' : 'application/json'});
				response.write(JSON.stringify(result));
				response.end();
			} else {
				// Bad error handling, this could show if there is an error, too
				response.writeHead( 401, 'No Results Found', {'content-type' : 'text/plain'});
				response.end( 'No Results Found' );
			}
		} else {
			/** NOTE:
			 * 
			 * Better system here if time, to build message and only call writehead/return once.
			 * 
			 * Also this could maybe live somewhere else so we have less code duping.
			 * 
			 */
			if(!(authenticated !== false)) {
				response.writeHead( 403, 'User Not Authenticated', {'content-type' : 'text/plain'});
				response.end( 'User Not Authenticated' );
				return;
			}
		}
	},
	
	/** update()
	 * 
	 * This is the ONE stupid case where I need to pass object AND query to my DB class...
	 * 
	 * @param {*} request 
	 * @param {*} response 
	 */
	async update(request, response) {
		const utilities    = require('../lib/utilities');
		const config       = require('../../config/config.js');
		const crudOperator = require('../lib/crudOperator');

		let authenticated = await utilities.authenticateRequest(request, response);

		// Basic validation, this needs to be better
		if(authenticated !== false) {

			let query = { "id" : request.params.taskId, "user" :  authenticated.id};

			let object = request.body;

			/*
			 * 
			 * If there is time, put these in an array so you can just manipulate the array for v1/v2
			 * 
			 */
			if(object.status && (object.status !== 'Completed')) {
				response.writeHead( 400, 'Invalid Status Type', {'content-type' : 'text/plain'});
				response.end( 'Invalid Status Type' );
			}

			let userCrud = new crudOperator( config, 'tasks', object, query );

			let result = await userCrud.update();

			if(result !== false) {
				response.writeHead( 200, 'Task Update', {'content-type' : 'application/json'});
				response.end('Task Updated');
			} else {
				response.writeHead( 401, 'Failed to Update Task', {'content-type' : 'text/plain'});
				response.end( 'Failed to Update Task' );
			}
		} else {
			/** NOTE:
			 * 
			 * Better system here if time, to build message and only call writehead/return once.
			 * 
			 * Also this could maybe live somewhere else so we have less code duping.
			 * 
			 */
			if(!(authenticated !== false)) {
				response.writeHead( 403, 'User Not Authenticated', {'content-type' : 'text/plain'});
				response.end( 'User Not Authenticated' );
				return;
			}
		}
	},
	
	async delete(request, response) {
		const utilities    = require('../lib/utilities');
		const config       = require('../../config/config.js');
		const crudOperator = require('../lib/crudOperator');

		let authenticated = await utilities.authenticateRequest(request, response);

		// Basic validation, this needs to be better
		if(authenticated !== false) {

			let query = { "id" : request.params.taskId, "user" :  authenticated.id};

			let userCrud = new crudOperator( config, 'tasks', null, query );

			let result = await userCrud.delete();

			if(result !== false) {
				response.writeHead( 200, 'Task Deleted', {'content-type' : 'application/json'});
				response.end('Task Deleted');
			} else {
				response.writeHead( 401, 'Failed to Delete Task', {'content-type' : 'text/plain'});
				response.end( 'Failed to Delete Task' );
			}
		} else {
			/** NOTE:
			 * 
			 * Better system here if time, to build message and only call writehead/return once.
			 * 
			 * Also this could maybe live somewhere else so we have less code duping.
			 * 
			 */
			if(!(authenticated !== false)) {
				response.writeHead( 403, 'User Not Authenticated', {'content-type' : 'text/plain'});
				response.end( 'User Not Authenticated' );
				return;
			}
		}
	}

}