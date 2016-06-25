var ws = new WebSocket('ws://' + document.location.host + '/__remote_control');

['prev', 'playpause', 'next'].forEach(function (control) {
    document.getElementById(control).addEventListener('click', function(event) {
        event.preventDefault();
        ws.send(control);
    });
});

ws.onmessage = function(message) {
    var msg = JSON.parse(message.data);
    switch (msg.id) {
        case 'init':
            var icon = msg.playing ? 'pause' : 'play';
            document.getElementById('playpause').className = 'fa fa-' + icon;
            var output = '';
            msg.queue.forEach(function(track) {
                output += '<li><h2><img src="' + track.songThumbnail + '">' + track.songTitle + '</h2><h3>' + track.songUser + '</h3></li>';
            });
            document.getElementById('queue').innerHTML = '<ul>' + output + '</ul>';
            break;
        case 'playState':
            var icon = msg.playing ? 'pause' : 'play';
            document.getElementById('playpause').className = 'fa fa-' + icon;
            break;
    }
}
