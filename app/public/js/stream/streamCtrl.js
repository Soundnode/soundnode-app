'use strict';

app.controller('StreamCtrl', function ($scope, SCapiService, $rootScope) {
    var endpoint = 'me/activities'
        , params = 'limit=33';

    $scope.title = 'Stream';
    $scope.data = '';
    $scope.busy = false;
    $scope.likes = '';

    SCapiService.get(endpoint, params)
        .then(function(data) {
            $scope.data = data.collection;
        }, function(error) {
            console.log('error', error);
        }).finally(function() {

            SCapiService.getFavoritesIds()
                .then(function(data) {
                    $scope.likes = data;
                    markLikedTracks($scope.data);
                }, function(error) {
                    console.log('error', error);
                }).finally(function() {
                    $rootScope.isLoading = false;
                });
        });

    $scope.loadMore = function() {
        if ( $scope.busy ) {
            return;
        }
        $scope.busy = true;

        SCapiService.getNextPage()
            .then(function(data) {
                markLikedTracks(data);
                for ( var i = 0; i < data.collection.length; i++ ) {
                    $scope.data.push( data.collection[i] )
                }
            }, function(error) {
                console.log('error', error);
            }).finally(function(){
                $scope.busy = false;
                $rootScope.isLoading = false;
            });
    };

    function markLikedTracks (tracks) {
        var tracksData = tracks.collection || tracks;
        for (var i = 0; i < tracksData.length; ++i) {
            var track = tracksData[i].origin;

            if (track.hasOwnProperty('user_favorite'))
                track.user_favorite = ($scope.likes.collection.indexOf(track.id) != -1);
        }
    }

});