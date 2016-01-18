app.factory('authenticationService', function(authenticationHelper, $q, $window, $location) {
	var loggedIn = false;
	var roomId = null;
	var admin = false;
	var personName = null;
	
	return {
		isLoggedIn: function() {
			return loggedIn;
		},
		
		getRoomId: function() {
			return roomId;
		},
		
		isAdmin: function() {
			return admin;
		},
		
		setPersonName: function(value) {
			personName = value;
		},
		
		getPersonName: function() {
			return personName;
		},
		
		login: function(name, password) {
			var details = $window.btoa(name + ':' + password);
		
			return authenticationHelper.login(details).then(function(data) {			
				loggedIn = true;
				roomId = angular.copy(data.data._id);
				admin = false;
				
				return $q.when({roomId: roomId});
			}, function(error) {
				swal("Wrong Credentials", "Please enter valid credentials!", "error");
			});
		},
		
		loginAsAdmin: function(name, password) {
			var details = $window.btoa(name + ':' + password);
	
			return authenticationHelper.loginAsAdmin(details).then(function(data){ 
				loggedIn = true;
				roomId = angular.copy(data.data._id);
				admin = true;		
				
				return $q.when({roomId: roomId});
			}, function(error) {
				swal("Wrong Credentials", "Please enter valid credentials!", "error");				
			});
		},
		
		logout: function() {
			loggedIn = false;
			roomId = null;
			admin = false;
			personName = null;
			$('#userLogin').empty().append('<span class="glyphicon glyphicon-log-in"></span>');
		},	
		
		request: function(request) {
			if(request.url.match(/room/) && loggedIn == false) {
				$location.path('/login');
			}
			
			return request;		
		}
	}
});

app.service('authenticationHelper', function($injector) {
	this.login = function(details) {
		var http = $injector.get('$http');
		return http.get('/EnterRoom/' + details);
	}			
	
	this.loginAsAdmin = function(details) {
		var http = $injector.get('$http');
		return http.get('/EnterRoomAdmin/' + details);		
	}	
});