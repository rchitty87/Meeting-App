app.controller('RegistrationCtrl', function($scope, $http) {
  $scope.submitReg = function() {
    var room = {
       name: $scope.name,
       adminPassword: $scope.adminPassword,
       password: $scope.password,
       maxParticipants: $scope.maxParticipants
    };    
    $http.post('/RegNewRoom', room).then(function(data) {
       location.hash = '#/';
    }, function(error) {
       swal("Invalid Data", "Please enter valid data!", "error");
    });
  }
});
