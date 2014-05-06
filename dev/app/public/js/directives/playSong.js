app.directive('playSong', function () {
    return {
        restrict: 'A',
        link: function ($scope, elem, attrs ) {
            var url
                , player;
            
            elem.bind('click', function () {
                url = this.getAttribute('data-url') + '?client_id=' + window.scClientId;
                console.log( url )
                player = '<audio id="player" controls autoplay src="' + url + '"></audio>';
                console.log( player )
                document.getElementById('playerBox').innerHTML = player;
            });
        }
    }
});