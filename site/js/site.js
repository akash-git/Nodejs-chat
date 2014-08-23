var SocketClient = {
	socket: null,
	connectionStatus: false,
	
	createConnection: function() {
		SocketClient.socket = io.connect($('.body').attr('data-ws'));
	},
	
	initiate: function () {
		SocketClient.createConnection();
	
		SocketClient.socket.on('login', function (data) {
			User.handleLogin(data);
		});
		
		SocketClient.socket.on('logout', function (data) {
			User.handleLogout(data);
		});

		
		SocketClient.socket.on('disconnectMessage', function (data) {
			SocketClient.connectionStatus = false;
		});
		
		SocketClient.socket.on('connectMessage', function (data) {
			SocketClient.connectionStatus = true;
		});
		
		SocketClient.socket.on('users', function (data) {
			User.handleUsers(data.users);
		});
		
		SocketClient.socket.on('alert', function (data) {
			alert(data);
		});

		SocketClient.socket.on('message', function (data) {
			ChatWindow.handleMessage(data);
		});
		
		SocketClient.socket.on('loginresponse', function (data) {
			console.log(data);
		});
		
		SocketClient.socket.on('pageResponse', function (data) {
			if (data.error == 0 && data.responseCode == 1) {
				if (data.status == 0) {
					Page.showLogin();
				}
			}
		});
	},
	
	send: function(event, data) {
		SocketClient.socket.emit(event, data);
	}
}



var User = {
	
	login: function () {
		var loginForm = $('#loginform');
		var name = $('#name').val();
		var password = $('#password').val();
		
		if (name == '') {
			$('.message', loginForm).html('Enter email').show();
			return false;
		}
		
		
		if (password == '') {
			$('.message', loginForm).html('Enter password').show();
			return false;
		}
		
		var data = {'name': name, 'password': password};
		
		SocketClient.send('login', data);
		
	},
	
	handleUsers: function(users) {
		var obj = $('.user', $('.holders'));
		
		var userContainer = $('.users');
		
		for (i in users) {
			var user = users[i];
			
			var id = user.id;
			var name = user.email;
			var active = user.available;
			
			var userObj = $('.user-' + id, userContainer);
			
			if (userObj.length > 0) {
			}
			else {
				userObj = obj.clone();
				userObj.addClass('user-' + id);
				
				$('.name', userObj).html(name);
				userObj.data('id', id);
				
				userObj.click(function() {
					ChatWindow.start(this);
				});
				
				userContainer.append(userObj);
			}
			
			if (active == 1) {
				userObj.addClass('active');
			}
			else {
				userObj.removeClass('active');
			}
		}
	},
	
	handleLogin: function(data) {
		if (data.responseCode != 1) {
			$('.message').html(data.msg).show();
			return;
		}
		
		$('.currentUser').html(data.name).attr('data-id', data.id);
		
		$('#loginform').hide();
		$('#wrapper').show();
		$('#loading').hide();
	},
	
	handleLogout: function(data) {
		if (data.responseCode != 1) {
			alert(data.msg);
			return;
		}
		
		$('.currentUser').html('').attr('data-id', 0);
		
		$('#loginform').show();
		$('#wrapper').hide();
		
	},
	
	
	getCurrentUserID: function() {
		return $('.currentUser').attr('data-id');
	},
	
	getUserName: function(id) {
		var userContainer = $('.users');
		var userObj = $('.user-' + id, userContainer);
		
		var name = $('.name', userObj).html();
		
		return name;
	},
	
	logout: function() {
		SocketClient.send('logout', {'id': User.getCurrentUserID()});
	}
	
}

var ChatWindow = {
	currentWindowUser: 0,
	
	start: function(obj) {
		var obj = $(obj);
		
		var email = $('.name', obj).html();
		var id = obj.data('id');
		
		$('.recieverUser').html(email).data('id', id);
		
		var chatObj = ChatWindow.setChatWindow(id);
		
		$('.userChatContainer', $('.chatContainer')).hide();
		chatObj.show();
		ChatWindow.currentWindowUser = id;
		$('.chatContainer').show();
		
		var userContainer = $('.users');
		var userObj = $('.user-' + id, userContainer);		
		var pendingMsg = $('.pendingMessage', userObj);
		$('.pending', pendingMsg).html(0);
		pendingMsg.hide();
	},
	
	setChatWindow: function(id) {
		var chatObj = $('.userChatContainer-' + id, $('#chatbox'));
		
		if (chatObj.length == 0) {
			chatObj = $('.userChatContainer', $('.holders')).clone();
			chatObj.addClass('userChatContainer-' + id);
			chatObj.hide();
			$('#chatbox').append(chatObj);
		}
		
		return chatObj;
	},
	
	sendMessage: function() {
		var data = {};
		data.sender = User.getCurrentUserID();
		data.reciever = ChatWindow.getReceieverUserID();
		data.msg = $('#usermsg').val();
		
		SocketClient.send('message', data);
		
		$('#usermsg').val('').focus();
	    return false;  
	},
	
	getReceieverUserID: function() {
		return $('.recieverUser').data('id');
	},
	
	handleMessage: function(message) {
		var sender = message.sender;
		var reciever = message.reciever;
		
		var otherUser = sender;
		
		if (sender == User.getCurrentUserID()) {
			otherUser = reciever;
		}
		
		var chatObj = ChatWindow.setChatWindow(otherUser);
		
		var name = User.getUserName(sender);
		
		var messageObj = $('.msg', $('.holders')).clone();
		
		$('.sender', messageObj).html(name);
		$('.message', messageObj).html(message.body);
		
		$('.userChats', chatObj).append(messageObj);
		
		if (otherUser != ChatWindow.currentWindowUser) {
			var userContainer = $('.users');
			var userObj = $('.user-' + otherUser, userContainer);
			
			var pendingMsg = $('.pendingMessage', userObj);
			
			var msgCount = $('.pending', pendingMsg);
			
			var no = parseInt(msgCount.html());
			no++;
			
			msgCount.html(no);
			pendingMsg.show();
			
		}
	}
	
}

var Page = {
	showLogin: function() {
		$('#loading').hide();
		$('#loginform').show();
		$('#wrapper').hide();
	}
}


$(document).ready(function(){  
	$('#enter').click(function() {
		User.login();
		return false;
	});
	
	// not final
	$("#exit").click(function(){  
		User.logout();
    }); 
	
	$("#submitmsg").click(function(){     
	    ChatWindow.sendMessage();
	}); 
	
	$('#usermsg').keydown(function(event){    
		if(event.keyCode==13){
		   ChatWindow.sendMessage();
		}
	});
	
}); 

SocketClient.initiate();
