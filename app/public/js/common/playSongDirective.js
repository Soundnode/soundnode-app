app.directive('playSong', function () {
    return {
        restrict: 'A',
        link: function ($scope, elem, attrs ) {
            var url, thumbnail, title, user
                , player = document.getElementById('player');

            elem.bind('click', function () {
                url = attrs.playingUrl + '?client_id=' + window.scClientId;
                thumbnail = attrs.playingThumbnail.replace('large',  'crop');
                title = attrs.playingTitle;
                user = attrs.playingUser;

                $scope.playSong(url, thumbnail, title, user);
                player.addEventListener('ended', function() {
                    console.log('song ended');
                    $scope.goToNextSong();
                });
            });

            $scope.playSong = function (url, thumbnail, title, user) {
                player.setAttribute('src', url);
                document.getElementById('playerThumb').setAttribute('src', thumbnail);
                document.getElementById('playerThumb').setAttribute('alt', title);
                document.getElementById('playerTitle').innerHTML = title;
                document.getElementById('playerTitle').setAttribute('title', title);
                document.getElementById('playerUser').innerHTML = user;
                player.play();
            };

            $scope.goToNextSong = function () {
                var elParent;

                elParent = elem.parent().parent().next().children()[1];

                if ( elParent !== undefined ) {
                    elParent.children[0].click();
                }
            }
        }
    }
});