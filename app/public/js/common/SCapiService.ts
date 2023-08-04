'use strict';

app.service('SCapiService', function (
  $http,
  $window,
  $q,
  $log,
  $state,
  $stateParams,
  $rootScope
) {

  /**
   * Responsible to store next url for pagination request
   * @type {string}
   */
  let next_page = '';

  /**
   * Responsible to set loading component
   * when a network method is happening
   * @method isLoading
   */
  this.isLoading = function () {
    $rootScope.isLoading = true;
  };

  /**
   * Check if track is streamable
   */
  this.checkRateLimit = function (urlStream) {
    return $http.get(urlStream)
      .then(function (response) {
        console.log('Limit not reached.')
        if (response.status === 429) {
          return false;
        }
      }, function (response) {
        console.log('Limit has been reached.')
        // something went wrong
        return $q.reject(response.data.errors[0].meta.reset_time);
      });
  }

  this.get = function (endpoint: string, params: string) {

    const url = 'https://api.soundcloud.com/' + endpoint + '.json?' + params + '&oauth_token=' + $window.scAccessToken;
    const that = this;

    this.isLoading();

    return $http.get(url)
      .then(function (response, status) {
        if (response.status === 200) {
          if (response.data.next_href !== null || response.data.next_href !== undefined) {
            next_page = response.data.next_href;
          } else {
            next_page = '';
          }
          return response.data;
        }
      }, function (response) {
        // something went wrong
        return $q.reject(response.data);
      });
  };

  /**
   * Responsible to request next page data and save new next_page url
   * @returns {Object} data
   */
  this.getNextPage = function () {
    if (!next_page) {
      return $q.reject('No next page URL');
    }

    const url = next_page + '&oauth_token=' + $window.scAccessToken + '&linked_partitioning=1'
      , that = this;

    this.isLoading();

    return $http.get(url)
      .then(function (response) {
        if (response.status === 200) {
          if (response.data.next_href !== null || response.data.next_href !== undefined) {
            next_page = response.data.next_href;
          }
          return response.data;
        } else {
          // invalid response
          return $q.reject(response.data);
        }

      }, function (response) {
        // something went wrong
        return $q.reject(response.data);
      });
  };

  /**
   * Responsible to get the followed users.
   * @return {[object]} data response
   */
  this.getFollowing = function (endpoint: string) {
    this.isLoading();

    const url = 'https://api.soundcloud.com/me/' + endpoint + '.json?limit=25&oauth_token=' + $window.scAccessToken
      + '&linked_partitioning=1'
      , that = this;

    return $http.get(url)
      .then(function (response) {
        if (response.status === 200) {
          if (response.data.next_href !== null || response.data.next_href !== undefined) {
            next_page = response