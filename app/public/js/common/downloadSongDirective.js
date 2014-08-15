"use strict";

app.directive('downloadSong', function($rootScope, $log) {
    return {
        restrict: 'A',
        link: function($scope, elem, attrs) {
            var songUrl, folderPath
                , songTitle, elInput;

            elem.bind('click', function(e) {
                e.preventDefault();
                songTitle = attrs.title;
                songUrl = attrs.href;
                elInput = this.nextElementSibling;
                elInput.click();

                elInput.addEventListener('change', function() {
                    folderPath = this.value;
                    $log.log(songTitle + ' ' + songUrl, folderPath);
                    appSystem.saveSong(songTitle, songUrl, folderPath);
                }, false);
            });
        }
    }
});