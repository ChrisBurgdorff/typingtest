var myApp = angular.module('myApp', []);

myApp.controller('LoginCtrl', ['$scope', '$http', function($scope, $http){
	
  $scope.register = function() {
    var newUser = {
      username: $scope.username,
      password: $scope.password
    };
    $http.post('/register', newUser).then(function(){
      console.log("created");
    });
  };
  
  $scope.signIn = function() {
    console.log("in sign in function front end");
    var newUser = {
      username: $scope.username,
      password: $scope.password
    };
    $http.post('/login', newUser).then(function(data){
      console.log(data);
      window.location = data.redirectUrl;
    });
  };
	
}]);