'use strict'

var app = angular.module('App', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {

    // unmatched url redirect to /
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('stream', {
            url: '/',
            templateUrl: '../app/views/stream/stream.html',
            controller: 'StreamCtrl'
        })
        .state('favorites', {
            url: '/favorites',
            templateUrl: '../app/views/favorites/favorites.html',
            controller: 'FavoritesCtrl'
        })
        .state('tracks', {
            url: '/tracks',
            templateUrl: '../app/views/tracks/tracks.html',
            controller: 'TracksCtrl'
        })
        .state('playlists', {
            url: '/playlists',
            templateUrl: '../app/views/playlists/playlists.html',
            controller: 'PlaylistsCtrl'
        })
        .state('following', {
            url: '/following',
            templateUrl: '../app/views/following/following.html',
            controller: 'FollowingCtrl'
        })
        .state('search', {
            url: '/search?q',
            templateUrl: '../app/views/search/search.html',
            controller: 'searchCtrl'
        });
});