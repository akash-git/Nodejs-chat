Nodejs-chat
===========

I worked on Node.JS realtime chat app and thought to open the code in case somebody needs to integrate same for there own apps.
This is very simple version of what I had developed for one of my esteem client that is used in SAAS based customer interaction tool.

The architecture is simple.
Users signin or signup for the app and get the users list who are signed up for the app.
Users can send messages to any other user.

I will be adding more features to the app if anybody request for the same.

Directory structure:
site/*
schema/*
websocketindex.js

NPM Modules to install
– express
– socket.io
– log4js
– mongoose
– connect-mongo

install modules using following commands on *nix system:
npm install express
npm install log4js
npm install mongo
npm install mongoose
npm install socket.io
npm install cookie
npm install connect-mongo

run server
node websocketindex.js
