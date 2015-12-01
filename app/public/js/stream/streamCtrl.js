'use strict';

app.controller('StreamCtrl', function (
    $scope,
	$rootScope,
    SCapiService,
    SC2apiService,
    utilsService
) {
    var tracksIds = [];

    $scope.title = 'Stream';
    $scope.data = '';
    $scope.busy = false;

    SC2apiService.getStream()
        .then(filterCollection)
        .then(function (collection) {
            $scope.data = collection;

            loadTracksInfo(collection);
        })
        .catch(function (error) {
            console.log('error', error);
        })
        .finally(function () {
            utilsService.updateTracksLikes($scope.data);
            utilsService.updateTracksReposts($scope.data);
            $rootScope.isLoading = false;
        });

    $scope.loadMore = function() {
        if ( $scope.busy ) {
            return;
        }
        $scope.busy = true;

        SC2apiService.getNextPage()
            .then(filterCollection)
            .then(function (collection) {
                $scope.data = $scope.data.concat(collection);
                utilsService.updateTracksLikes(collection, true);
                utilsService.updateTracksReposts(collection, true);
                loadTracksInfo(collection);
            }, function (error) {
                console.log('error', error);
            }).finally(function () {
                $scope.busy = false;
                $rootScope.isLoading = false;
            });
    };

    function filterCollection(data) {
        return data.collection.filter(function (item) {
            // Keep only tracks (remove playlists, etc)
            var isTrackType = item.type === 'track' ||
                              item.type === 'track-repost' ||
                              !!(item.track && item.track.streamable);
            if (!isTrackType) {
                return false;
            }

            // Filter reposts: display only first appearance of track in stream
            var exists = tracksIds.indexOf(item.track.id) > -1;
            if (exists) {
                return false;
            }

            // "stream_url" property is missing in V2 API
            item.track.stream_url = item.track.uri + '/stream';

            tracksIds.push(item.track.id);
            return true;
        });
    }

    // Load extra information, because SoundCloud v2 API does not return
    // number of track likes
    function loadTracksInfo(collection) {
        var ids = collection.map(function (item) {
            return item.track.id;
        });

        SC2apiService.getTracksByIds(ids)
            .then(function (tracks) {
                // Both collections are unordered
                collection.forEach(function (item) {
                    tracks.forEach(function (track) {
                        if (item.track.id === track.id) {
                            item.track.favoritings_count = track.likes_count;
                            return;
                        }
                    });
                });
            })
            .catch(function (error) {
                console.log('error', error);
            });
    }

});