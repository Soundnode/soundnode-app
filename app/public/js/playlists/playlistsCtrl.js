'use strict';

app.controller('PlaylistsCtrl', function (
    $scope,
    SCapiService,
    $rootScope,
    $log,
    $window,
    $http,
    $state,
    $stateParams,
    notificationFactory,
    modalFactory,
    utilsService,
    queueService
) {
    var endpoint = 'me/playlists'
        , params = 'limit=125';

    $scope.title = 'Playlists';
    $scope.data = '';

    SCapiService.get(endpoint, params)
        .then(function(data) {
            data.forEach(function(playlist, i) {
                var l = playlist.tracks.length;
                while(l--) {
                    if(!playlist.tracks[l].streamable) {
                        data[i].tracks.splice(l, 1);
                    }
                }
            });
            $scope.data = data;
        }, function(error) {
            console.log('error', error);
        }).finally(function(){
            $rootScope.isLoading = false;
            utilsService.setCurrent();
        });

    /**
     * Responsible to remove track from a particular playlist
     * @params songId [track id to be removed from the playlist
     * @params playlistId [playlist id that contains the track]
     * @method removeFromPlaylist
     */
    $scope.removeFromPlaylist = function(songId, playlistId) {
        var endpoint = 'users/'+  $rootScope.userId + '/playlists/'+ playlistId
            , params = '';

        SCapiService.get(endpoint, params)
            .then(function(response) {
                var uri = response.uri + '.json?&oauth_token=' + $window.scAccessToken
                    , tracks = response.tracks
                    , songIndex
                    , i = 0;

                // finding the track index
                for ( ; i < tracks.length ; i++ ) {
                    if ( songId == tracks[i].id ) {
                        songIndex = i;
                    }
                }

                // Removing the track from the tracks list
                tracks.splice(songIndex, 1);

                $http.put(uri, { "playlist": {
                    "tracks": tracks
                }
                }).then(function(response) {
                    notificationFactory.success("Song removed from Playlist!");
                }, function(response) {
                    notificationFactory.error("Something went wrong!");
                    $log.log(response);
                    return $q.reject(response.data);
                }).finally(function() {
                    var inQueue = queueService.find(songId);

                    $('#' + songId).remove();

                    if ( inQueue ) {
                        queueService.remove(inQueue);
                    }
                })

            }, function(error) {
                console.log('error', error);
            });

    };

    /**
     * Responsible to delete entire playlist
     * @params playlistId [playlist id]
     * @method removePlaylist
     */
    $scope.removePlaylist = function(playlistId) {
        modalFactory
            .confirm('Do you really want to delete the playlist?')
            .then(function () {
                SCapiService.removePlaylist(playlistId)
                    .then(function(response) {
                        if ( typeof response === 'object' ) {
                            notificationFactory.success("Playlist removed!");
                        }
                    }, function(error) {
                        notificationFactory.error("Something went wrong!");
                    })
                    .finally(function() {
                        $('#' + playlistId).remove();
                    });
            });
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
});