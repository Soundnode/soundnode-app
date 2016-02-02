'use strict';

// Service to work with SoundCloud API v2
// Note: v2 API is not officially supported by SoundCloud yet,
// be careful using these methods, because they might stop working at any moment

app.service('SC2apiService', function (
    $rootScope,
    $window,
    $http,
    $q,
    modalFactory
) {

    /**
     * Soundcloud v2 API endpoint
     * @type {String}
     */
    var SOUNDCLOUD_API_V2 = 'https://api-v2.soundcloud.com/';

    /**
     * Store URL of the next page, when acessing resource supporting pagination
     * @type {String}
     */
    var nextPageUrl = '';


    // Public API

    /**
     * Get current user stream
     * @return {promise}
     */
    this.getStream = function () {
        var params = {
            limit: 30
        };
        return sendRequest('stream', { params: params })
            .then(onResponseSuccess)
            .then(updateNextPageUrl)
            .catch(onResponseError);
    };

    /**
     * Get charts (top 50)
     * @returns {Promise.<T>}
     */
    this.getCharts = function (genre) {
        // kind=top&genre=soundcloud%3Agenres%3Aall-music&limit=50

        var params = {
            kind: 'top',
            genre: 'soundcloud:genres:'+genre,
            limit: 50
        };
        return sendRequest('charts', { params: params })
            .then(onResponseSuccess)
            .then(updateNextPageUrl)
            .catch(onResponseError);
    };

    /**
     * Get next page for last requested resource
     * @return {promise}
     */
    this.getNextPage = function () {
        if (!nextPageUrl) {
            return $q.reject('No next page URL');
        }
        return sendRequest(nextPageUrl)
            .then(onResponseSuccess)
            .then(updateNextPageUrl)
            .catch(onResponseError);
    };

    /**
     * Get extended information about particular tracks
     * @param  {array} ids - tracks ids
     * @return {promise}
     */
    this.getTracksByIds = function (ids) {
        var params = {
            urns: ids.map(function (trackId) {
                return 'soundcloud:tracks:' + trackId.toString();
            }).join(',')
        };
        return sendRequest('tracks', { params: params })
            .then(onResponseSuccess)
            .catch(onResponseError);
    };

    // Private methods

    /**
     * Utility method to send http request
     * @param  {resource} resource - url part with resource name
     * @param  {object} config   - options for $http
     * @param  {object} options  - custom options (show loading, etc)
     * @return {promise}
     */
    function sendRequest(resource, config, options) {
        config = config || {};
        // Check if passed absolute url
        if (resource.indexOf('http') === 0) {
            config.url = resource;
        } else {
            config.url = SOUNDCLOUD_API_V2 + resource;
        }
        config.params = config.params || {};
        config.params.oauth_token = $window.scAccessToken;

        options = options || {};
        if (options.loading !== false) {
            $rootScope.isLoading = true;
        }

        return $http(config);
    }

    /**
     * Response success handler
     * @param  {object} response - $http response object
     * @return {object}          - response data
     */
    function onResponseSuccess(response) {
        if (response.status !== 200) {
            return $q.reject(response.data);
        }
        return response.data;
    }

    /**
     * Response error handler
     * @param  {object} response - $http response object
     * @return {promise}
     */
    function onResponseError(response) {
        if (response.status === 429) {
            modalFactory.rateLimitReached();
        }
        return $q.reject(response.data);
    }

    /**
     * Update value of the next page for paginatable resources
     * @param  {data} data - response data
     * @return {object}    - pass through data to use function in promise chain
     */
    function updateNextPageUrl(data) {
        nextPageUrl = data.next_href || '';
        return data;
    }

});
