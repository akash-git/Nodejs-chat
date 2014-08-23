var mongoose = require('mongoose');
var Schema = mongoose.Schema , ObjectId = Schema.ObjectId;
var db = require('./db');
var logger = require('../handlers/logger');
  
var User = new Schema({
	email		: { type: String},
	password   	: { type: String},
	login   	: { type: Number}
});

mongoose.model('User', User);

var getUsers = function(cb) {
	logger.log('user.getUsers: start');
	
	var criteria = {};
	
	mongoose.model('User').find(criteria, cb);
}

var getUserByID = function(id, cb) {
	logger.log('user.getUserByID: ', id);
	
	var connection = db.connection();
	
	mongoose.model('User').findOne({ _id: id }, cb);
}

var getUserByEmail = function(emailID, cb) {
	logger.log('user.getUserByEmail: ', emailID);
	
	var connection = db.connection();
	
	mongoose.model('User').findOne({ email: emailID }, cb);
}

var saveUser = function(email, password, callback) {
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
