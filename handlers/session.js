var dbHandler = require('../schema/db');
var sessionStore = dbHandler.sessionStore();
var logger = require('./logger');

var getSessionID = function() {
	return sessionKey;
}

var get = function(sessionKey, callback) {
	if (!sessionKey) {
		logger.error('session::get - no session id');
		callback(true, 0);
		return;
	}
	
	logger.log('session::get - session id - ', sessionKey);
	
	sessionStore.get(sessionKey, function (err, session) {
		if (err) {
			logger.error('session::get - error getting session for id - ', err);
			callback(true, 0);
			return;
		}
		
		logger.log('session::get - session - ', session);
		
		callback(false, session);
	});
}

var set = function(sessionKey, key, data, callback) {
	logger.log('session::set key - ', key, ', data - ', data);
	
	get(sessionKey,
		function (err, session) {
			if (err) {
				logger.error('session::setCallback - err - ', err);
				return;
			}
			
			if (session == undefined) {
				session = {};
			}
			
			logger.log('session::setCallback - session - ', session);
			session[key] = data;
			sessionStore.set(sessionKey, session);
		}
	);
}

var deleteKey = function(key, callback) {
	
}

var reset = function(user, callback) {
	
}

exports.get = get
exports.set = set
exports.deleteKey = deleteKey
exports.reset = reset
exports.getSessionID = getSessionID 
