var mongoose = require('mongoose');
var Schema = mongoose.Schema , ObjectId = Schema.ObjectId;
var db = require('./db');
var logger = require('../handlers/logger');

var message = new Schema({
	sender    	: { type: String },
	reciever    : { type: String },
	body      	: { type: String },
	date      	: { type: Date, default: Date.now },
	sendTo		: { type: Number }
});

mongoose.model('Message', message);

var saveMessage = function(sender, reciever, body, callback) {
	logger.log('message.saveMessage: sender - ', sender, ', reciever - ', reciever, ', body - ', body);
	
	var MessageClass = mongoose.model('Message');
	
	var message = new MessageClass();
	
	message.sender = sender;
	message.reciever = reciever;
	message.body = body;
	
	
	message.save(function (err) {
				callback(message, err);
			});
	
}


var getSchema = function() {
	var message = mongoose.model('Message');
	
	return message;
}

exports.schema = getSchema;
exports.saveMessage = saveMessage;

