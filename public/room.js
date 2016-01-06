app.controller('RoomCtrl', function($scope, $http, authenticationService) {
	var socket = io.connect('http://localhost:8080');
	$scope.joined = false;
	$scope.isWaiting = false;
	$scope.inRoom = false;
	
	//join
	socket.emit('join', { personName: authenticationService.getPersonName(), roomId: authenticationService.getRoomId() });
	
	//joinRoom
	socket.on('joined', attemptJoinRoom);
	
	function attemptJoinRoom(data){
		$scope.joined = true;
		
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
		
		$scope.isWaiting = false;
		$scope.inRoom = true;
	});
	
	socket.on('waitForSlot', function(data){
		$scope.isWaiting = true;
		
		//open loading
	});
	
	socket.on('waitForAdmin', function(data){
		$scope.isWaiting = true;
		
		//open loading
	});
	
	socket.on('waitFinish', attemptJoinRoom);
	
	//kicked
	socket.on('kicked', function(data){
		//leave page
	});
	
	//closed
	socket.on('closed', function(data) {
		//leave page
	});
	
	//rcv msg 
	socket.on('rcvChatInfo', function(msg){
		
	});
	
	socket.on('rcvChatMsg', function(msg){
		
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
});
 