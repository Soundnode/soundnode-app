'use strict';

app.directive('queueList', function () {
    return {
        restrict: 'E',
        scope: true,
        controller: "QueueCtrl",
        templateUrl: function(elem, attr){
            return "views/common/queueList.html";
        }
    }
});