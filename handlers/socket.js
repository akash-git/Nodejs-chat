var logger = require('./logger');

var socketMaps = [];
var io = null;

var initiate = function(ioObj) {
	io = ioObj
}

var broadCast = function(event, data) {
	io.sockets.emit(event, data);
}

var mapUserSocket = function(user, socket) {
	var key = 'u' + user;
	
	socketMaps[key] = socket;
}

var sendUserMessage = function(user, event, data) {
	var socket = getUserSocket(user);
	
	if (socket == undefined || socket == null) {
		return false;
	}
	socket.emit(event, data);
	
	return true;
}

var getUserSocket = function(user) {
	var key = 'u' + user;
	
	return socketMaps[key];
}

var releaseUserSocket = function(user) {
	var key = 'u' + user;
	
	socketMaps[key] = null;
}

exports.userSocket = mapUserSocket
exports.getUserSocket = getUserSocket
exports.emit = sendUserMessage
exports.releaseUserSocket = releaseUserSocket
exports.initiate = initiate
exports.broadcast = broadCast
