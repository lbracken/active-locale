// Define the runtime environment, default to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Declare module dependencies
var config = require('./config/config'),
	db = require('./config/mongoose')(),
	server = require('./config/express')();
	passport = require('./config/passport')();

// Start and expose the app
server.listen(config.port, function(){
	console.log('>>>>>> activeLocale started on port %d...', config.port);
});
module.exports = server;