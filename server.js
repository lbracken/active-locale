// Define the runtime environment, default to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Declare module dependencies
var config = require('./config/config'),
	db = require('./config/mongoose')(),
	app = require('./config/express')();
	passport = require('./config/passport')();

// Start and expose the app
app.listen(config.port);
module.exports = app;

console.log('>>>>>> activeLocale started on port ' + config.port + '...');