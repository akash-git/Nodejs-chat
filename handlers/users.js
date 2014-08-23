var userSchema = require('../schema/user');
var socketHandler = require('./socket');
var sessionHandler = require('./session');
var loginHandler = require('./login');
var logger = require('./logger');

var sendUsers = function(socket) {
	logger.log('handlers.login.sendUsers: start');
	
	userSchema.getUsers(function(err, users) {
		sendUserCallback(err, users, socket);
	});
}

var sendUserCallback = function(err, users, socket) {
	logger.log('user.sendUserCallback: start ', err);
	
	if (err) {
		socket.emit('alert', 'Error getting users.');
		return;
	}
	
	var userObjs = [];
	
	for (i in users) {
		var user = users[i];
		var userObj = {email: user.email, id: user._id, available: user.login};
		
		userObjs[userObjs.length] = userObj;
	}
	
	socket.emit('users', {'users': userObjs});
}

var brodcastUser = function(user, active) {
	var userObjs = [];
	
	var userObj = {email: user.email, id: user._id, available: active};
	userObjs[userObjs.length] = userObj;

	socketHandler.broadcast('users', {'users': userObjs});
}

var checkConnection = function(socket) {
	var sessionKey = socket.handshake.sessionID;
	
	logger.log('checkConnection: cookie data - ', socket.handshake.sessionID);
	sessionHandler.get(sessionKey, function (err, session) {checkConnectionCallback(err, session, socket);});
}

var checkConnectionCallback = function(err, session, socket) {
	var sessionKey = socket.handshake.sessionID;
	
	if (session == undefined || session.loginUserID == undefined) {
		socket.emit('pageResponse', {responseCode: 1, error: 0, msg: 'Guest', status: 0});
		logger.log('session::get - session or session key not found for id - ', sessionKey);
		return;
	}
	
	socket.handshake.loginUserID = session.loginUserID;
	
	userSchema.getUser(session.loginUserID, function(err, user) {
												checkConnectionLoginCallback(err, user, socket, session);
											}
					);
}

var checkConnectionLoginCallback = function(err, user, socket, session) {
	loginHandler.loginCallback(user, socket, 'Member');
}

exports.sendUsers = sendUsers;
exports.brodcastUser = brodcastUser;
exports.checkConnection = checkConnection;
