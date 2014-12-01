'use strict';

app.controller('CreatePlCtrl', function ($scope, $http, $rootScope, SCapiService) {

    $rootScope.isCreatePlVisible = false;
    $scope.content = 'Tesing... content will be reset later on!';

    $scope.createPlView = function() {
        if ( !$rootScope.isCreatePlVisible ) {
            $rootScope.isCreatePlVisible = true;
       } 
    }

    $scope.cancelPl = function() {
        if ( $rootScope.isCreatePlVisible ) {
            $scope.addedPlaylist = '';
            $rootScope.isCreatePlVisible = false;
       } 
    }

    $scope.savePl = function() {
        var plTitle = $scope.addedPlaylist;
        $scope.addedPlaylist = '';
        $rootScope.isCreatePlVisible = false; 
        SCapiService.savePl(plTitle);
        console.log('after making the pl...................');
    }

});
