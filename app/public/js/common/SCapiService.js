app.service('SCapiService', function($http, $window, $q) {

    this.get = function(endpoint, params) {

        var url = 'https://api.soundcloud.com/me/' + endpoint + '.json' + params + '&oauth_token=' + $window.scAccessToken;

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

    this.getUser = function() {
        var url = 'https://api.soundcloud.com/me.json?oauth_token=' + $window.scAccessToken;

        console.log('url', url)

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
    }
});