var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http){
	
	//Initialize
	numRecords = 10;
	$scope.intro = true;
	$scope.main = false;
	$scope.tutorial = false;
	$scope.end = false;
	$scope.recordNumber = 1;
	$("#newImage").prop('disabled', true);
	$("#mainImage").prop('src', '/images/' + $scope.recordNumber + '.jpg');
	$scope.message = "Record " + $scope.recordNumber + " of " + numRecords + ".";
	var masterRecords;
	var totalFieldsCorrect = 0;
	var totalFields = 0;
	var totalAccuracy;
	var userId = "";
	var totalTime;
	var tutorialSlide;
	var tutorialImages = ['checknumber.jpg', 'docdate.jpg', 'amount.jpg', 'payee.jpg', 'payor.jpg', 'payorsignature.jpg', 'checkmemo.jpg', 'endorsement.jpg'];
	var tutorialMessages = ['The Check Number is in the upper right corner.  In this case, it is "101".',
		'The Check Date is on the Date line.  It will always be in mm/dd/yyyy format. Please enter all digits, and forward slashes.  In this case, it is "05/24/2016".',
		'The Amount is written next to the dollar sign.  In this case it is "300.00".',
		'The Payee is on the Pay To The Order Of line.  In this case it is "ABC Corporation".',
		'The Payor is in the upper left corner.  In this case it is "Joe Smith".',
		'The Payor Signature is in the bottom right corner.  In this case it is also "Joe Smith".',
		'The Check Memo is in the bottom left corner.  In this case it is "Invoice".',
		'The Endorsement, Endorsement Bank, and Transaction Date are on the bottom half of the image.  The Endorsement is "ABC Corporation"; The Endorsement Bank is "Bank of America"; The Transaction Date is "05/30/2016".'];
	
	function createMasterList() {
		$http({
			method: 'GET',
			url: '/record/' + '5b64e21498f6db0014075a31'
		}).then(function (response) {
			masterRecords = response.data;
		});
	}
	createMasterList();
	
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
		updatedApplicant.accuracy = totalAccuracy;
		$scope.displayTime = totalTime;
		$scope.displayAccuracy = totalAccuracy;
		$http.put('/applicant/' + userId, updatedApplicant).then(function(response){
			$scope.end = true;
			$scope.main = false;
		});
	}
	
	function startTest() {
		$('button').prop('disabled', false);
		$('#newImage').prop('disabled', true);
		$scope.tutorial = false;
		$scope.main = true;
		startTimer();
	}
	
	$scope.nextTutorial = function () {
		tutorialSlide++;
		if (tutorialSlide == 8) {
			$scope.tutorialMessage = 'After you have filled in all the text boxes, click the "Submit" button.  Then click the "New Image" button to get to the next image.  There are 20 Check Images to complete.  When you are ready to start, click "Next".  Once you do, do not refresh the page or click the "Back" button.  Thank you!';
		} else if (tutorialSlide == 9) {
			//Clear Scope Vars
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
			//Start test
			startTest();
		} else {
			$("#mainImageTutorial").prop('src', '/images/' + tutorialImages[tutorialSlide]);
			$scope.tutorialMessage = tutorialMessages[tutorialSlide];
		}
		if (tutorialSlide == 0) {
			$scope.checkNumber = "101";
		} else if (tutorialSlide == 1) {
			$scope.docDate = "05/24/2016";
		}
		else if (tutorialSlide == 2) {
			$scope.amount = "300.00";
		}
		else if (tutorialSlide == 3) {
			$scope.payee = "ABC Corporation";
		}
		else if (tutorialSlide == 4) {
			$scope.payor = "Joe Smith";
		}
		else if (tutorialSlide == 5) {
			$scope.payorSignature = "Joe Smith";
		}
		else if (tutorialSlide == 6) {
			$scope.checkMemo = "Invoice";
		}
		else if (tutorialSlide == 7) {
			$scope.endorsement = "ABC Corporation";
			$scope.endorsementBank = "Bank of America";
			$scope.transactionDate = "05/30/2016";
		}
	}
	
	function startTutorial() {
		$('button').prop('disabled', true);
		$('#tutorialButton').prop('disabled', false);
		tutorialSlide = -1;
		$("#mainImageTutorial").prop('src', '/images/' + 'sample' + '.jpg');
		$scope.tutorialMessage = "Welcome to the tutorial.  You will see a check on the left, and some text boxes on the right.  Your task will be to type what you see in the relative text boxes.  Click 'Next' to continue.";
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
			$scope.tutorial = true;
			startTutorial();
			//$scope.main = true;
			//startTimer();
		});
	};
	
	function checkAccuracy(currRecord) {
		for (var j = 0; j < 20; j++) {
			if(masterRecords[j].recordNumber == currRecord.recordNumber) {
				masterIndex = j;
			}
		}
		console.log(currRecord.checkNumber.toLowerCase().trim()); //1425
		console.log(masterRecords[masterIndex].checkNumber.toLowerCase().trim()); //988
		if (currRecord.checkNumber.toLowerCase().trim() == masterRecords[masterIndex].checkNumber.toLowerCase().trim()) {
			totalFieldsCorrect++;
		}
		if (currRecord.docDate.toLowerCase().trim() == masterRecords[masterIndex].docDate.toLowerCase().trim()) {
			totalFieldsCorrect++;
		}
		if (parseInt(currRecord.amount.toLowerCase().trim()) == parseInt(masterRecords[masterIndex].amount.toLowerCase().trim())) {
			totalFieldsCorrect++;
		}
		if (currRecord.payee.toLowerCase().trim() == masterRecords[masterIndex].payee.toLowerCase().trim()) {
			totalFieldsCorrect++;
		}
		if (currRecord.payor.toLowerCase().trim() == masterRecords[masterIndex].payor.toLowerCase().trim()) {
			totalFieldsCorrect++;
		}
		if (currRecord.payorSignature.toLowerCase().trim() == masterRecords[masterIndex].payorSignature.toLowerCase().trim()) {
			totalFieldsCorrect++;
		}
		if (currRecord.checkMemo.toLowerCase().trim() == masterRecords[masterIndex].checkMemo.toLowerCase().trim()) {
			totalFieldsCorrect++;
		}
		if (currRecord.endorsement.toLowerCase().trim() == masterRecords[masterIndex].endorsement.toLowerCase().trim()) {
			totalFieldsCorrect++;
		}
		if (currRecord.endorsementBank.toLowerCase().trim() == masterRecords[masterIndex].endorsementBank.toLowerCase().trim()) {
			totalFieldsCorrect++;
		}
		if (currRecord.transactionDate.toLowerCase().trim() == masterRecords[masterIndex].transactionDate.toLowerCase().trim()) {
			totalFieldsCorrect++;
		}
		totalFields += 10;
		var accuracyPercentage = 100 * (totalFieldsCorrect / totalFields);
		totalAccuracy = Math.round( accuracyPercentage * 10 ) / 10;
		console.log(totalAccuracy);
		console.log(totalFieldsCorrect);
	}
	
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
		record.userId = userId;
		record.recordNumber = $scope.recordNumber;
		checkAccuracy(record);
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
			newImage();
			$("#firstTextBox").focus();
		});
	};
	
	function newImage() {
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