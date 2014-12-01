'use strict';

app.controller('CreatePlaylistCtrl', function ($scope, $http, $rootScope, SCapiService) {

    $rootScope.isCreatePlaylistVisible = false;

    $scope.createPlaylistView = function() {
        if ( !$rootScope.isCreatePlaylistVisible ) {
            $rootScope.isCreatePlaylistVisible = true;
       } 
    }

    $scope.cancelPlaylist = function() {
        if ( $rootScope.isCreatePlaylistVisible ) {
            $scope.addedPlaylistaylist = '';
            $rootScope.isCreatePlaylistVisible = false;
       } 
    }

    $scope.savePlaylist = function() {
        var plTitle = $scope.addedPlaylist;
        $scope.addedPlaylist = '';
        $rootScope.isCreatePlaylistVisible = false; 
        SCapiService.savePlaylist(plTitle);
    }

});
