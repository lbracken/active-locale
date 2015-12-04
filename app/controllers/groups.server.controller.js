var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Group = mongoose.model('Group');

/**
 * Create a group
 */
exports.create = function(req, res) {
	var group = new Group(req.body);
	group.owner = req.user;

	group.save(function(err) {
		if (err) { 
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Only return owner id, not full owner object
			group.owner = req.user.id;
			res.json(group);
		}
	});
};

/**
 * List of Groups
 */
exports.list = function(req, res) {
	// Only query for groups that belong to the current user
	var query = { 'owner': req.user.id };
	Group.find(query).sort('-created').exec(function(err, groups) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(groups);
		}
	});
};

/**
 * Group middleware for reading group from DB by Id
 */
exports.groupById = function(req, res, next, id) {
	Group.findById(id).exec(function(err, group){
		if (err) {

			// If the error is that the user provided an invalid
			// group id, then return a 400 bad request status.
			if (err.name === "CastError" && err.kind === "ObjectId") {
				return res.status(400).send({
					message: "Invalid Group Id"
				});
			}

			return next(err);
		}

		if (!group) {
			return res.status(404).send({
				message: "Group not found"
			});
		}

		req.group = group;
		next();
	});
};

/**
 * Show the current groups, assumes group has been
 * set in request by the groupById middleware.
 */
exports.read = function(req, res) {
	res.json(req.group);
};

/**
 * Update a group
 */
exports.update = function(req, res) {
	var group = req.group;

	group.name = req.body.name;
	group.email = req.body.email;
	group.sms = req.body.sms;
	group.updated = Date.now();

	group.save(function(err){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(group);
		}
	});
};

/**
 * Delete an group
 */
exports.delete = function(req, res) {
	var group = req.group;

	group.remove(function(err){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(group);
		}
	});
};

/**
 * Group authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.group.owner != req.user.id) {
		return res.status(403).send({
			message: "Not authorized for operation on group."
		});
	}

	next();
};