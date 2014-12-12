'use strict'

app.service('SCapiService', function($http, $window, $q, $log, $state, $stateParams, $rootScope) {

    /**
     * Responsible to store next url for pagination request
     * @type {Object}
     */
    this.next_page = '';

    /**
     * Responsible to set loading component
     * when a network method is happening
     * @method isLoading
     */
    this.isLoading = function() {
        $rootScope.isLoading = true;
    };

    this.get = function(endpoint, params) {

        var url = 'https://api.soundcloud.com/' + endpoint + '.json?' + params + '&oauth_token=' + $window.scAccessToken
            , that = this;

        this.isLoading();

        return $http.get(url)
                    .then(function(response) {
                        if (typeof response.data === 'object') {
                            if ( response.data.next_href !== null || response.data.next_href !== undefined ) {
                                that.next_page = response.data.next_href;
                            } else {
                                that.next_page = '';
                            }
                            return response.data;
                        } else {
                            // invalid response
                            return $q.reject(response.data);
                        }

                    }, function(response) {
                        // something went wrong
                        return $q.reject(response.data);
                    });
    };

    /**
     * Responsible to request next page data and save new next_page url
     * @returns {Object} data
     */
    this.getNextPage = function() {
        var url = this.next_page + '&oauth_token=' + $window.scAccessToken + '&linked_partitioning=1'
            , that = this;

        this.isLoading();

       return $http.get(url)
                    .then(function(response) {
                        if (typeof response.data === 'object') {
                            if ( response.data.next_href !== null || response.data.next_href !== undefined ) {
                                that.next_page = response.data.next_href;
                            }
                            return response.data;
                        } else {
                            // invalid response
                            return $q.reject(response.data);
                        }

                    }, function(response) {
                        // something went wrong
                        return $q.reject(response.data);
                    });
    };



    /**
     * Responsible to make get request to get the playlists
     * @method getPlaylists
     */

    this.getPlaylists = function() {
        var endpoint = 'me/playlists';
        var url = 'https://api.soundcloud.com/' + endpoint + '.json?' + '&oauth_token=' + $window.scAccessToken
        , that = this;
        this.isLoading();
        return $http.get(url)
            .then(function(response) {
                if (typeof response.data === 'object') {
                    if ( response.data.next_href !== null || response.data.next_href !== undefined ) {
                        that.next_page = response.data.next_href;
                    } else {
                        that.next_page = '';
                    }
                    return response.data;
                } else {
                    // invalid response
                    return $q.reject(response.data);
                }
            }, function(response) {
                // something went wrong
                return $q.reject(response.data);
            });
    };


    /**
     * Responsible to get the followed users.
     * @return {[object]} data response
     */
    this.getFollowing = function () {
        this.isLoading();

        var url = 'https://api.soundcloud.com/' + 'me/followings' + '.json?' + '&oauth_token=' + $window.scAccessToken
            + '&linked_partitioning=1'
            , that = this;

        return $http.get(url)
            .then(function(response) {
                if (typeof response.data === 'object') {
                    if ( response.data.next_href !== null || response.data.next_href !== undefined ) {
                        that.next_page = response.data.next_href;
                    } else {
                        that.next_page = '';
                    }
                    return response.data;
                } else {
                    // invalid response
                    return $q.reject(response.data);
                }

            }, function(response) {
                // something went wrong
                return $q.reject(response.data);
            });
    }

    /**
     * Responsible to get profile data, i.e, user name, description etc.
     * @return {[object]} data response
     */
    this.getProfile = function(userId) {
        var url = 'https://api.soundcloud.com/users/' + userId + '.json?&oauth_token=' + $window.scAccessToken,
            that = this;
        return $http.get(url)
            .then(function(response) {
                if (typeof response.data === 'object') {
                    if ( response.data.next_href !== null || response.data.next_href !== undefined ) {
                        that.next_page = response.data.next_href;
                    }
                    return response.data;
                } else {
                    // invalid response
                    return $q.reject(response.data);
                }

            }, function(response) {
                // something went wrong
                return $q.reject(response.data);
            });
    };

    /**
     * Responsible to get profile tracks.
     * @return {[object]} data response
     */
    this.getProfileTracks = function(userId) {
        var url = 'https://api.soundcloud.com/users/' + userId  + '/tracks.json?' + 'limit=15' + '&oauth_token=' + $window.scAccessToken
            + '&linked_partitioning=1'
            , that = this;

        return $http.get(url)
            .then(function(response) {
                if (typeof response.data === 'object') {
                    if ( response.data.next_href !== null || response.data.next_href !== undefined ) {
                        that.next_page = response.data.next_href;
                    }
                    return response.data;
                } else {
                    // invalid response
                    return $q.reject(response.data);
                }

            }, function(response) {
                // something went wrong
                return $q.reject(response.data);
            });
    };

    /**
     * Responsible to save song to SC favorites
     * @return {[object]} data response
     */
    this.saveFavorite = function(userId, songId) {
        var url = 'https://api.soundcloud.com/users/' + userId + '/favorites/' + songId + '.json?&oauth_token=' + $window.scAccessToken
            , that = this;

       return $http.put(url)
                    .then(function(response) {
                        if (typeof response.data === 'object') {
                            return response.data;
                        } else {
                            // invalid response
                            return $q.reject(response.data);
                        }

                    }, function(response) {
                        // something went wrong
                        return $q.reject(response.data);
                    });
    };

    /**
     * Responsible to delete song from SC favorites
     * @return {[object]} data response
     */
    this.deleteFavorite = function(userId, songId) {
        var url = 'https://api.soundcloud.com/users/' + userId + '/favorites/' + songId + '.json?&oauth_token=' + $window.scAccessToken
            , that = this;

       return $http.delete(url)
                    .then(function(response) {
                        if (typeof response.data === 'object') {
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                            return response.data;
                        } else {
                            // invalid response
                            return $q.reject(response.data);
                        }

                    }, function(response) {
                        // something went wrong
                        return $q.reject(response.data);
                    });
    }

    this.searchTracks = function(limit, query) {
        var url = 'https://api.soundcloud.com/tracks.json?linked_partitioning=1&limit=' + limit + '&q=' + query + '&oauth_token=' + $window.scAccessToken
            , that = this;

        return $http.get(url)
            .then(function(response) {
                if (typeof response.data === 'object') {
                    that.next_page = response.data.next_href;
                    return response.data;
                } else {
                    //invalid response
                    return $g.reject(response.data);
                }
            }, function(response) {
                //something went wrong
                return $g.reject(response.data);
            });
    }



    /**
     * Responsible to add song to a playlist
     */
    this.saveToPlaylist = function(userId, playlistId, songId) {
        var track = { "id": Number.parseInt(songId) };
        var url = 'https://api.soundcloud.com/users/'+  userId + '/playlists/'+ playlistId+ '.json?&oauth_token=' + $window.scAccessToken 
            , that = this;
        $http.get(url).then(function(response) {
            var uri = response.data.uri + '.json?&oauth_token=' + $window.scAccessToken;
            var tracks = response.data.tracks;
            tracks.push(track);

            return $http.put(uri, { "playlist": { "tracks": tracks } })
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        console.log('invalid response');
                        // invalid response
                        return $q.reject(response.data);
                    }

                }, function(response) {
                    console.log('something went wrong response');
                    // something went wrong
                    console.log(response);
                    return $q.reject(response.data);
                });

        });
    };


    /**
     * Responsible to remove a song from a playlist
     */
    this.removeSongFromPlaylist = function(userId, playlistId, songId) {
        var url = 'https://api.soundcloud.com/users/'+ userId + '/playlists/'+ playlistId+ '.json?&oauth_token=' + $window.scAccessToken
        , that = this;
        $http.get(url).then(function(response) {
            var uri = response.data.uri + '.json?&oauth_token=' + $window.scAccessToken;
            var tracks = response.data.tracks;
            var songIndex;
            var i;
            // finding the track index
            for ( i=0 ; i<tracks.length ; i++){
                if (songId == tracks[i].id) {
                    songIndex = i;
                }
            }
            // Removing the track from the tracks list
            tracks.splice(songIndex, 1);
            return $http.put(uri, { "playlist": { "tracks": tracks } })
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        console.log('invalid response');
                        // invalid response
                        return $q.reject(response.data);
                    }
                }, function(response) {
                    console.log('something went wrong response');
                    // something went wrong
                    console.log(response);
                    return $q.reject(response.data);
                });
        });
    };


    this.followUser = function(id) {
        var url = 'https://api.soundcloud.com/me/followings/' + id + '?oauth_token=' + $window.scAccessToken;

        return $http.put(url)
            .then(function(response) {
                if (typeof response.data === 'object') {
                    return response.data;
                } else {
                    //invalid response
                    return $g.reject(response.data);
                }
            }, function(response) {
                //something went wrong, need to create a new error because returning the response object doesn't work. Get an unreferenced error when handling the reject.
                var errorResponse = new Object();
                errorResponse.status = response.status;
                errorResponse.data = response.data;
                return $q.reject(errorResponse);
            });
    }

    this.unfollowUser = function(id) {
        var url = 'https://api.soundcloud.com/me/followings/' + id + '?oauth_token=' + $window.scAccessToken;

        return $http.delete(url)
            .then(function(response) {
                if (typeof response.data === 'object') {
                    return response.data;
                } else {
                    //invalid response
                    return $g.reject(response.data);
                }
            }, function(response) {
                //something went wrong, need to create a new error because returning the response object doesn't work. Get an unreferenced error when handling the reject.
                var errorResponse = new Object();
                errorResponse.status = response.status;
                errorResponse.data = response.data;
                return $q.reject(errorResponse);
            });
    }

    /*
     * Soundcloud API is behaving strangely. If "me" is following "id"
     * the api sends a "303 - See other" but in the Location header it doesn't append the authentication
     * information so the redirect fails with a 401 - Unauthorized. If "me" isn't following "id"
     * the API returns a 404 Not Found error.
     */
    this.isFollowing = function(id) {
        var url = 'https://api.soundcloud.com/me/followings/' + id + '?oauth_token=' + $window.scAccessToken
            , that = this;

        return $http.get(url)
            .then(function(response) {
                if (typeof response.data === 'object') {
                    return response.data;
                } else {
                    //invalid response
                    return $g.reject(response.data);
                }
            }, function(response) {
                //something went wrong which is good
                return response.status;
            });
    }


});
