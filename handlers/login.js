var userSchema = require('../schema/user');
var sendUserHandler = require('./users');
var socketHandler = require('./socket');
var sessionHandler = require('./session');
var logger = require('./logger');

var saveUserCallback = function(err, userObj, socket) {
	if (err) {
		logger.error('login.saveUserCallback: err - ', err);
		socket.emit('login', {responseCode: 0, error: 1, msg: 'Error saving user.'});
		return;
	}
	
	logger.log('login.saveUserCallback: user - ', userObj);
	loginHandler(userObj, socket, 'User saved.');
	
}

var getUserCallback = function(err, email, password, user, socket) {
	if (err) {
		logger.error('login.getUserCallback: err - ', err);
		socket.emit('login', {responseCode: 0, error: 1, msg: 'Error on get user.'});
		return;
	}
	
	
	if (user != null) {
		if (password != user.password) {
			socket.emit('login', {responseCode: 0, error: 0, msg: 'Wrong email and password.'});
			return;
		}
		
		loginHandler(user, socket, 'User login.');
		return;
	}
	
	logger.log('user.getUserCallback: user - ', user);
	
	
	userSchema.saveUser(email, password, function(user, err) {
		saveUserCallback(err, user, socket);
	});
}

var handleLogin = function(email, password, socket) {
	var userObj = userSchema.getUserByEmail(email, function (err, user) {
		getUserCallback(err, email, password, user, socket);
	});
}

var handleLogout = function(userID) {
	logger.log('user.handleLogout: start - ', userID);
	var userObj = userSchema.getUser(userID, function (err, user) {
		logoutCallback(err, user);
	});
}

var logoutCallback = function(err, user) {
	logger.log('user.logoutCallback: start - ', user);
	if (err) {
		socketHandler.emit(user._id, 'logout', {responseCode: 0, error: 1, msg: 'Logout unsuccessful.'});
	}
	
	socketHandler.emit(user._id, 'logout', {responseCode: 1, error: 0, msg: 'Logout successful.'});
	
	socketHandler.releaseUserSocket(user._id);
	
	sendUserHandler.brodcastUser(user, 0);
}

var loginHandler = function(userObj, socket, message) {
	userObj.login = 1;
	
	userObj.save(function (err) {
		
	});
	
	
	socket.handshake.loginUserID = userObj._id;
	sendUserHandler.brodcastUser(userObj, 1);
	socketHandler.userSocket(userObj._id, socket);
	socket.emit('login', {responseCode: 1, error: 0, msg: message, id: userObj._id, name: userObj.email, available: 1});

	sendUserHandler.sendUsers(socket);
	
	var sessionKey = socket.handshake.sessionID;
	
	var sessionHandler = require('./session');
	sessionHandler.set(sessionKey, 'loginUserID', userObj._id);	
}

exports.login = handleLogin
exports.logout = handleLogout
exports.loginCallback = loginHandler
