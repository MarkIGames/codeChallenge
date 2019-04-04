module.exports = {

	noDetails(request, response) {
		response.sendStatus(405);
	},

	authenticateRequest(request, response)  {
		// Start a promise
		return new Promise(function(resolve, reject) {
			let config = require('../../config/config.js');
			let jwt    = require('jsonwebtoken');
			var token = request.headers['x-access-token'];

			if (!token) {
				resolve(false);
				return response.status(401).send({ auth: false, message: 'No token provided.' });
			}
			
			jwt.verify(token, config.environment.secret, function(error, decoded) {

				if (error) {
					resolve(false);
					return response.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
				} else {
					resolve(decoded);
				}
			});
		});
	},
		
}