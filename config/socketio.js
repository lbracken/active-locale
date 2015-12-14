var config = require('./config');

module.exports = function(server, io) {

	/*
	 * Intercept the socket.io handshake process. 
	 */ 
	io.use(function(socket, next){
		/* Nothing yet, could retrieve Express session here... */
		next();
	});

	io.on('connection', function(socket) {
		// Once a connection is established, pass control to the location controller
		require('../app/controllers/location.server.controller.js')(io, socket);
	});
};