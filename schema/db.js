var express = require('express');
var mongoose = require('mongoose');
var session_store = null;

mongoose.connect('mongodb://localhost/my_database1');

function getConnection() {	
	return mongoose.connection;
}

var sessionStore = function() {
	if (session_store != null) {
		return session_store;
	}
	
	var MongoStore = require('connect-mongo')(express);
	session_store = new MongoStore({
        host : 'localhost',
        db : 'session_db',
        collection : 'session',
        stringify : false
    })
	
	return session_store;
}

exports.connection = getConnection;
exports.sessionStore = sessionStore