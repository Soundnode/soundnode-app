'use strict'

var app = angular.module('App', ['ui.router', 'ngSanitize', 'cfp.hotkeys', 'infinite-scroll', 'ngDialog']);

app.config(function ($stateProvider, $urlRouterProvider) {

    // unmatched url redirect to /
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('stream', {
            url: '/',
            templateUrl: 'views/stream/stream.html',
            controller: 'StreamCtrl'
        })
        .state('favorites', {
            url: '/favorites',
            templateUrl: 'views/favorites/favorites.html',
            controller: 'FavoritesCtrl'
        })
        .state('tracks', {
            url: '/tracks',
            templateUrl: 'views/tracks/tracks.html',
            controller: 'TracksCtrl'
        })
        .state('playlists', {
            url: '/playlists',
            templateUrl: 'views/playlists/playlists.html',
            controller: 'PlaylistsCtrl'
        })
        .state('search', {
            url: '/search?q',
            templateUrl: 'views/search/search.html',
            controller: 'searchCtrl'
        })
        .state('following', {
            url: '/following',
            templateUrl: 'views/following/following.html',
            controller: 'FollowingCtrl'
        })
        .state('profile', {
            url: '/profile/:id',
            templateUrl: 'views/profile/profile.html',
            controller: 'ProfileCtrl'
    });
});

angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 1500);