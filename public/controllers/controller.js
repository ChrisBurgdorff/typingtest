//Instantiating dialog with Filestack
var client = filestack.init("AqyYt7xJeT2evrMxKENiAz");
//Filestack API method 'pick()' that opens the file picker
//client.pick({});
        
var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http){
	
	//Initialize
	numRecords = 10;
	$scope.intro = true;
	$scope.main = false;
	$scope.tutorial = false;
	$scope.end = false;
  $scope.qc = false;
  $scope.qcExplanation = false;
  $scope.upload = false;
	$scope.recordNumber = 1;
  var timerInterval;
	$("#newImage").prop('disabled', true);
	$("#mainImage").prop('src', '/images/' + $scope.recordNumber + '.jpg');
	$scope.message = "Record " + $scope.recordNumber + " of " + "15" + ".";
	var masterRecords;
	var totalFieldsCorrect = 0;
	var totalFields = 0;
	var totalAccuracy;
	var userId = "";
	var totalTime;
  var qcNumber = 0;
  var qcRight = 0;
  var qcWrong = 0;
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
    clearInterval(timerInterval);
		var start = new Date().getTime(),
			elapsed = '0.0';
		timerInterval = window.setInterval(function() {
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
      $("#timer2").text("Elapsed Time: " + totalTime);
		}, 100);
	}
	
	//END of Test
	function endTest() {
		var updatedApplicant = {};
		updatedApplicant.elapsedTime = totalTime;
		updatedApplicant.accuracy = totalAccuracy;
		$scope.displayTime = totalTime;
		$scope.displayAccuracy = totalAccuracy;
    $('button').prop('disabled', false);
		$http.put('/applicant/' + userId, updatedApplicant).then(function(response){
      console.log("in first put");
      console.log(totalTime);
      console.log(totalAccuracy);
			//$scope.end = true;
			$scope.main = false;
      $scope.qcExplanation = true;
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
			$scope.tutorialMessage = 'After you have filled in all the text boxes, click the "Submit" button.  There are 15 Check Images to complete.  When you are ready to start, click "Next".  Once you do, do not refresh the page or click the "Back" button.  Thank you!';
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
    console.log("Button disabled from submit");
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
      console.log("new image button disabled")
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
				//$('button').prop('disabled', true);
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
			//$('button').prop('disabled', true);
			//endTest();
			//End
		} else {
			//Reset Response Message
			$scope.message = "Record " + $scope.recordNumber + " of " + "15" + ".";
			//Load Next Image
			$("#mainImage").prop('src', '/images/' + $scope.recordNumber + '.jpg');
		}
	};
  
  function endQC() {
    console.log("In endQC");
    var updatedApplicant = {};
		updatedApplicant.qcTime = totalTime;
		updatedApplicant.qcAccuracy = qcRight;
		$scope.displayTime = totalTime;
		$scope.displayAccuracy = totalAccuracy;
		$http.put('/applicantqc/' + userId, updatedApplicant).then(function(response){
      console.log("in second put response");
      console.log(totalTime);
      console.log(qcRight);
      console.log(userId);
      console.log(response);
			//$scope.end = true;
			$scope.qc = false;
      $scope.upload = true;
		});   
  }
  
  function nextQC(index) {
    if (index == 15) {
      endQC();
    } else {
      qcNumber = index + 1;
      displayQCImage(qcNumber);
      displayQCFields(qcNumber);
      $scope.message = "Record " + qcNumber + " of 15.";
    }
  }
  
  $scope.checkQC =  function(selection) {
    if (qcNumber == 11) {
      if (selection == 2) { qcRight++;} else {qcWrong++;}
    } else if (qcNumber == 12) {
      if (selection == 2) { qcRight++;} else {qcWrong++;}
    }else if (qcNumber == 13) {
      if (selection == 4) { qcRight++;} else {qcWrong++;}
    }else if (qcNumber == 14) {
      if (selection == 3) { qcRight++;} else {qcWrong++;}
    }else if (qcNumber == 15) {
      if (selection == 5) { qcRight++;} else {qcWrong++;}
    }
    nextQC(qcNumber);
  }
  
  function displayQCImage(index) {
    $("#qcImage").prop('src', '/images/' + index + '.jpg');
  }
  
  function displayQCFields(index) {
    if (index == 11) {
      $scope.checkNumber = "7055";
      $scope.docDate = "12/14/1999";
      $scope.amount = "149.55";
      $scope.payee = "Martha Dreyer";
      $scope.payor = "Sumace Properties LLC";
    } else if (index == 12) {
      $scope.checkNumber = "1466";
      $scope.docDate = "12/25/2007";
      $scope.amount = "50.00";
      $scope.payee = "Carmen Mills";
      $scope.payor = "Robby Amaya";
    } else if (index == 13) {
      $scope.checkNumber = "2763";
      $scope.docDate = "06/15/2015";
      $scope.amount = "820.00";
      $scope.payee = "Haftan Incorporated";
      $scope.payor = "Nero Anderson";
    } else if (index == 14) {
      $scope.checkNumber = "1053";
      $scope.docDate = "10/09/2010";
      $scope.amount = "750.00";
      $scope.payee = "North Jersey Dental PC";
      $scope.payor = "Madelyn Tracy";
    } else if (index == 15) {
      $scope.checkNumber = "286";
      $scope.docDate = "07/10/2014";
      $scope.amount = "125.00";
      $scope.payee = "Efren Gonzalez";
      $scope.payor = "Mue Cutler";
    }
   }
  
  $scope.startQC = function() {
    //START HERE TOMORROW
    console.log("IN startQC");
    $scope.qcExplanation = false;
    $scope.qc = true;
    qcNumber = 11;
    startTimer();
    displayQCImage(11);
    displayQCFields(11);
    $scope.message = "Record 11 of 15.";
  };
  
  $scope.uploadResume = function() {
    client.pick({
        //Only accepting files with a mimetype 'image/*'
        accept: [
          "image/*",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/rtf",
          "text/plain"
          ],
        //Only accepting at most 1 file
        maxFiles:2
    }).then(function(){
      $scope.upload = false;
      $scope.end = true;
    });
  };
	
}]);