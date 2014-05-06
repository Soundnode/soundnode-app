app.directive('playSong', function () {
    return {
        restrict: 'A',
        link: function ($scope, elem, attrs ) {
            var url
                , player
                , htmlPlayer
                , playerBox = document.getElementById('playerBox');

            $scope.playSong = function (url) {
                htmlPlayer = '<audio id="player" controls autoplay src="' + url + '"></audio>';
                playerBox.innerHTML = htmlPlayer;
            };

            $scope.goToNextSong = function () {
                var parent;

                console.log(elem)

                parent = elem.parentNode.parentNode;
                console.log(parent)
            }

            elem.bind('click', function () {
                url = this.getAttribute('data-url') + '?client_id=' + window.scClientId;
                $scope.playSong(url);
                player = document.getElementById('player');
                player.addEventListener('ended', function() {
                    if ( player.currentTime === player.played.end(0) ) {
                        $scope.goToNextSong();
                    }
                });
            });
        }
    }
});