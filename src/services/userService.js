/** NOTE:
 * 
 * I made a deliberate decision not to put the handlers into their own files.
 * Normally I would have classed this for better handling, but Javascript and 
 * OOP aren't enough of a norm for me to feel entirely comfortable doing that.
 * 
 * I also skipped over password hashing, checking for dup users, and any kind
 * of validation here.
 * 
 */

module.exports = {
			
	async create(request, response) {
		let username = request.body.username;
		let password = request.body.password;

		if(username && password) {
			const crudOperator = require('../lib/crudOperator');
			const config       = require('../../config/config.js');

			let object = {"username" : username, "password" : password, "_id" : null};
			let userCrud = new crudOperator( config, 'users', object );

			let result = await userCrud.create();

			if(result) {
				response.writeHead( 200, 'User Added', {'content-type' : 'text/plain'});
				response.end( 'User Added' );
			} else {
				response.writeHead( 401, 'Failed to Add User', {'content-type' : 'text/plain'});
				response.end( 'Failed to Add User' );
			}
		} else {
			response.writeHead( 400, 'Missing Username or Password Value', {'content-type' : 'text/plain'});
			response.end( 'Missing Username or Password Value' );

			return;
		}
	},
	
	async login(request, response) {
		let username = request.body.username;
		let password = request.body.password;

		if(username && password) {
			const crudOperator = require('../lib/crudOperator');
			const config       = require('../../config/config.js');
			const jwt          = require('jsonwebtoken');

			let query = {"username" : username, "password" : password};

			let userCrud = new crudOperator( config, 'users', null, query);

			let result = await userCrud.requestOne();

			if(result !== false) {
				// create a token
				var token = jwt.sign({ id: result._id }, config.environment.secret, {
					expiresIn: 86400
				});

				response.writeHead( 200, 'Authenticated User', {'content-type' : 'text/plain', 'token' : token});
				response.end( 'Authenticated User' );

			} else {
				response.writeHead( 401, 'Failed to Authenticate: Bad Username or Password', {'content-type' : 'text/plain'});
				response.end( 'Failed to Authenticate: Bad Username or Password' );
			}		
		} else {
			response.writeHead( 400, 'Missing Username or Password Value', {'content-type' : 'text/plain'});
			response.end( 'Missing Username or Password Value' );

			return;
		}
	},
	
	/** NOTE:
	 * 
	 * The project requirements did not state a need for the following
	 * functions, so they have not been implemented. 
	 * 
	 * Normally this would be part 
	 * 
	 */

	/*
	authenticateRequest()  {
		let userAuthenticator = require('../lib/userAuthentication');
		
		let authenticated = userAuthenticator.authenticateUser();
		
		if(!authenticated) {
			response.send(403);
		}
		
	},

		requestMany() {
			
		},
		
		requestOne() {
			
		},
		
		replace(request, response) {

		},
		
		update(request, response) {

		},
		
		delete(request, response) {

		}
	*/

}