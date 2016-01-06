var app = angular.module('meetingApp', ['ngAnimate', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'home.html'
  }).when('/registration', {
    templateUrl: 'registration.html',
    controller: 'RegistrationCtrl'
  }).when('/login', {
    templateUrl: 'login.html',
    controller: 'LoginCtrl'    
  }).when('/room/:roomId', {
    templateUrl: 'room.html',
    controller: 'RoomCtrl'
  }).otherwise('/');
}]);

app.run(function($rootScope, $location) {
  $rootScope.loggedIn = false;
  $rootScope.roomId = null;
  $rootScope.isAdmin = false;
  $rootScope.personName = null;
  
  $rootScope.$watch('loggedIn', function(newValue, oldValue) {
    if(newValue && !oldValue) {
      
    }
    else {
      
    }
  });
  
  $rootScope.$on('$routeChangeError', function() {
    $location.path('/');
  });
});
