var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/* 
 * Represents a Location Sharing session.  The value of 'closed' determines
 * if this is an active sharing session, or just a historical record.
 */
var LocationShareSchema = new Schema({

	owner: {
		type: Schema.ObjectId,
		ref: 'User'
	},

	// TODO: Add users that have viewed this location sharing session

	// TODO: Add location data for this session

	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now		
	},
	closed: {
		type: Date,
		default: null			
	}
});

mongoose.model('LocationShare', LocationShareSchema);