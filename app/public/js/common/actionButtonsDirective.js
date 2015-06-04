'use strict';

app.directive('actionButtons', function () {
    return {
        restrict: 'E',
        templateUrl: function(elem, attr){
            return "views/common/actionButtons"+attr.os+".html";
        },
        link : function () {
            uiFrame.addGUIeventHandlers();
        }
    }
});