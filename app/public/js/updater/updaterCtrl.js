app.controller('UpdaterCtrl', function($scope, $http, $window) {
    var url = 'https://api.github.com/repos/Soundnode/soundnode-app/releases',
        config = {
            headers: {
                'Accept': 'application/vnd.github.v3.raw+json'
            }
        };

    $scope.updateAvailable = false;
    $scope.updateAvailableText = 'Update available!';
    $scope.isUpdating = false;
    $scope.restartAvailable = false;

    $scope.launchUpdater = function() {
        if ($scope.isUpdating) {
            return false;
        }
        $scope.isUpdating = true;
        $scope.updateAvailableText = 'Updating!';

        var http = require('http'),
            fs = require('fs'),
            AdmZip = require(process.cwd() + '/deps/adm-zip'),
            OS = 'win';

        if (process.platform === "darwin") {
            OS = 'mac';
        }

        http.request('http://www.soundnodeapp.com/downloads/' + OS + '/Soundnode-App.zip', function(response) {
            var file = fs.createWriteStream('./temp.zip');
            $scope.updateAvailableText = 'Update downloading.';
            response.on('data', function(chunk) {
                file.write(chunk);
            }).on('end', function() {
                file.end();
                $scope.updateAvailableText = 'Update downloaded.';
                var zip = new AdmZip('./temp.zip');
                zip.extractAllTo('./', true);
                fs.unlinkSync('./temp.zip');
                $scope.updateAvailableText = 'Update finished, click here to restart.';
                $scope.restartAvailable = true;
            });
        }).on('error', function(error) {
            $scope.updateAvailableText = 'Update failed.';
            console.log('Error downloading update', error);
        }).end();
    };

    $scope.restart = function() {
        require("child_process").spawn(process.execPath, [], {
            detached: true
        }).unref();
        appGUI.close();
    };

    $http.get(url, config)
        .success(function(data) {
            var release = data[0],
                isMasterRelease = release.target_commitish === 'master';

            if (isMasterRelease) {
                if ($window.settings.appVersion < release.tag_name) {
                    $scope.updateAvailable = true;
                }
            }
        })
        .error(function(error) {
            console.log('Error checking if is a new version available', error);
        });
});
