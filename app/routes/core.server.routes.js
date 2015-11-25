module.exports = function(app) {
	// Route for root
	var core = require('../controllers/core.server.controller.js');
	app.get('/', core.index);
};