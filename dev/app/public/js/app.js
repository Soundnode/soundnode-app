'use strict'

var app = angular.module('App', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '../app/views/stream.html', 
            controller: 'streamCtrl'
        })
        .when('/favorites', {
            templateUrl: '../app/views/favorites.html', 
            controller: 'favoritesCtrl'
        })
        .when('/tracks', {
            templateUrl: '../app/views/tracks.html', 
            controller: 'tracksCtrl'
        })
        .when('/playlists', {
            templateUrl: '../app/views/playlists.html', 
            controller: 'playlistsCtrl'
        })
        .when('/following', {
            templateUrl: '../app/views/following.html', 
            controller: 'followingCtrl'
        })
        .otherwise({  redirectTo: '/' });
});