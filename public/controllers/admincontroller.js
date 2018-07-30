var myApp = angular.module('myApp', []);

myApp.controller('AdminCtrl', ['$scope', '$http', function($scope, $http){
	
	function getApplicants() {
		//$scope.recordView = true;
		$scope.applicantView = true;
		$scope.recordView = false;
		$http({
			method: 'GET',
			url: '/applicant'
		}).then(function(response){
			$scope.applicantList = response;
		});
	}
	
	getApplicants();
	
	$scope.viewRecords = function(applicantId){
		$http({
			method: 'GET',
			url: '/record/' + applicantId
		}).then(function (response) {
			$scope.recordView = true;
			$scope.applicantView = false;
			$scope.recordList = response;
		});
	}
	
	$scope.backToApplicants = function() {
		$scope.recordView = false;
		$scope.applicantView = true;
	}
	
}]);