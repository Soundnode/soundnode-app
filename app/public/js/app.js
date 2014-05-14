'use strict'

var app = angular.module('App', ['ui.router']);

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
        .state('following', {
            url: '/following',
            templateUrl: 'views/following/following.html',
            controller: 'FollowingCtrl'
        })
        .state('search', {
            url: '/search?q',
            templateUrl: 'views/search/search.html',
            controller: 'searchCtrl'
        });
});