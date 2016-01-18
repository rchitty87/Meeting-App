app.controller('LoginCtrl', function($scope, authenticationService, $location) {
	$scope.login = function() {
		if($scope.logInAsAdmin == false) {
			authenticationService.login($scope.name, $scope.password).then(function(data) {
				authenticationService.setPersonName($scope.personName);
				$location.path('/room/' + data.roomId);
				$('#userLogin').empty().append($scope.personName + ' <span class="glyphicon glyphicon-log-out"></span>');
			});
		}
		else {
			authenticationService.loginAsAdmin($scope.name, $scope.password).then(function(data) {
				authenticationService.setPersonName($scope.personName);
				$location.path('/room/' + data.roomId); 
				$('#userLogin').empty().append($scope.personName + ' <span class="glyphicon glyphicon-log-out"></span>');
			});
		}
	}
});
