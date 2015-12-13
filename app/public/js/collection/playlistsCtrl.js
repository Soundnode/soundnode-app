'use strict';

app.controller('CollectionPlaylistsCtrl', function (
    $scope,
    $rootScope,
    SCapiService,
    SC2apiService,
    userService
) {

    $scope.title = 'Playlists';
    $scope.data = '';
    $scope.busy = false;

    userService.getUserId()
        .then(function (userId) {
            SC2apiService.getPlaylists(userId)
                .then(filterCollection)
                .then(function (collection) {
                    $scope.data = collection;
                })
                .catch(function (error) {
                    console.log('error', error);
                })
                .finally(function () {
                    $rootScope.isLoading = false;
                });
        });

    /**
     * Loads next page of playlists
     * @method loadMore
     */
    $scope.loadMore = function () {
        if ($scope.busy) {
            return;
        }
        $scope.busy = true;

        SC2apiService.getNextPage()
            .then(filterCollection)
            .then(function (collection) {
                $scope.data = $scope.data.concat(collection);
            })
            .catch(function (error) {
                console.log('error', error);
            })
            .finally(function () {
                $scope.busy = false;
                $rootScope.isLoading = false;
            });
    };

    /**
     * Load tracks for particular playlist, runs when playlist is being
     * opened for the first time, modifies playlist object by adding tracks in it
     * @param  {Object} playlist - playlist instance
     * @method loadTracks
     */
    $scope.loadTracks = function (playlist) {
        // Check if playlist already has tracks loaded
        if (!angular.isUndefined(playlist.tracks)) {
            return;
        }

        SC2apiService.getPlaylist(playlist.id)
            .then(function (data) {
                playlist.tracks = data.tracks.map(function (track) {;
                    track.stream_url = track.uri + '/stream';
                    return track;
                });
            })
            .catch(function (error) {
                console.error('error', error);
            });

        $rootScope.isLoading = false;
    };

    /**
     * Unlike playlist and remove it from view
     * @param  {Object} playlist playlist instance
     * @param  {Number} index    position of playlist in view list
     * @method unlikePlaylist
     */
    $scope.unlikePlaylist = function (playlist, index) {
        SCapiService.unlikePlaylist(playlist.id)
            .then(function (data) {
                $scope.data.splice(index, 1);
            })
            .catch(function (error) {
                console.error('error', error);
            })
    };

    /**
     * Responsible to check if there's a artwork
     * otherwise replace with default badge
     * @param thumb [ track artwork ]
     * @method checkForPlaceholder
     */
    $scope.checkForPlaceholder = function (thumb) {
        var newSize;

        if ( thumb === null ) {
            return 'public/img/logo-badge.png';
        } else {
            newSize = thumb.replace('large', 'badge');
            return newSize;
        }
    };

    //

    /**
     * Keep only liked playlists, remove owned playlists
     * @param  {Object} data - response for user playlists request
     * @return {Array}      filtered collection
     */
    function filterCollection(data) {
        return data.collection.reduce(function (items, item) {
            if (item.type === 'playlist-like') {
                items.push(item.playlist);
            }
            return items;
        }, []);
    }

});
