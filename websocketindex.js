var server = require("./websocketserver");
var router = require("./websocketrouter");

server.socketstart(router.socketroute);
