app.directive('playSong', function () {
    return {
        restrict: 'A',
        link: function ($scope, elem, attrs ) {
            var url, thumbnail, title, user
                , currentEl
                , player = document.getElementById('player')
                , playerThumb = document.getElementById('playerThumb')
                , playerTitle = document.getElementById('playerTitle')
                , playerUser = document.getElementById('playerUser');

            elem.bind('click', function () {
                currentEl = this;
                url = attrs.playingUrl + '?client_id=' + window.scClientId;
                thumbnail = attrs.playingThumbnail.replace('large',  'crop');
                title = attrs.playingTitle;
                user = attrs.playingUser;;

                $(this).addClass('currentSong');

                $scope.playSong(url, thumbnail, title, user);
            });

            $(player).off().on('ended', function() {
                console.log('song ended');
                $scope.goToNextSong();
            });

            $scope.playSong = function (url, thumbnail, title, user) {
                player.setAttribute('src', url);
                playerThumb.setAttribute('src', thumbnail);
                playerThumb.setAttribute('alt', title);
                playerTitle.innerHTML = title;
                playerTitle.setAttribute('title', title);
                playerUser.innerHTML = user;
                player.play();
            };

            $scope.removeCurrentSong = function() {
                $('.currentSong').removeClass('currentSong');
            };

            $scope.goToNextSong = function () {
                var $elParent
                    , $nextSong
                    , $nextListSong
                    , $currentSong = $('.currentSong')
                    , $isLastChild = $currentSong.closest('li').is(':last-child');

                if ( $currentSong.attr('data-play-list') === 'true' ) {

                    $elParent = $currentSong.closest('.songList_item_songs_list_item');
                    $nextSong = $currentSong.closest('.songList_item_songs_list_item').next().find('*[play-song]');

                    if ( ! $isLastChild ) {
                        $scope.removeCurrentSong();
                        $nextSong.click();
                    } else {
                        $nextListSong = $currentSong.closest('.songList_item_songs_list').next().find('li:first-child').find('*[play-song]');

                        if ( ! $isLastChild ) {
                            $scope.removeCurrentSong();
                            $nextListSong.click();
                        }
                    }
                } else {
                    $elParent = $('.currentSong').closest('.songList_item')
                    $nextSong = $elParent.next().find('*[play-song]');

                    if ( ! $isLastChild ) {
                        $scope.removeCurrentSong();
                        $nextSong.click();
                    }
                }

            }
        }
    }
});