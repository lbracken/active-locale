
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/* TODO: Per the socket.io GitHub README and the code on master (as of Dec 11th)
 *       the following is the preferred way to get the list of clients in a room.
 *
 *       var io = require('socket.io')();
 *       io.of('/chat').in('general').clients(function(error, clients){
 *         if (error) throw error;
 *           console.log(clients); // => [Anw2LatarvGVVXEIAAAD]
 *       });
 *
 *       However, that's not implemented in the latest release (1.3.7).
 *       For now just track the users in a room outside of socket.io. 
 *       However, check if this can be removed in the next release.
 *       This wouldn't work if clustering.
 */
var usersInRoom = {};
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


var joinRoom = function(io, socket, room, username) {

	console.log('>> Joining Room...');
	console.log('  SocketId: ' + socket.id);
	console.log('  Username: ' + username);
	console.log('  Room:     ' + room);

	socket.join(room);
	socket.room = room;
	socket.username = username;

	if (!usersInRoom[room]) usersInRoom[room] = [];
	usersInRoom[room].push({
		username: username,
		socketId: socket.id  // For debugging only, remove this later (don't send to client)
	});

	usersInRoomUpdated(io, socket, room);
}

var leaveRoom = function(io, socket) {

	var room = socket.room;
	if (room) {
		console.log('>> Leaving Room...');
		console.log('  SocketId: ' + socket.id);
		console.log('  Username: ' + socket.username);
		console.log('  Room:     ' + room);

		var idx = 0;
		for (var i = 0; i < usersInRoom[room]; i++){
			if (usersInRoom[room][i].socketId == socket.id) {
				idx = i;
				break;
			}
		}
		console.log("&&&&" + idx);
		usersInRoom[room].splice(idx, 1);

		socket.leave(room);
		socket.room = null;
		socket.username = null;

		usersInRoomUpdated(io, socket, room);
	}
}

var usersInRoomUpdated = function(io, socket, room) {

	// Send a message to all users in the room with the lists of 
	// all users in the room. 
	console.log(usersInRoom[room]);
	io.to(room).emit('usersInRoomUpdated', usersInRoom[room]);
}


module.exports = function(io, socket) {

	/*
	 * User has joined a location sharing session (room).
	 */
	socket.on('joinRoom', function(msg){
		joinRoom(io, socket, msg.room, msg.username);
	});

	/*
	 * User has left a location sharing session (room). 
	 */
	socket.on('leaveRoom', function(){
		leaveRoom(io, socket);
	});

	/*
	 * User has updated their location
	 */
	// ...

	/*
	 * User has stopped sharing their location
	 */
	// ...


	socket.on('disconnect', function(){
		leaveRoom(io, socket);
	});
};