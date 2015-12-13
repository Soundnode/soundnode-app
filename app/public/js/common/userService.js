'use strict';

app.service('userService', function (
    SCapiService,
    $q
) {

    /**
     * Store response from SoundCloud of current user profile
     * @type {object}
     */
    var cachedUser = null;

    /**
     * Request current user profile, return cached response if available
     * @return {promise}
     */
    this.getUser = function () {
        if (cachedUser !== null) {
            var deferred = $q.defer();
            deferred.resolve(cachedUser);
            return deferred.promise;
        }

        return SCapiService.get('me')
            .then(function (data) {
                cachedUser = data;
                return data;
            });
    };

    /**
     * Get current user profile id to make requests to API using this id
     * @return {promise}
     */
    this.getUserId = function () {
        return this.getUser()
            .then(function (user) {
                return user.id;
            });
    };

});
