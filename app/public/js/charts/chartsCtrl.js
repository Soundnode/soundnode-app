'use strict';

app.controller('ChartsCtrl', function (
    $scope,
    $filter,
    $rootScope,
    SCapiService,
    SC2apiService,
    utilsService,
    $stateParams
) {
    var tracksIds = [];
    $scope.genres = [
        {
            "link": 'all-music',
            "title": "All"
        },
        {
            "link": 'alternativerock',
            "title": "Alternative Rock"
        },
        {
            "link": 'ambient',
            "title": "Ambient"
        },
        {
            "link": 'classical',
            "title": "Classical"
        },
        {
            "link": 'country',
            "title": "Country"
        },
        {
            "link": 'danceedm',
            "title": "Dance & EDM"
        },
        {
            "link": 'dancehall',
            "title": "Dancehall"
        },
        {
            "link": 'deephouse',
            "title": "Deep House"
        },
        {
            "link": 'disco',
            "title": "Disco"
        },
        {
            "link": 'drumbass',
            "title": "Drum & Bass"
        },
        {
            "link": 'dubstep',
            "title": "Dubstep"
        },
        {
            "link": 'electronic',
            "title": "Electronic"
        },
        {
            "link": 'folksingersongwriter',
            "title": "Folk & Singer-Songwriter"
        },
        {
            "link": 'hiphoprap',
            "title": "Hip-hop & Rap"
        },
        {
            "link": 'house',
            "title": "House"
        },
        {
            "link": 'indie',
            "title": "Indie"
        },
        {
            "link": 'jazzblues',
            "title": "Jazz & Blues"
        },
        {
            "link": 'latin',
            "title": "Latin"
        },
        {
            "link": 'metal',
            "title": "Metal"
        },
        {
            "link": 'piano',
            "title": "Piano"
        },
        {
            "link": 'pop',
            "title": "Pop"
        },
        {
            "link": 'rbsoul',
            "title": "R&B & Soul"
        },
        {
            "link": 'reggae',
            "title": "Reggae"
        },
        {
            "link": 'reggaeton',
            "title": "Reggaeton"
        },
        {
            "link": 'rock',
            "title": "Rock"
        },
        {
            "link": 'soundtrack',
            "title": "Soundtrack"
        },
        {
            "link": 'techno',
            "title": "Techno"
        },
        {
            "link": 'trance',
            "title": "Trance"
        },
        {
            "link": 'trap',
            "title": "Trap"
        },
        {
            "link": 'triphop',
            "title": "Triphop"
        },
        {
            "link": 'world',
            "title": "World"
        }
    ];

    var url_genre = $stateParams.genre;
    var genre = {};
    if(!url_genre){
        genre = {
            "link" : "all-music",
            "title" : "All Music"
        }
    }else{
        genre = $filter('filter')($scope.genres, {"link":url_genre}, true)[0]
    }

    $scope.title = 'Top 50 - '+genre.title;
    $scope.data = '';
    $scope.busy = false;


    SC2apiService.getCharts(genre.link)
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
                            return false;
                        }
                    });
                });
            })
            .catch(function (error) {
                console.log('error', error);
            });
    }

});
