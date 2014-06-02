app.service('SCapiService', function($http, $window, $q) {

    /**
     * Responsible to store next url for pagination request
     * @type {String}
     */
    this.next_page = '';

    this.get = function(endpoint, params) {

        var url = 'https://api.soundcloud.com/me/' + endpoint + '.json?' + params + '&oauth_token=' + $window.scAccessToken
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
     * Responsible to request user info from SC API
     * @return {string} user data
     */
    this.getUser = function() {
        var url = 'https://api.soundcloud.com/me.json?oauth_token=' + $window.scAccessToken;

        return $http.get(url)
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

    this.getNextPage = function(url) {
        var url = this.next_page + '&oauth_token=' + $window.scAccessToken
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
    }

});