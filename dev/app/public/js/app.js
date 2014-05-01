'use strict'

var app = angular.module('App', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {

    // unmatched url redirect to /
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('stream', {
            url: "/",
            templateUrl: '../app/views/stream.html', 
            controller: 'StreamCtrl'
        })
        .state('favorites', {
            url: "/favorites",
            templateUrl: '../app/views/favorites.html', 
            controller: 'FavoritesCtrl'
        })
        .state('tracks', {
            url: "/tracks",
            templateUrl: '../app/views/tracks.html', 
            controller: 'TracksCtrl'
        })
        .state('playlists', {
            url: "/playlists",
            templateUrl: '../app/views/playlists.html', 
            controller: 'PlaylistsCtrl'
        })
        .state('following', {
            url: "/following",
            templateUrl: '../app/views/following.html', 
            controller: 'FollowingCtrl'
        });
});