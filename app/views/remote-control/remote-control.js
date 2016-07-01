var ws = new WebSocket('ws://' + document.location.host + '/__remote_control');

['prev', 'playpause', 'next'].forEach(function(control) {
    document.getElementById(control).addEventListener('click', function(event) {
        event.preventDefault();
        ws.send(control);
    });
});

var playing = function(msg) {
    var icon = msg.playing ? 'pause' : 'play';
    document.getElementById('playpause').className = 'fa fa-' + icon;
}

var progress = function(msg) {
    document.getElementById('progress').style.width = msg.progress + 'vw';
}

var queue = function(msg) {
    console.log(msg);
    var output = '';
    msg.queue.forEach(function(track, id) {
        output += id === msg.position ? '<li class="active">' : '<li>';
        output += '<img src="';
        output += track.songThumbnail === '' ? '/placeholder.png' : track.songThumbnail;
        output += '"><h2>' + track.songTitle + '</h2><h3>' + track.songUser + '</h3></li>';
    });
    document.getElementById('queue').innerHTML = '<ul>' + output + '</ul>';
}

var position = function(msg) {
    if (document.getElementsByClassName('active').length === 1) {
        document.getElementsByClassName('active')[0].className = '';
    }
    if (document.querySelectorAll('#queue li').length > msg.position) {
        document.querySelectorAll('#queue li')[msg.position].className = 'active';
    }
}

ws.onmessage = function(message) {
    var msg = JSON.parse(message.data);
    switch (msg.id) {
        case 'init':
            playing(msg);
            progress(msg);
            queue(msg);
            position(msg);
            break;
        case 'playing':
            playing(msg);
            break;
        case 'progress':
            progress(msg);
            break;
        case 'position':
            position(msg);
            break;
    }
}
