'use strict'

var app = angular.module('App', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '../app/views/stream.html', 
            controller: 'streamController'
        })
        .when('/favorites', {
            templateUrl: '../app/views/favorites.html', 
            controller: 'favoritesController'
        })
        .when('/tracks', {
            templateUrl: '../app/views/tracks.html', 
            controller: 'tracksController'
        })
        .when('/playlists', {
            templateUrl: '../app/views/playlists.html', 
            controller: 'playlistsController'
        })
        .when('/following', {
            templateUrl: '../app/views/following.html', 
            controller: 'followingController'
        })
        .otherwise({  redirectTo: '/' });
});