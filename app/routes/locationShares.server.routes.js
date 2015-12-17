var users = require('../../app/controllers/users.server.controller'),
	locationShares = require('../../app/controllers/locationShares.server.controller');

module.exports = function(app) {
	// Location Share Routes
	app.route('/api/location-shares')
		.get(locationShares.list)
		.post(locationShares.create);

	app.route('/api/location-shares/:locationShareId')
		.get(locationShares.hasReadAuthorization, locationShares.read)
//		//.put(locationShares.hasModifyAuthorization, locationShares.update)
		.delete(locationShares.hasModifyAuthorization, locationShares.delete);

	app.param('locationShareId', locationShares.locationShareById);
};