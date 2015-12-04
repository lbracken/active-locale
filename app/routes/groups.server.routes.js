var users = require('../../app/controllers/users.server.controller'),
	groups = require('../../app/controllers/groups.server.controller');

module.exports = function(app) {
	// Group Routes
	app.route('/api/groups*')
		.all(users.requiresLogin);

	app.route('/api/groups')
		.get(groups.list)
		.post(groups.create);

	app.route('/api/groups/:groupId')
		.all(groups.hasAuthorization)
		.get(groups.read)
		.put(groups.update)
		.delete(groups.delete);

	app.param('groupId', groups.groupById);
};