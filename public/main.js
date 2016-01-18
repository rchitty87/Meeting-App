var app = angular.module('meetingApp', ['ngAnimate', 'ngRoute']);

app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
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
  
  $httpProvider.interceptors.push('authenticationService');
  
}]);

app.run(function($rootScope, $location) {  
  $rootScope.$on('$routeChangeError', function() {
    $location.path('/');
  });
  
  $rootScope.$on('$routeChangeStart', function() {
    
  })
});
