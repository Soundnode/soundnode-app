"use strict"

app.controller('PlaylistDashboardCtrl', function($rootScope, $scope, SCapiService, $log, $window, $http, ngDialog) {
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

        $log.log('save to playlist', $scope.playlistSongId + ' ' + playlistId + ' ' + $rootScope.userId);
    };

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