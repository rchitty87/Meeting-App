app.controller('RoomCtrl', function($scope, $http, $location, authenticationService) {
	var socket = io();
	var loadingDlg = null;
	
	$scope.joined = false;
	$scope.isWaiting = false;
	$scope.inRoom = false;
	
	//join
	socket.emit('join', { personName: authenticationService.getPersonName(), roomId: authenticationService.getRoomId(), isAdmin: authenticationService.isAdmin() });
	
	//joinRoom
	socket.on('joined', attemptJoinRoom);
	
	function attemptJoinRoom(data){
		$scope.joined = true;
		$scope.$apply();
		
		if(authenticationService.isAdmin()) {
			socket.emit('joinRoomAdmin',authenticationService.getRoomId());
		}
		else {
			socket.emit('joinRoom', authenticationService.getRoomId());
		}
	}
	
	//join Reply
	socket.on('entered', function(data){
		//close loading
		if(loadingDlg != null) {
			$('#loading-dialog').dialog('destroy');
			loadingDlg = null;
		}
		
		console.log('entered');
		$scope.isWaiting = false;
		$scope.inRoom = true;
		$scope.$apply();
	});
	
	socket.on('waitForSlot', function(data){
		$scope.isWaiting = true;
		$scope.$apply();
		
		//open loading
		loadingDlg = $('#loading-dialog').dialog({
			modal:true,
			resizable:false,
			draggable: false,
			open: function() {
				$('.ui-dialog-titlebar').hide();
			}
		});	
		
		$('#loading-msg').text('Waiting for open slot');
	});
	
	socket.on('waitForAdmin', function(data){
		$scope.isWaiting = true;
		$scope.$apply();
		
		//open loading
		loadingDlg = $('#loading-dialog').dialog({
		modal:true,
		resizable:false,
		draggable: false,
		open: function() {
				$('.ui-dialog-titlebar').hide();
			}
		});	
		
		$('#loading-msg').text('Waiting for admin to arrive');
	});
	
	socket.on('waitFinish', attemptJoinRoom);
	
	//kicked
	socket.on('kicked', function(data){
		//leave page
		swal("Room Closed", "Admin has left the room.");
		$location.path('/');
	});
	
	//closed
	socket.on('closed', function(data) {
		//leave page
		if(loadingDlg)
			$('#loading-msg').dialog('close');
			
		swal("Room Closed", "Admin has left the room.");
		$location.path('/');
	});
	
	//participants List
	socket.on('participantsList', function(data) {
		console.log(data);
		var eList = $('#participantsList');
		eList.empty();
		
		for(var i = 0; i< data.length; ++i)
		{
			eList.append('<li id="' + data[i].socketId + '">' + data[i].personName + '</li>');
		}
	});
	
	//new user
	socket.on('newParticipant', function(data){
		//data.personName
		//data.socketId
		var eList = $('#participantsList');
		eList.append('<li id="' + data.socketId + '">' + data.personName + '</li>');
	});
	
	//user left
	socket.on('participantLeft', function(data) {
		var eList = $('#participantsList');
		
		eList.children('li').each(function() {
			if($(this).attr('id') == data.socketId) {
				$(this).remove();
			}
		})
	});
	
	//rcv msg 
	socket.on('rcvChatInfo', function(msg){
		$('#divChatList').append('<p>' + msg + '</p>');
	});
	
	$('#txtInput').on('keydown', function(event) {
		if(event.keyCode == 13) {
			socket.emit('sendChatMsg', $('#txtInput').val());
			$('#divChatList').append('<p>Me : ' + $('#txtInput').val() + '</p>');
			$('#txtInput').val('');
		}
	});
	
	socket.on('rcvChatMsg', function(msg){
		//msg.socketId
		//msg.personName
		//msg.data
		$('#divChatList').append('<p>' + msg.personName + ' : ' + msg.data + '</p>');
	});
	
	//send msg
	function sendChatMsg(msg){
		socket.emit('sendChatMsg', msg);
	}
	
	//receive whisper	
	socket.on('rcvWhisper', function(data)  {
	});
	
	function sendWhisper(recepient, msg) {
		
	}
	
	$scope.$on('$destroy', function() {
		socket.disconnect();
		authenticationService.logout();
	});
});


$(window).resize(function() {
	if(loadingDlg)
		$('#loading-dialog').dialog({ position: { my: 'center', at: 'center', of: window } });
});