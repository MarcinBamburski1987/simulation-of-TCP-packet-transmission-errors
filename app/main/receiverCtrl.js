angular.module('app')
    .controller('receiverController', receiverController);


receiverController.$inject = ['$scope', '$window', '$rootScope', '$timeout'];

function receiverController($scope, $window, $rootScope, $timeout) {

    $scope.isConnected = false;
    $scope.msgList = [];
    $scope.checkSumCorrect = false;

    $scope.onMsgClear = function () {
        $scope.msgList = [];
    };

    var getCheckSum = function (str) {
        var checkSum = 0;
        if (str !== null && str != undefined) {
            for (var i = 0; i < str.length; i++) {
                checkSum = str.charCodeAt(i) + checkSum;
            }
        }

        return checkSum;
    }

    $scope.$on('receiver', function (event, data) {
        data.received=new Date();
        console.log('received', data);
        var checkSum = getCheckSum(data.message);

        if(data.checkSumValueForSending === checkSum){
            console.log("check sums are same");
            $scope.msgList.unshift(data);
        }

        if (!data.init && !data.message)
            $rootScope.$broadcast(data.senderName, {receiverName: 'receiver',  ok: false, error: 'noMessage'});
        else
            $rootScope.$broadcast(data.senderName, {receiverName: 'receiver', ok: true});
    })

}
