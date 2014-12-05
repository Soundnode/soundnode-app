'use strict'

app.controller('TracksCtrl', function ($scope, SCapiService, $rootScope, Song) {

    $scope.title = 'Tracks';
    $scope.data = '';
    $scope.busy = false;
    $rootScope.showpopup = false;
    $rootScope.displayplaylists = false;

    SCapiService.getTracks()
                .then(function(data) {
                    $scope.data = data;
                }, function(error) {
                    console.log('error', error);
                }).finally(function() {
                    $rootScope.isLoading = false;
                });

    $scope.loadMore = function() {
        if ( $scope.busy ) {
            return;
        }
        $scope.busy = true;

        SCapiService.getNextPage()
            .then(function(data) {
                for ( var i = 0; i < data.length; i++ ) {
                    $scope.data.push( data[i] )
                }
            }, function(error) {
                console.log('error', error);
            }).finally(function(){
                $scope.busy = false;
                $rootScope.isLoading = false;
            });
    };

    $scope.showplaylists = function() {
        $scope.song = Song;
        $scope.playlistsdata = '';
        $rootScope.displayplaylists = true;

        SCapiService.getPlaylists()
            .then(function(data) {
                $scope.playlistsdata = data;
            }, function(error) {
                console.log('error', error);
            }).finally(function(){
                $rootScope.isLoading = false;
            });

        $scope.checkForPlaceholder = function (thumb) {
            var newSize;
            if ( thumb === null ) {
                return 'public/img/temp-playing.png';
            } else {
                newSize = thumb.replace('large', 'badge');
                return newSize;
            }
        };
    };


 $scope.closeOverlay = function() {
     $rootScope.showpopup = false;
     $rootScope.displayplaylists = false;
 };


});