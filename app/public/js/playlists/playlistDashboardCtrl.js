"use strict"

app.controller('PlaylistDashboardCtrl', function($rootScope, $scope, SCapiService, $log, $window, $http, ngDialog, $state, $stateParams) {
    var endpoint = 'me/playlists'
        , params = '';

    $scope.data = '';

    SCapiService.get(endpoint, params)
        .then(function(data) {
            $scope.data = data;
        }, function(error) {
            $log.log('error', error);
        }).finally(function() {
            $rootScope.isLoading = false;
        });

    /**
     * Responsible to add track to a particular playlist
     * @params playlistId [playlist id that contains the track]
     * @method saveToPlaylist
     */
    $scope.saveToPlaylist = function(playlistId) {
        var endpoint = 'users/'+  $rootScope.userId + '/playlists/'+ playlistId
            , params = '';

        SCapiService.get(endpoint, params)
            .then(function(response) {
                var track = {
                        "id": Number.parseInt($scope.playlistSongId)
                    }
                    , uri = response.uri + '.json?&oauth_token=' + $window.scAccessToken
                    , tracks = response.tracks;

                tracks.push(track);

                $http.put(uri, { "playlist": {
                        "tracks": tracks
                    }
                }).then(function(response) {
                    if ( typeof response.status === 200 ) {
                        // do something important or not
                    }
                }, function(response) {
                    console.log('something went wrong response');
                    // something went wrong
                    $log.log(response);
                    return $q.reject(response.data);
                }).finally(function() {
                    ngDialog.closeAll();
                })

            }, function(error) {
                console.log('error', error);
            });

    };

    /**
     * Responsible to send and create
     * a new playlist name
     * @method createPlaylist
     */
    $scope.createPlaylist = function() {
        SCapiService.createPlaylist($scope.playlistName)
            .then(function(response) {
                if ( typeof response.status === 200 ) {
                    $log.log('New playlist created', $scope.playlistName);
                }
            }, function() {
                // something went wrong
                $log.log(response);
            })
            .finally(function() {
                ngDialog.closeAll();
            });
    };

    /**
     * Responsible to check if there's a artwork
     * otherwise replace with default badge
     * @param thumb [ track artwork ]
     */
    $scope.checkForPlaceholder = function (thumb) {
        var newSize;

        if ( thumb === null ) {
            return 'public/img/logo-badge.png';
        } else {
            newSize = thumb.replace('large', 'badge');
            return newSize;
        }
    }
});