Nodejs-chat
===========
<br>
I worked on Node.JS realtime chat app and thought to open the code in case somebody needs to integrate same for there own apps.<br>
This is very simple version of what I had developed for one of my esteem client that is used in SAAS based customer interaction tool.<br><br>

The architecture is simple.<br>
Users signin or signup for the app and get the users list who are signed up for the app.<br>
Users can send messages to any other user.<br><br>

I will be adding more features to the app if anybody request for the same.<br><br>

Directory structure:<br>
site/*<br>
schema/*<br>
websocketindex.js<br><br>

NPM Modules to install<br>
– express<br>
– socket.io<br>
– log4js<br>
– mongoose<br>
– connect-mongo<br>
<br>
install modules using following commands on *nix system:<br>
npm install express
<br><br>
npm install log4js
<br><br>
npm install mongo
<br><br>
npm install mongoose<br>
npm install socket.io<br>
npm install cookie<br>
npm install connect-mongo<br>
<br><br>
run server<br>
node websocketindex.js<br>
