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


    this.getStaticAddress = function () {
        return 'https://api.soundcloud.com/' ;
    }


    this.authorize = function () {
        return '&oauth_token=' + $window.scAccessToken;
    }


    this.getRequest = function (url , that) {
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
    }

    /**
     * Responsible to request next page data and save new next_page url
     * @returns {Object} data
     */
    this.getNextPage = function() {
        var url = this.next_page + this.authorize() + '&linked_partitioning=1'
            , that = this;
        this.isLoading();
        return  this.getRequest(url , that);
    };

    /**
     * Responsible to get the followed users.
     * @return {[object]} data response
     */
    this.getFollowing = function () {
        this.isLoading();

        var endpoint = 'me/followings';
        var url = this.getStaticAddress() + endpoint + '.json?' + this.authorize()
            + '&linked_partitioning=1'
            , that = this;
        return this.getRequest(url , that);
    }


    /**
     * Responsible to get profile data, i.e, user name, description etc.
     * @return {[object]} data response
     */
    this.getProfile = function(userId) {
        var endpoint = 'users/' + userId;
        var url = this.getStaticAddress() + endpoint + '.json?' + this.authorize(),
            that = this;
        return this.getRequest(url , that);
    };

    /**
     * Responsible to get profile tracks.
     * @return {[object]} data response
     */
    this.getProfileTracks = function(userId) {
        var endpoint = 'users/' + userId + '/tracks';
        var param = 'limit=15';
        var url = this.getStaticAddress() + endpoint + '.json?' + param + this.authorize()
            + '&linked_partitioning=1'
        , that = this;
        return this.getRequest(url , that);
    };

    /**
     * Responsible to save song to SC favorites
     * @return {[object]} data response
     */
    this.saveFavorite = function(userId, songId) {
        var endpoint = 'users/' + userId + '/favorites/' + songId;
        var url = this.getStaticAddress() + endpoint + '.json?' + this.authorize()
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
        var endpoint = 'users/' + userId + '/favorites/' + songId;
        var url = this.getStaticAddress() + endpoint + '.json?' + this.authorize()
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
        var endpoint = 'tracks';
        var url = this.getStaticAddress() + endpoint + '.json?linked_partitioning=1&limit=' + limit + '&q=' + query + this.authorize()
            , that = this;
        return this.getRequest(url , that);
    }

    this.followUser = function(id) {
        var endpoint = 'me/followings/' + id;
        var url = this.getStaticAddress() + endpoint + '?oauth_token=' + $window.scAccessToken;

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
        var endpoint = 'me/followings/' + id;
        var url = this.getStaticAddress() + endpoint + '?oauth_token=' + $window.scAccessToken;

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
        var endpoint = 'me/followings/' + id;
        var url = this.getStaticAddress() + endpoint + '?oauth_token=' + $window.scAccessToken
            , that = this;
        return this.getRequest(url , that);
    }


    /**
     * Responsible to make get request to get the favorites
     * @method getFavorites
     */
    this.getFavorites = function() {
        var endpoint = 'me/favorites';
        var url = this.getStaticAddress() + endpoint + '.json?' + this.authorize()
        , that = this;
        this.isLoading();
        return this.getRequest(url , that);
    };


    /**
     * Responsible to make get request to get the streams
     * @method getStreams
     */
    this.getStreams = function() {
        var endpoint = 'me/activities' , params = 'limit=33';
        var url = this.getStaticAddress() + endpoint + '.json?' + params + this.authorize()
        , that = this;
        this.isLoading();
        return this.getRequest(url , that);
    };



    /**
     * Responsible to make get request to get the tracks
     * @method getTracks
     */
    this.getTracks = function() {
        var endpoint = 'me/tracks', params = 'limit=33';
        var url = this.getStaticAddress() + endpoint + '.json?' + params + this.authorize()
        , that = this;
        this.isLoading();
        return this.getRequest(url, that);
    };



    /**
     * Responsible to make get request to get the playlists
     * @method getPlaylists
     */
    this.getPlaylists = function() {
        var endpoint = 'me/playlists';
        var url = this.getStaticAddress() + endpoint + '.json?' + this.authorize()
        , that = this;
        this.isLoading();
        return this.getRequest(url , that);
    };


    /**
     * Responsible to make get request
     * @method getUser
     */
    this.getUser = function() {
        var endpoint = 'me';
        var url = this.getStaticAddress() + endpoint + '.json?' + this.authorize()
        , that = this;
        this.isLoading();
        return this.getRequest(url , that);
    };

});
