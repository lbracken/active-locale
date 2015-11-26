var users = require('../../app/controllers/users.server.controller'),
	passport = require('passport');

module.exports = function(app) {

	// Authentication API
	app.route('/auth/signup').post(users.signup);
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);

	// User Profile API
	app.route('/users/me').get(users.me);
	app.route('/users').put(users.update);

	// Finish by binding the user middleware
	app.param('userId', users.userByID);
};