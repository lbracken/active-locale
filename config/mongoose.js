var config = require('./config'),
	mongoose = require('mongoose');

module.exports = function() {

	// Initiate connection to MongoDB
	var db = mongoose.connect(config.db, function(err) {
		if (err) {
			console.error(chalk.red('Could not connect to MongoDB!'));
			console.log(chalk.red(err));
		}
	});

	// Required Models
	require('../app/models/user.server.model.js');

	return db;
};