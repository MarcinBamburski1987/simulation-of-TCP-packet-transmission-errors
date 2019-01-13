angular.module('app', [])
    .controller('mainController', mainController);


mainController.$inject = ['$scope','$window'];

function mainController($scope,$window) {

    $scope.message = null;
    $scope.receivedMessage = '';
    $scope.messageBeenSent = false;
    $scope.error = "";

    var setReceivedMessage = function (checkSum) {
        $scope.receivedMessage = $scope.message + checkSum;
    }

    var getCheckSum = function () {
        var str = $scope.message;

        console.log("message ",str);
        var checkSum = 0;
        if (str !== null) {
            for (var i = 0; i < str.length; i++) {
                console.log("length of string(message) is " + str.length + ";character of index: " + i + " has the unicode: " + str.charCodeAt(i));
                checkSum = str.charCodeAt(i) + checkSum;
            }
        } else {
            window.alert("Please type message!");
        }

        return checkSum;
    }


    $scope.sendMessage = function () {
        var checkSum = getCheckSum();
        if (checkSum !== 0) {
            console.log("Checksum of sent message ", checkSum);
            setReceivedMessage(checkSum);
            $scope.messageBeenSent = true;
            isItSameValue(checkSum);
        }
        $scope.message = null;//-> it clears input field
    }

    var getOnlyNumberFromString = function () {
        var receivedText = $scope.receivedMessage + $scope.error;
        console.log("received text ", $scope.receivedMessage);
        console.log("received text with error value ", receivedText);
        var onlyNumberFromReceivedMessage = receivedText.match(/\d/g);
        onlyNumberFromReceivedMessage = onlyNumberFromReceivedMessage.join("");
        var onlyNumberFromReceivedMessageParseToInt = parseInt(onlyNumberFromReceivedMessage);
        return onlyNumberFromReceivedMessageParseToInt;
    }

    $scope.isItNumberAndCheckSumSame = false;

    var isItSameValue = function (checkSum) {
        if ($scope.messageBeenSent === true) {
            var number = getOnlyNumberFromString();
            if (number === checkSum) {
                $scope.isItNumberAndCheckSumSame = true;
                console.log("value of check sum from received message: ", number);
                console.log("VALUES ARE THE SAME! ", $scope.isItNumberAndCheckSumSame);
            } else {
                $scope.isItNumberAndCheckSumSame = false;
                console.log("Value of check sum from received message: ", number);
                console.log("VALUES ARE THE SAME! ", $scope.isItNumberAndCheckSumSame);
                relay();
            }
        }

        return $scope.isItNumberAndCheckSumSame;
    }

    $scope.generateCheckSumError = function () {
        if($scope.message!==null){
            window.alert("Check sum error!!!");
            var checkSum = getCheckSum();
            console.log("checksum of sent message ", checkSum);
            setReceivedMessage(checkSum);
            $scope.messageBeenSent = true;
            $scope.error = 100+"a";//zabezpiecznie przed błędem receivedTest.match is not a function
            isItSameValue(checkSum);
        } else {
          window.alert("Please type message!");
        }
    }

    var relay = function(){
        var relayAlertConfirmation = $window.confirm('Are you sure you want to relay?');
        if(relayAlertConfirmation){
            $scope.error = "";
            $scope.sendMessage();
        }
    }
}
