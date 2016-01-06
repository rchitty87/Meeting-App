app.controller('LoginCtrl', function($scope, authenticationService, $location) {
	$scope.login = function() {
		var details = window.btoa($scope.name + ':' + $scope.password);
		if($scope.logInAsAdmin == false) {
			authenticationService.login(details).then(function(data) {
				authenticationService.setPersonName($scope.personName);
				$location.path('/room/' + data.roomId);
			});
		}
		else {
			authenticationService.loginAsAdmin(details).then(function(data) {
				authenticationService.setPersonName($scope.personName);
				$location.path('/room/' + data.roomId); 
			});
		}
	}
});
