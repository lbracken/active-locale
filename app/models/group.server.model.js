var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Define the Group Schema
//
// Groups are user defined contact lists of Email and SMS Addresses.
// They allow a user to easily share their location with a group of
// individuals.
var GroupSchema = new Schema({
	name: {
		type: String,
		trim: true,
		required: 'Group must have a name'
	},
	email: {
		type: String,	// TODO: In the future this should be an array of emails?
		trim: true,
		default: ''
	},
	sms: {
		type: String,	// TODO: In the future this should be an array of SMS addresses?
		trim: true,
		default: ''
	},	
	owner: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now		
	}
});

mongoose.model('Group', GroupSchema);