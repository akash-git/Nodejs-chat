var messageHandler = require('./handlers/message');
var loginHandler = require('./handlers/login');
var socketHandler = require('./handlers/socket');
var sessionHandler = require('./handlers/session');
var dbHandler = require('./schema/db');
var logger = require('./handlers/logger');

function socketstart(route) {
	var express = require('express');
	var app = express();
	var server = require('http').createServer(app);
	var io = require('socket.io');	
	var cookie = require("cookie");
	var connect = require("connect");

	io = io.listen(server)
	io.set('authorization', function (handshakeData, accept) {
		if (handshakeData.headers.cookie) {
			handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);

			handshakeData.sessionID = connect.utils.parseSignedCookie(handshakeData.cookie['express.sid'], 'secret');
			
			logger.trace('handshakeData.sessionID - ', handshakeData.sessionID);

			if (handshakeData.cookie['express.sid'] == handshakeData.sessionID) {
				logger.warn('io.authorization - Cookie is invalid');
				return accept('Cookie is invalid.', false);
			}

		} else {
			logger.trace('io.authorization - No cookie transmitted');
			return accept('No cookie transmitted.', false);
		} 
		
		logger.trace('io.authorization - Cookie is correct');

		accept(null, true);
	});

	app.get('/', function (req, res) {
	  res.sendfile(__dirname + '/site/index.html');
	});
	
	app.configure(function () {
		app.use(express.static(__dirname + '/site'));
		app.use(express.cookieParser());
		app.use(express.session({
									secret: 'secret', key: 'express.sid',
									store: dbHandler.sessionStore(),
								}
								));
	})

	socketHandler.initiate(io);
	
	io.sockets.on('connection', function (socket) {
		logger.trace('connection: handshake session id - ', socket.handshake.sessionID);
		
		var usersHandler = require('./handlers/users');
		usersHandler.checkConnection(socket);
		
		socket.on('login', function (userData) {
			logger.trace('Login: ', userData);
			loginHandler.login(userData.name, userData.password, socket);
		});
		
		socket.on('logout', function (userData) {
			logger.trace('logout: ', userData);
			loginHandler.logout(userData.id);
		});
		
		socket.on('message', function (data) {
			messageHandler.handleMessage(data.sender, data.reciever, data.msg);
		});

		socket.on('disconnect', function () {
			socket.emit('disconnectMessage', 1);
		});
		
		socket.emit('connectMessage', 1);
	});

	server.listen(8080);
	
	logger.log("Server has started.");
}

exports.socketstart = socketstart;
