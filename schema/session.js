var mongoose = require('mongoose');
var Schema = mongoose.Schema , ObjectId = Schema.ObjectId;
var db = require('./db');
var logger = require('../handlers/logger');
  
var Session = new Schema({
	sess_id		: { type: String},
	user_id   	: { type: String},
	
});

mongoose.model('Session', Session);

var getSessionByID = function(id, cb) {
	logger.log('session.getSessionByID: ', id);
	
	var connection = db.connection();
	
	mongoose.model('Session').findOne({ sess_id: id }, cb);
}

var saveSession = function(id, userID, callback) {
	logger.log('user.saveUser: email - ', email, ', password - ', password);
	
	var UserClass = mongoose.model('User');
	
	var user = new UserClass();
	
	user.email = email;
	user.password = password;
	
	
	
	user.save(function (err) {
				callback(user, err);
			});
	
}

var getSchema = function() {
	var user = mongoose.model('User');
	
	return user;
}

exports.schema = getSchema;
exports.getUserByEmail = getUserByEmail;
exports.saveUser = saveUser;
exports.getUsers = getUsers
exports.getUser = getUserByID
