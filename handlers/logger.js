var log4js = require('log4js');
log4js.clearAppenders()
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('../logs/test.log'), 'test');
var logger = log4js.getLogger('test');
logger.setLevel('TRACE');


function setMessage(arr) {
	var msg = '';
	for(var i=0; i<arr.length; i++) {
		if (arr[i] != null && arr[i] != undefined) {
			msg += arr[i].toString();
		}
	}

	return msg;
}

var trace = function () {
	msg = setMessage(arguments);
	logger.trace(msg);
};

var error = function () {
	msg = setMessage(arguments);
	logger.trace(msg);
};


exports.trace = trace;
exports.error = error;
exports.log = trace;
exports.warn = error;
exports.fatal = trace;
