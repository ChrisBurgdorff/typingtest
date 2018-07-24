var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http){
	
	//Initialize
	numRecords = 8;
	$scope.intro = true;
	$scope.main = false;
	$scope.tutorial = false;
	$scope.end = false;
	$scope.recordNumber = 1;
	$("#newImage").prop('disabled', true);
	$("#mainImage").prop('src', '/images/' + $scope.recordNumber + '.jpg');
	$scope.message = "Record " + $scope.recordNumber + " of " + numRecords + ".";
	var userId = "";
	var totalTime;
	
	//Timer:
	function startTimer() {
		var start = new Date().getTime(),
			elapsed = '0.0';
		window.setInterval(function() {
			var minutes;
			var seconds;
			var time = new Date().getTime() - start;
			elapsed = Math.floor(time / 100) / 10;
			elapsed = Math.floor(elapsed);
			//if(Math.round(elapsed) == elapsed) { elapsed += '.0'; }
			//document.title = elapsed;
			if (elapsed >= 60) {
				minutes = Math.floor(elapsed / 60);
				seconds = elapsed % 60;
				if (seconds < 10) {
					seconds = "0" + seconds;
				}
				totalTime = minutes + ":" + seconds
			} else {
				totalTime = elapsed;
			}
			$("#timer").text("Elapsed Time: " + totalTime);
		}, 100);
	}
	
	//END of Test
	function endTest() {
		var updatedApplicant = {};
		updatedApplicant.elapsedTime = totalTime;
		updatedApplicant.accuracy = "90%";
		$http.put('/applicant/' + userId, updatedApplicant).then(function(response){
			$scope.end = true;
			$scope.main = false;
		});
	}
	
	$scope.createApplicant = function() {
		var applicant = {};
		applicant.name = $scope.applicantName;
		applicant.email = $scope.applicantEmail;
		applicant.phone = $scope.applicantPhone;		
		$http.post('/applicant', applicant).then(function(response){
			console.log(response);
			userId = response.data.ops[0]._id;
			$scope.intro = false;
			//Move after tutorial
			$scope.main = true;
			startTimer();
			alert(userId);
		});
	};
	
	$scope.submitRecord = function() {
		$('button').prop('disabled', true);
		var record = {};
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
			$("#newImage").prop('disabled', false);
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
			if ($scope.recordNumber == numRecords) {
				$('button').prop('disabled', true);
				endTest();
			}
		});
	};
	
	$scope.newImage = function() {
		//Disable new image button, enable submit
		$("#newImage").prop('disabled', true);
		$("#submitButton").prop('disabled', false);
		//Increment Record Number
		$scope.recordNumber++;		
		//End if on last image
		if ($scope.recordNumber > numRecords) {
			$('button').prop('disabled', true);
			endTest();
			//End
		} else {
			//Reset Response Message
			$scope.message = "Record " + $scope.recordNumber + " of " + numRecords + ".";
			//Load Next Image
			$("#mainImage").prop('src', '/images/' + $scope.recordNumber + '.jpg');
		}
	};
	
}]);