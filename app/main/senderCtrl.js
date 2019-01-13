angular.module('app')
    .controller('senderController', senderController);


senderController.$inject = ['$scope', '$window', '$rootScope', '$timeout'];

function senderController($scope, $window, $rootScope, $timeout) {

    $scope.connection = {
        isConnected: false,
        error: false
    };
    $scope.message = '';
    $scope.checkSumValueForSending = 0;

    $scope.errors = {
        connection: false,
        address: false,
        message: false,
        checksum: false
    };

    $scope.test = function(){
        console.log("FLAG ", $scope.errors.checksum);
    }

    var timer;

    // CONNECTION INITIALIZE
    $scope.onInitConnection = function (receiverName, data) {
        data.init = true;
        emitData(receiverName, data);
    };

    $scope.onCancelConnection = function () {
        $timeout.cancel(timer);
        $scope.connection.isConnected = false;
    };

    var emitData = function (receiverName, data,checkSum) {
        var sendingData = angular.copy(data);
        sendingData.message = getMessage(sendingData.message);
        sendingData.senderName = getSenderName(sendingData.senderName);
        sendingData.checkSumValueForSending = checkSum;
        console.log('sending', sendingData);
        $rootScope.$broadcast(getReceiverName(receiverName), sendingData);
        timer = $timeout(function () {
            // if (!$scope.connection.isConnected)
            emitData(receiverName, data,checkSum);
        }, 1000)
    };

    $scope.$on('sender', function (event, data) {
        console.log('answer', data);
        if (data.ok)
            $timeout(function () {
                $timeout.cancel(timer);
            }, 0);
        $scope.connection.isConnected = true;
    });


    var getCheckSum = function (str) {
        var checkSum = 0;
        if (str !== null) {
            for (var i = 0; i < str.length; i++) {
                checkSum = str.charCodeAt(i) + checkSum;
            }
        } else {
            window.alert("Please type message!");
        }

        return checkSum;
    }

    //CHAT
    $scope.onSendMessage = function (receiverName, data) {
        if($scope.errors.checksum === false){
            var checkSum = getCheckSum(data.message);
        }else{
            var checkSum = -1;
        }
            emitData(receiverName, data,checkSum);
    };

    // ERRORS HANDLERS
    var getSenderName = function (name) {
        return $scope.errors.connection ? name + 'Error' : name;
    };

    var getReceiverName = function (name) {
        return $scope.errors.address ? name + 'Error' : name;
    };

    var getMessage = function (msg) {
        return $scope.errors.message ? null : msg;
    };
}
