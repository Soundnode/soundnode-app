'use strict';

var app = angular.module('App', ['ui.router', 'ngSanitize', 'cfp.hotkeys', 'infinite-scroll', 'ngDialog']);

app.config(function ($stateProvider, $urlRouterProvider, hotkeysProvider) {

    // Hotkeys config
    hotkeysProvider.includeCheatSheet = false;

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

app.run(function($rootScope, $log, SCapiService, hotkeys) {
    // toastr config override
    toastr.options.positionClass = 'toast-bottom-right';
    toastr.options.timeOut = 4000;

    $rootScope.oldView = "";
    $rootScope.currentView = "";

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        $rootScope.oldView = fromState.name;
        $rootScope.currentView = toState.name;
    });

    // shortcut to open devtools
    hotkeys.add({
        combo: ['command+/', 'ctrl+/'],
        description: 'Open devtools',
        callback: function() {
            appGUI.openDevTools();
        }
    });

});

angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 200);
