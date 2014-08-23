var logger = require('./handlers/logger');

function route(pathname) {
	logger.log("About to route a request for " + pathname);
}

exports.socketroute = route;
