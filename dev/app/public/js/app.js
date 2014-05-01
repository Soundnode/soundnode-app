'use strict'

var app = angular.module('App', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '../app/views/stream.html', 
            controller: 'StreamCtrl'
        })
        .when('/favorites', {
            templateUrl: '../app/views/favorites.html', 
            controller: 'FavoritesCtrl'
        })
        .when('/tracks', {
            templateUrl: '../app/views/tracks.html', 
            controller: 'TracksCtrl'
        })
        .when('/playlists', {
            templateUrl: '../app/views/playlists.html', 
            controller: 'PlaylistsCtrl'
        })
        .when('/following', {
            templateUrl: '../app/views/following.html', 
            controller: 'FollowingCtrl'
        })
        .otherwise({  redirectTo: '/' });
});