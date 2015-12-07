'use strict';

var app = angular.module('App', [
    'ui.router',
    'ngSanitize',
    'cfp.hotkeys',
    'infinite-scroll',
    'ngDialog'
]);

app.config(function (
    $stateProvider,
    $urlRouterProvider,
    hotkeysProvider
) {

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
        .state('track', {
            url: '/track/:id',
            templateUrl: 'views/track/track.html',
            controller: 'TrackCtrl'
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
        .state('tag', {
            url: '/tag/:name',
            templateUrl: 'views/tag/tag.html',
            controller: 'tagCtrl'
        })
        .state('following', {
            url: '/following',
            templateUrl: 'views/following/following.html',
            controller: 'FollowingCtrl'
        })
        .state('followers', {
            url: '/followers',
            templateUrl: 'views/followers/followers.html',
            controller: 'FollowersCtrl'
        })
        .state('profile', {
            url: '/profile/:id',
            templateUrl: 'views/profile/profile.html',
            controller: 'ProfileCtrl'
        })
        .state('settings', {
            url: '/settings',
            templateUrl: 'views/settings/settings.html',
            controller: 'SettingsCtrl'
        })
        .state('news', {
            url: '/news',
            templateUrl: 'views/news/news.html',
            controller: 'NewsCtrl'
        });
});

app.run(function(
    $rootScope,
    $log,
    $state,
    SCapiService,
    hotkeys
) {

    //start GA
    window.settings.visitor.pageview("/").send();

    // toastr config override
    toastr.options.positionClass = 'toast-bottom-right';
    toastr.options.timeOut = 4000;

    $rootScope.oldView = "";
    $rootScope.currentView = "";

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        $rootScope.oldView = fromState.name;
        $rootScope.currentView = toState.name;

        // set GA page/view
        if ( toState.name === "" ) {
            window.settings.visitor.pageview("/").send();
        } else {
            window.settings.visitor.pageview(toState.name).send();
        }

    });

    // disable cmd (ctrl) + click to open a new tab/page
    document.addEventListener('click', function(e) {
        if ( e.metaKey ) {
            e.preventDefault();
        }
    }, false);

    hotkeys.add({
        combo: ['command+/', 'ctrl+/'],
        description: 'Open devtools',
        callback: function() {
            guiConfig.openDevTools();
        }
    });

    hotkeys.add({
        combo: ['mod+,'],
        description: 'Open Settings',
        callback: function() {
            $state.go('settings');
        }
    });

    hotkeys.add({
        combo: ['mod+0'],
        description: 'Reset Window Scale to 1',
        callback: function() {
            userConfig.scaleWindow("reset");
        }
    });

    hotkeys.add({
        combo: ['mod+=', 'mod++'],
        description: 'Zoom in +0.1',
        callback: function() {
            userConfig.scaleWindow("plus");
        }
    });

    hotkeys.add({
        combo: ['mod+-'],
        description: 'Zoom out -0.1',
        callback: function() {
            userConfig.scaleWindow("minus");
        }
    });

});

angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 200);
