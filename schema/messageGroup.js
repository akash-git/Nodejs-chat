var mongoose = require('mongoose');
var Schema = mongoose.Schema , ObjectId = Schema.ObjectId;
  
var messageGroup = new Schema({
	users		: { type: [User] },
	users		: { type: [User] },
	startdate   : { type: Date },
	enddate   	: { type: Date },
	active		: { type: Number}
});
