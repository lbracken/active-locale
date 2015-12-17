var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	LocationShare = mongoose.model('LocationShare');

/**
 * Create a new Location Share
 */
exports.create = function(req, res) {
	var locationShare = new LocationShare(req.body);

	// If a user is logged in, use that user as the owner of the Location Share
	if (req.user) {
		locationShare.owner = req.user;

	} else {
		// TODO, support creation of shares by users that aren't logged in...
		return res.status(400).send({
			message: "Currently must be logged in to start a Location Share"
		});
	}

	locationShare.save(function(err) {
		if (err) { 
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Only return owner id, not full owner object
			locationShare.owner = req.user.id;
			res.json(locationShare);
		}
	});
};

/**
 * List of Location Shares
 */
exports.list = function(req, res) {

	// If not logged in, then no location sharing history is available
	if (!req.user) {
		res.json([]);
		return;
	}

	// Only query for location shares that belong to the current user
	var query = { 'owner': req.user.id };
	LocationShare.find(query).sort('-created').exec(function(err, locationShares) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(locationShares);
		}
	});
};


/**
 * Location Share middleware for reading location share from DB by id
 */
exports.locationShareById = function(req, res, next, id) {
	LocationShare.findById(id).exec(function(err, locationShare){
		if (err) {
			// If the error is that the user provided an invalid location
			// share id, then return a 400 bad request status.
			if (err.name === "CastError" && err.kind === "ObjectId") {
				return res.status(400).send({
					message: "Invalid Location Share Id"
				});
			}

			return next(err);
		}

		if (!locationShare) {
			return res.status(404).send({
				message: "Location Share not found"
			});
		}

		req.locationShare = locationShare;
		next();
	});
};

/**
 * Show the given Location Share, assumes Location Share has been set by the
 * locationShareById middleware.
 */
exports.read = function(req, res) {
	res.json(req.locationShare);
};

// TODO: Determine best way to do efficient updates (small changes like shared with
//	a new user, or update of location data...)

/**
 * Delete a Location Share
 */
exports.delete = function(req, res) {
	var locationShare = req.locationShare;

	// TODO: Should only closed Location Shares be deletable?  Otherwise
	// some mechanism to inform active users that the share is over should
	// get added.

	locationShare.remove(function(err){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(locationShare);
		}
	});
};

/**
 * Location Share read access authorization middleware
 */
exports.hasReadAuthorization = function(req, res, next) {

	// If the Location Share is closed, then only the owner has read access.
	// However, if the Location Share is still active then anyone has access
	// (assuming they know the unique URL/id).
	if (req.locationShare.closed) {
		if (!req.user || req.locationShare.owner != req.user.id) {
			return res.status(403).send({
				message: "Not authorized to access Location Share."
			});
		}
	}

	next();
};

/**
 * Location Share modify access (update or delete) authorization middleware
 */
exports.hasModifyAuthorization = function(req, res, next) {

	if (!req.user || req.locationShare.owner != req.user.id) {
		return res.status(403).send({
			message: "Not authorized to modify Location Share."
		});
	}

	next();
};