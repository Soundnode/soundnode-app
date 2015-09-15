app.controller('UpdaterCtrl', function($scope, $http, $window) {
    var url = 'https://api.github.com/repos/Soundnode/soundnode-app/releases'
        , config = { headers:  {
                    'Accept': 'application/vnd.github.v3.raw+json'
                }
            };

    $scope.updateAvailable = false;
    $scope.label = 'Update available!';

    $http.get(url, config)
        .success(function (data) {
            var release = data[0]
                , isMasterRelease = release.target_commitish === 'master';

            if ( isMasterRelease ) {
                if ( $window.settings.appVersion < release.tag_name ) {
                    $scope.updateAvailable = true;
                }
            }
        })
        .error(function (error) {
            console.log('Error checking if is a new version available', error);
        });

    /**
     * Open dialog to choose where
     * the new version should be saved
     */
    $scope.openDialog = function() {
        var inputEl = document.querySelector('#updater');
        inputEl.click();
    };

    function addEventListener() {
        var chooser = document.querySelector('#updater');
        chooser.addEventListener("change", function(evt) {
            getNewVersion(this.value);
        }, false);
    }

    updaterEvent.on("started", function () {
        console.log("event has occured");
        $scope.label = 'Downloading...';
    });

    updaterEvent.on("error", function () {
        console.log("event has occured");
        $scope.label = 'Error :(';
    });

    updaterEvent.on("done", function () {
        console.log("event has occured");
        $scope.label = 'Done!';
    });

    addEventListener();

});