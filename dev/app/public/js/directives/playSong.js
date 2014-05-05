app.directive('playSong', function () {
    // <audio src="http://api.soundcloud.com/tracks/81827374/stream?client_id=my_id"></audio>
    return {
        restrict: 'A',
        link: function ($scope, elem, attrs ) {
            var url
                , player;
            
            elem.bind('click', function () {
                url = this.getAttribute('data-url') + '?client_id=' + window.scClientId;
                console.log( url )
                player = '<audio id="player" controls src="' + url + '"></audio>';
                console.log( player )
                document.getElementById('playerBox').innerHTML = player;
            });
        }
    }
});