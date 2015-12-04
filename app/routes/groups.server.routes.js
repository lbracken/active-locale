var users = require('../../app/controllers/users.server.controller'),
	groups = require('../../app/controllers/groups.server.controller');

module.exports = function(app) {
	// Group Routes
	app.route('/api/groups')
		.get(users.requiresLogin, groups.list)
		.post(users.requiresLogin, groups.create);

	app.route('/api/groups/:groupId')
		.get(groups.hasAuthorization, groups.read)
		.put(groups.hasAuthorization, groups.update)
		.delete(groups.hasAuthorization, groups.delete);

	// Finish by binding the group middleware
	// TODO: Would like to pass multiple middleware here, first
	//       `users.requiresLogin` to verify a user is logged in,
	//       then the call to `groupById`, however, app.param()
	//       only takes a single callback.  Need to figure out
	//       best solution here...
	app.param('groupId', groups.groupById);
};