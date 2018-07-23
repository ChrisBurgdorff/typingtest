var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http){
	
	//Initialize
	$scope.intro = true;
	$scope.main = false;
	$scope.tutorial = false;
	$scope.recordNumber = 1;
	$("#newImage").prop('disabled', true);
	
	$scope.createApplicant = function() {
		var applicant;
		applicant.name = $scope.applicantName;
		applicant.email = $scope.applicantEmail;
		applicant.phone = $scope.applicantPhone;		
		$http.post('/applicant', applicant).then(function(response){
			$scope.intro = false;
			$scope.tutorial = true;
		});
	};
	
	$scope.submitRecord = function() {
		$('button').prop('disabled', true);
		var record;
		record.checkNumber = $scope.checkNumber;
		record.docDate = $scope.docDate;
		record.amount = $scope.amount;
		record.payee = $scope.payee;
		record.payor = $scope.payor;
		record.payorSignature = $scope.payorSignature;
		record.checkMemo = $scope.checkMemo;
		record.endorsement = $scope.endorsement;
		record.endorsementBank = $scope.endorsementBank;
		record.transactionDate = $scope.transactionDate;
		record.email = $scope.applicantEmail;
		record.recordNumber = $scope.recordNumber;
		$http.post('/record', record).then(function(response) {
			//ADD RESPONSE MESSAGE
			$scope.message = "Record submitted.";
			$('button').prop('disabled', false);
			$scope.checkNumber = "";
			$scope.docDate = "";
			$scope.amount = "";
			$scope.payee = "";
			$scope.payor = "";
			$scope.payorSignature = "";
			$scope.checkMemo = "";
			$scope.endorsement = "";
			$scope.endorsementBank = "";
			$scope.transactionDate = "";
		});
	};
	
	$scope.newImage = function() {
		//Disable new image button
		$("#newImage").prop('disabled', true);
		//Reset Response Message
		$scope.message = "";
		//Load Next Image
		
		//End if on last image
	};
	
}]);