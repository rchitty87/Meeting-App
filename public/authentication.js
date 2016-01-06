app.service('authenticationService', function($http, $q) {
	var loggedIn = false;
	var roomId = null;
	var admin = false;
	var personName = null;
	
	this.isLoggedIn = function() {
		return loggedIn;
	}
	
	this.getRoomId = function() {
		return roomId;
	}
	
	this.isAdmin = function() {
		return admin;
	}
	
	this.setPersonName = function(value) {
		personName = value;
	}
	
	this.getPersonName = function() {
		return personName;
	}
	
	this.login = function(details) {
		return $http.get('/EnterRoom/' + details).then(function(data) {			
			loggedIn = true;
			roomId = angular.copy(data.data._id);
			admin = false;
			
			return $q.when({roomId: roomId});
		}, function(error) {
			swal("Wrong Credentials", "Please enter valid credentials!", "error");
		});
	}
	
	this.loginAsAdmin = function(details) {
		$http.get('/EnterRoomAdmin/' + details).then(function(data){ 
			loggedIn = true;
			roomId = angular.copy(data.data._id);
			admin = true;		
			
			return $q.when({roomId: roomId});
		}, function(error) {
			swal("Wrong Credentials", "Please enter valid credentials!", "error");				
		});
	}
});