'use strict';

app.controller('StreamCtrl', function (
    $scope,
    SCapiService,
    $rootScope
) {
    var endpoint = 'me/activities'
        , params = 'limit=33'
        , tracksIds = [];

    $scope.title = 'Stream';
    $scope.data = '';
    $scope.busy = false;
    $scope.likes = '';

    SCapiService.get(endpoint, params)
        .then(function(data) {
            var tracks = filterTracks(data.collection);
            $scope.data = tracks;
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
                var tracks = filterTracks(data.collection);
                markLikedTracks(tracks);
                $scope.data = $scope.data.concat(tracks);
            }, function(error) {
                console.log('error', error);
            }).finally(function(){
                $scope.busy = false;
                $rootScope.isLoading = false;
            });
    };

    function filterTracks(tracks) {
        // Filter reposts: display only first appearance of track in stream
        return tracks.filter(function (track) {
            var exists = tracksIds.indexOf(track.origin.id) > -1;
            if (!exists) {
                tracksIds.push(track.origin.id);
            }
            return !exists;
        });
    }

    function markLikedTracks (tracks) {
        var tracksData = tracks.collection || tracks;
        for (var i = 0; i < tracksData.length; ++i) {
            var track = tracksData[i].origin;

            if (track.hasOwnProperty('user_favorite'))
                track.user_favorite = ($scope.likes.indexOf(track.id) != -1);
        }
    }

});